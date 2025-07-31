import * as X from "../data/index.ts"
import { dataFromJson, type Data } from "../data/index.ts"
import { InternalError, ParsingError } from "../errors/index.ts"
import { type Lexer } from "../lexer/index.ts"
import { initPosition, spanFromData, spanUnion } from "../span/index.ts"
import { type Token } from "../token/index.ts"

type Result = { data: Data; remain: Array<Token> }

export class Parsing {
  lexer: Lexer
  index = 0

  constructor(lexer: Lexer) {
    this.lexer = lexer
  }

  parse(tokens: Array<Token>): Result {
    if (tokens[0] === undefined) {
      throw new ParsingError("I expect a token, but there is no token remain", {
        start: initPosition(),
        end: initPosition(),
      })
    }

    const token = tokens[0]

    switch (token.kind) {
      case "Symbol": {
        if (token.value === "#f") {
          return {
            data: X.Bool(false, { span: dataFromJson(token.span) }),
            remain: tokens.slice(1),
          }
        }

        if (token.value === "#t") {
          return {
            data: X.Bool(true, { span: dataFromJson(token.span) }),
            remain: tokens.slice(1),
          }
        }

        if (token.value.startsWith("#")) {
          throw new ParsingError(
            `I found unknown special symbol: ${token.value}`,
            token.span,
          )
        }

        return {
          data: X.Symbol(token.value, { span: dataFromJson(token.span) }),
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

        if (token.value.includes(".") || token.value.includes("e")) {
          return {
            data: X.Float(value, { span: dataFromJson(token.span) }),
            remain: tokens.slice(1),
          }
        } else {
          return {
            data: X.Int(value, { span: dataFromJson(token.span) }),
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
          data: X.List([
            X.Symbol("quote"),
            X.Symbol(value, { span: dataFromJson(token.span) }),
          ]),
          remain: tokens.slice(1),
        }
      }

      case "BracketStart": {
        if (token.value === "[") {
          const { data, remain } = this.parseTael(token, tokens.slice(1))
          return { data: X.Cons(X.Symbol("tael"), data), remain }
        } else {
          return this.parseTael(token, tokens.slice(1))
        }
      }

      case "BracketEnd": {
        throw new ParsingError(`I found extra BracketEnd`, token.span)
      }

      case "Quote": {
        const { data, remain } = this.parse(tokens.slice(1))

        const quoteSymbol = X.Symbol(
          this.lexer.config.findQuoteSymbolOrFail(token.value),
          { span: dataFromJson(token.span) },
        )

        return {
          data: X.List([quoteSymbol, data], {
            span: dataFromJson(
              spanUnion(token.span, spanFromData(data.meta["span"])),
            ),
          }),
          remain,
        }
      }
    }
  }

  private parseTael(start: Token, tokens: Array<Token>): Result {
    const array: Array<X.Data> = []
    const attributes: X.Attributes = {}

    while (true) {
      if (tokens[0] === undefined) {
        throw new ParsingError(`I found missing BracketEnd`, start.span)
      }

      const token = tokens[0]

      if (token.kind === "BracketEnd") {
        if (!this.lexer.config.matchBrackets(start.value, token.value)) {
          throw new ParsingError(`I expect a matching BracketEnd`, token.span)
        }

        return {
          data: X.Tael(array, attributes, {
            span: dataFromJson(spanUnion(start.span, token.span)),
          }),
          remain: tokens.slice(1),
        }
      }

      if (token.kind === "Symbol" && token.value.startsWith(":")) {
        const head = this.parse(tokens.slice(1))
        if (head.data.kind === "Symbol" && head.data.content.startsWith(":")) {
          throw new ParsingError(
            `I found key after key in attributes`,
            token.span,
          )
        }

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
