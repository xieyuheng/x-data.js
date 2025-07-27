import { LexerConfig, type LexerOptions } from "../lexer/index.ts"
import { type Token } from "../token/index.ts"
import { Lexing } from "./Lexing.ts"

export class Lexer {
  config: LexerConfig

  constructor(options: LexerOptions) {
    this.config = new LexerConfig(options)
  }

  lex(text: string): Array<Token> {
    return Array.from(new Lexing(this, text))
  }
}
