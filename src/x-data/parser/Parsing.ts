import * as X from "../data/index.ts"
import { type Data } from "../data/index.ts"
import { InternalError, ParsingError } from "../errors/index.ts"
import { Parser } from "../parser/index.ts"
import { Position } from "../position/index.ts"
import { Span } from "../span/index.ts"
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
        new Span(Position.init(), Position.init()),
      )
    }

    switch (tokens[0].kind) {
      case "Symbol": {
        return {
          // TODO span to attributes: tokens[0].span
          data: X.Symbol(tokens[0].value),
          remain: tokens.slice(1),
        }
      }

      case "Number": {
        const value = JSON.parse(tokens[0].value)
        if (typeof value !== "number") {
          throw new InternalError(
            `I expect value to be a JSON number: ${value}`,
          )
        }

        // TODO span to attributes: tokens[0].span
        if (Number.isInteger(value)) {
          return {
            data: X.Int(value),
            remain: tokens.slice(1),
          }
        } else {
          return {
            data: X.Float(value),
            remain: tokens.slice(1),
          }
        }
      }

      case "String": {
        const value = JSON.parse(tokens[0].value)
        if (typeof value !== "string") {
          throw new InternalError(
            `I expect value to be a JSON string: ${value}`,
          )
        }

        // TODO span to attributes: tokens[0].span
        return {
          data: X.String(value),
          remain: tokens.slice(1),
        }
      }

      // case "ParenthesisStart": {
      //   return this.parseList(
      //     tokens[0],
      //     tokens.slice(1),
      //     Sexps.Null(tokens[0].span),
      //   )
      // }

      // case "ParenthesisEnd": {
      //   throw new ParsingError(`I found extra ParenthesisEnd`, tokens[0].span)
      // }

      // case "Quote": {
      //   const { sexp, remain } = this.parse(tokens.slice(1))

      //   const first = Sexps.Sym(
      //     this.parser.config.findQuoteSymbolOrFail(tokens[0].value),
      //     tokens[0].span,
      //   )

      //   const second = Sexps.Cons(
      //     sexp,
      //     Sexps.Null(tokens[0].span),
      //     tokens[0].span.union(sexp.span),
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
