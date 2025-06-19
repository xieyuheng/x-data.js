import { type Data } from "../data/index.ts"
import { ParsingError } from "../errors/index.ts"
import { Lexer } from "../lexer/index.ts"
import { ParserConfig, type ParserOptions } from "../parser/index.ts"
import { Token } from "../token/index.ts"
import { Parsing } from "./Parsing.ts"

export class Parser {
  lexer: Lexer
  config: ParserConfig

  constructor(options: ParserOptions) {
    this.lexer = new Lexer(options)
    this.config = this.lexer.config
  }

  parseData(text: string): Data {
    const tokens = this.lexer.lex(text)
    const { data, remain } = this.parseDataFromTokens(tokens)
    if (remain.length !== 0) {
      throw new ParsingError(
        `I expect to consume all the tokens, but there are ${remain.length} tokens remain.`,
        remain[0].span,
      )
    }

    return data
  }

  parseDataArray(text: string): Array<Data> {
    const array: Array<Data> = []
    let tokens = this.lexer.lex(text)
    while (tokens.length > 0) {
      const { data, remain } = this.parseDataFromTokens(tokens)
      array.push(data)
      if (remain.length === 0) return array
      tokens = remain
    }

    return array
  }

  private parseDataFromTokens(tokens: Array<Token>): {
    data: Data
    remain: Array<Token>
  } {
    const parsing = new Parsing(this)
    return parsing.parse(tokens)
  }
}
