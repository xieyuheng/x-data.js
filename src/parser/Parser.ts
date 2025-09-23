import * as X from "../data/index.ts"
import { type Data } from "../data/index.ts"
import { ErrorWithMeta } from "../errors/index.ts"
import { Lexer, lexerMatchBrackets } from "../lexer/index.ts"
import { spanUnion } from "../span/index.ts"
import { tokenMetaToDataMeta, type Token } from "../token/index.ts"

type Result = { data: Data; remain: Array<Token> }

export type ParserMeta = {
  url?: URL
}

export class Parser {
  lexer = new Lexer()

  parse(text: string, meta: ParserMeta = {}): Array<Data> {
    let tokens = this.lexer.lex(text, meta)
    const array: Array<Data> = []
    while (tokens.length > 0) {
      const { data, remain } = this.handleTokens(tokens)
      array.push(data)
      if (remain.length === 0) return array

      tokens = remain
    }

    return array
  }

  private handleTokens(tokens: Array<Token>): Result {
    if (tokens[0] === undefined) {
      let message = "I expect a token, but there is no token remain\n"
      throw new Error(message)
    }

    const token = tokens[0]

    switch (token.kind) {
      case "Symbol": {
        return {
          data: X.String(token.value, tokenMetaToDataMeta(token.meta)),
          remain: tokens.slice(1),
        }
      }

      case "Number": {
        const value = JSON.parse(token.value)
        if (typeof value !== "number") {
          let message = `I expect value to be a JSON number: ${value}\n`
          throw new Error(message)
        }

        if (token.value.includes(".") || token.value.includes("e")) {
          return {
            data: X.Float(value, tokenMetaToDataMeta(token.meta)),
            remain: tokens.slice(1),
          }
        } else {
          return {
            data: X.Int(value, tokenMetaToDataMeta(token.meta)),
            remain: tokens.slice(1),
          }
        }
      }

      case "DoubleQoutedString": {
        const value = JSON.parse(token.value)
        if (typeof value !== "string") {
          let message = `I expect value to be a JSON string: ${value}\n`
          throw new Error(message)
        }

        return {
          data: X.List(
            [
              X.String("@quote", tokenMetaToDataMeta(token.meta)),
              X.String(value, tokenMetaToDataMeta(token.meta)),
            ],
            tokenMetaToDataMeta(token.meta),
          ),
          remain: tokens.slice(1),
        }
      }

      case "BracketStart": {
        if (token.value === "[") {
          const { data, remain } = this.handleTokensInBracket(
            token,
            tokens.slice(1),
          )
          return { data: X.Cons(X.String("@tael"), data), remain }
        }

        if (token.value === "{") {
          const { data, remain } = this.handleTokensInBracket(
            token,
            tokens.slice(1),
          )
          return { data: X.Cons(X.String("@set"), data), remain }
        }

        return this.handleTokensInBracket(token, tokens.slice(1))
      }

      case "BracketEnd": {
        let message = `I found extra BracketEnd\n`
        throw new ErrorWithMeta(message, token.meta)
      }

      case "QuotationMark": {
        const { data, remain } = this.handleTokens(tokens.slice(1))

        const quoteTable: Record<string, string> = {
          "'": "@quote",
          ",": "@unquote",
          "`": "@quasiquote",
        }

        const quoteSymbol = X.String(
          quoteTable[token.value],
          tokenMetaToDataMeta(token.meta),
        )

        return {
          data: X.List([quoteSymbol, data], tokenMetaToDataMeta(token.meta)),
          remain,
        }
      }

      case "Keyword": {
        let message = `I found keyword at wrong place\n`
        throw new ErrorWithMeta(message, token.meta)
      }
    }
  }

  private handleTokensInBracket(start: Token, tokens: Array<Token>): Result {
    const array: Array<X.Data> = []
    const attributes: X.Attributes = {}

    while (true) {
      if (tokens[0] === undefined) {
        let message = `I found missing BracketEnd\n`
        throw new ErrorWithMeta(message, start.meta)
      }

      const token = tokens[0]

      if (token.kind === "BracketEnd") {
        if (!lexerMatchBrackets(start.value, token.value)) {
          let message = `I expect a matching BracketEnd\n`
          throw new ErrorWithMeta(message, token.meta)
        }

        return {
          data: X.Tael(
            array,
            attributes,
            tokenMetaToDataMeta({
              ...token.meta,
              span: spanUnion(start.meta.span, token.meta.span),
            }),
          ),
          remain: tokens.slice(1),
        }
      }

      if (token.kind === "Keyword") {
        const head = this.handleTokens(tokens.slice(1))
        attributes[token.value.slice(1)] = head.data
        tokens = head.remain
        continue
      }

      const head = this.handleTokens(tokens)
      array.push(head.data)
      tokens = head.remain
    }
  }
}
