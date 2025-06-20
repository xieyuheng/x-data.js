import * as X from "../data/index.ts"
import { type Data } from "../data/index.ts"
import { InternalError, ParsingError } from "../errors/index.ts"
import { type Lexer } from "../lexer/index.ts"
import { initPosition } from "../position/index.ts"
import {
  Span,
  spanFromAttributes,
  spanToAttributes,
  spanUnion,
} from "../span/index.ts"
import { Token } from "../token/index.ts"

type Result = { data: Data; remain: Array<Token> }

export class Parsing {
  lexer: Lexer
  index = 0

  constructor(lexer: Lexer) {
    this.lexer = lexer
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
        if (token.value === "#f") {
          return {
            data: X.Bool(false, spanToAttributes(token.span)),
            remain: tokens.slice(1),
          }
        }

        if (token.value === "#t") {
          return {
            data: X.Bool(true, spanToAttributes(token.span)),
            remain: tokens.slice(1),
          }
        }

        if (token.value.startsWith("#")) {
          throw new ParsingError(
            `unknown special symbol: ${token.value}`,
            token.span,
          )
        }

        return {
          data: X.String(token.value, spanToAttributes(token.span)),
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
            data: X.Int(value, spanToAttributes(token.span)),
            remain: tokens.slice(1),
          }
        } else {
          return {
            data: X.Float(value, spanToAttributes(token.span)),
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
          data: X.String(value, spanToAttributes(token.span)),
          remain: tokens.slice(1),
        }
      }

      case "BracketStart": {
        if (token.value === "[") {
          const { data, remain } = this.parseList(token, tokens.slice(1))
          return { data: X.Cons(X.String("make-list"), data), remain }
        } else {
          return this.parseList(token, tokens.slice(1))
        }
      }

      case "BracketEnd": {
        throw new ParsingError(`I found extra BracketEnd`, token.span)
      }

      case "Quote": {
        const { data, remain } = this.parse(tokens.slice(1))

        const quoteSymbol = X.String(
          this.lexer.config.findQuoteSymbolOrFail(token.value),
          spanToAttributes(token.span),
        )

        return {
          data: X.List(
            [quoteSymbol, data],
            spanToAttributes(
              spanUnion(token.span, spanFromAttributes(data.attributes)),
            ),
          ),
          remain,
        }
      }
    }
  }

  private parseList(start: Token, tokens: Array<Token>): Result {
    const array: Array<X.Data> = []
    const attributes: X.Attributes = {}

    while (true) {
      if (tokens[0] === undefined) {
        throw new ParsingError(`Missing BracketEnd`, start.span)
      }

      const token = tokens[0]

      if (token.kind === "BracketEnd") {
        if (!this.lexer.config.matchBrackets(start.value, token.value)) {
          throw new ParsingError(`I expect a matching BracketEnd`, token.span)
        }

        return {
          data: X.List(array, {
            ...attributes,
            ...spanToAttributes(spanUnion(start.span, token.span)),
          }),
          remain: tokens.slice(1),
        }
      }

      if (token.kind === "Symbol" && token.value.startsWith(":")) {
        const head = this.parse(tokens.slice(1))
        attributes[token.value.slice(1)] = head.data
        tokens = head.remain
        continue
      }

      const head = this.parse(tokens)
      array.push(head.data)
      tokens = head.remain
    }
  }
}
