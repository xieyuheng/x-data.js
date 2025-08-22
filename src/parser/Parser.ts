import * as X from "../data/index.ts"
import { type Data } from "../data/index.ts"
import { ParsingError } from "../errors/index.ts"
import { Lexer } from "../lexer/index.ts"
import { spanUnion } from "../span/index.ts"
import { tokenMetaToDataMeta, type Token } from "../token/index.ts"

type Result = { data: Data; remain: Array<Token> }

export type ParserMeta = {
  url?: URL
}

export class Parser {
  lexer = new Lexer({
    quotes: [
      { mark: "'", symbol: "quote" },
      { mark: ",", symbol: "unquote" },
      { mark: "`", symbol: "quasiquote" },
    ],
    brackets: [
      { start: "(", end: ")" },
      { start: "[", end: "]" },
      { start: "{", end: "}" },
    ],
    comments: [";"],
  })

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
        if (token.value === "#f") {
          return {
            data: X.Bool(false, tokenMetaToDataMeta(token.meta)),
            remain: tokens.slice(1),
          }
        }

        if (token.value === "#t") {
          return {
            data: X.Bool(true, tokenMetaToDataMeta(token.meta)),
            remain: tokens.slice(1),
          }
        }

        return {
          data: X.Symbol(token.value, tokenMetaToDataMeta(token.meta)),
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

      case "String": {
        const value = JSON.parse(token.value)
        if (typeof value !== "string") {
          let message = `I expect value to be a JSON string: ${value}\n`
          throw new Error(message)
        }

        return {
          data: X.String(value, tokenMetaToDataMeta(token.meta)),
          remain: tokens.slice(1),
        }
      }

      case "BracketStart": {
        if (token.value === "[") {
          const { data, remain } = this.handleTokensInBracket(
            token,
            tokens.slice(1),
          )
          return { data: X.Cons(X.Symbol("tael"), data), remain }
        } else {
          return this.handleTokensInBracket(token, tokens.slice(1))
        }
      }

      case "BracketEnd": {
        let message = `I found extra BracketEnd\n`
        throw new ParsingError(message, token.meta)
      }

      case "Quote": {
        const { data, remain } = this.handleTokens(tokens.slice(1))

        const quoteSymbol = X.Symbol(
          this.lexer.config.findQuoteSymbolOrFail(token.value),
          tokenMetaToDataMeta(token.meta),
        )

        return {
          data: X.List([quoteSymbol, data], tokenMetaToDataMeta(token.meta)),
          remain,
        }
      }
    }
  }

  private handleTokensInBracket(start: Token, tokens: Array<Token>): Result {
    const array: Array<X.Data> = []
    const attributes: X.Attributes = {}

    while (true) {
      if (tokens[0] === undefined) {
        let message = `I found missing BracketEnd\n`
        throw new ParsingError(message, start.meta)
      }

      const token = tokens[0]

      if (token.kind === "BracketEnd") {
        if (!this.lexer.config.matchBrackets(start.value, token.value)) {
          let message = `I expect a matching BracketEnd\n`
          throw new ParsingError(message, token.meta)
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

      if (token.kind === "Symbol" && token.value.startsWith(":")) {
        const head = this.handleTokens(tokens.slice(1))
        if (head.data.kind === "Symbol" && head.data.content.startsWith(":")) {
          let message = `I found key after key in attributes\n`
          throw new ParsingError(message, token.meta)
        }

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
