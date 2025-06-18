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
          data: X.Symbol(token.value, spanToData(token.span).attributes),
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

      // case "BracketStart": {
      //   return this.parseList(
      //     token,
      //     tokens.slice(1),
      //     Sexps.Null(token.span),
      //   )
      // }

      // case "BracketEnd": {
      //   throw new ParsingError(`I found extra BracketEnd`, token.span)
      // }

      // case "Quote": {
      //   const { sexp, remain } = this.parse(tokens.slice(1))

      //   const first = Sexps.Sym(
      //     this.parser.config.findQuoteSymbolOrFail(token.value),
      //     token.span,
      //   )

      //   const second = Sexps.Cons(
      //     sexp,
      //     Sexps.Null(token.span),
      //     token.span.union(sexp.span),
      //   )

      //   return {
      //     sexp: Sexps.Cons(first, second, first.span.union(second.span)),
      //     remain,
      //   }
      // }

      default: {
        throw new Error("TODO")
      }
    }
  }
}
