import { LexerConfig, type LexerOptions } from "../lexer/index.ts"
import { type Token } from "../token/index.ts"
import { Lexing } from "./Lexing.ts"

export class Lexer {
  config: LexerConfig

  constructor(options: LexerOptions) {
    this.config = new LexerConfig(options)
  }

  lex(text: string): Array<Token> {
    const lexing = new Lexing(this, text)
    const tokens: Array<Token> = []
    while (true) {
      const token = lexing.next()
      if (token) {
        tokens.push(token)
      } else {
        return tokens
      }
    }
  }
}
