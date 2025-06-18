import * as X from "../data/index.ts"
import { type Data } from "../data/index.ts"
import { InternalError, ParsingError } from "../errors/index.ts"
import { Parser } from "../parser/index.ts"
import { initPosition } from "../position/index.ts"
import { Span, spanToData } from "../span/index.ts"
import { Token } from "../token/index.ts"

type Result = { data: Data; remain: Array<Token> }

export class Parsing {
  parser: Parser
  index = 0

  constructor(parser: Parser) {
    this.parser = parser
  }

  parse(tokens: Array<Token>): Result {
    if (tokens[0] === undefined) {
      throw new ParsingError(
        "I expect to see a token, but there is no token remain.",
        new Span(initPosition(), initPosition()),
      )
    }

    const token = tokens[0]

    switch (token.kind) {
      case "Symbol": {
        return {
          data: X.String(token.value, spanToData(token.span).attributes),
          remain: tokens.slice(1),
        }
      }

      case "Number": {
        const value = JSON.parse(token.value)
        if (typeof value !== "number") {
          throw new InternalError(
            `I expect value to be a JSON number: ${value}`,
          )
        }

        if (Number.isInteger(value)) {
          return {
            data: X.Int(value, spanToData(token.span).attributes),
            remain: tokens.slice(1),
          }
        } else {
          return {
            data: X.Float(value, spanToData(token.span).attributes),
            remain: tokens.slice(1),
          }
        }
      }

      case "String": {
        const value = JSON.parse(token.value)
        if (typeof value !== "string") {
          throw new InternalError(
            `I expect value to be a JSON string: ${value}`,
          )
        }

        return {
          data: X.String(value, spanToData(token.span).attributes),
          remain: tokens.slice(1),
        }
      }

      case "BracketStart": {
        return this.parseList(
          token,
          tokens.slice(1),
          X.List([], spanToData(token.span).attributes),
        )
      }

      case "BracketEnd": {
        throw new ParsingError(`I found extra BracketEnd`, token.span)
      }

      case "Quote": {
        const { data, remain } = this.parse(tokens.slice(1))

        const first = X.String(
          this.parser.config.findQuoteSymbolOrFail(token.value),
          spanToData(token.span).attributes,
        )

        // TODO spanUnion(token.span, data.span)
        const second = X.List([data], data.attributes)

        // TODO spanUnion(first.span, second.span)
        return {
          data: X.Cons(first, second, second.attributes),
          remain,
        }
      }

      default: {
        throw new Error("TODO")
      }
    }
  }

  private parseList(start: Token, tokens: Array<Token>, list: X.List): Result {
    if (tokens[0] === undefined) {
      throw new ParsingError(`Missing BracketEnd`, start.span)
    }

    const token = tokens[0]

    if (token.kind === "Symbol" && token.value === ".") {
      const { data, remain } = this.parse(tokens.slice(1))

      if (remain[0] === undefined) {
        throw new ParsingError(`Missing BracketEnd`, start.span)
      }

      if (!this.parser.config.matchBrackets(start.value, remain[0].value)) {
        throw new ParsingError(`I expect a matching BracketEnd`, remain[0].span)
      }

      return { data, remain: remain.slice(1) }
    }

    if (token.kind === "BracketEnd") {
      if (!this.parser.config.matchBrackets(start.value, token.value)) {
        throw new ParsingError(`I expect a matching BracketEnd`, token.span)
      }

      list.attributes = spanToData(token.span).attributes

      return { data: list, remain: tokens.slice(1) }
    }

    const head = this.parse(tokens)
    const { data, remain } = this.parseList(start, head.remain, list)

    // TODO call spanUnion
    return {
      data: X.Cons(head.data, data, data.attributes),
      // data: X.Cons(head.data, data, spanUnion(head.data.span, data.span)),
      remain,
    }
  }
}
