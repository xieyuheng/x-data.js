import assert from "node:assert"
import { LexerConfig, type LexerOptions } from "../lexer/index.ts"
import type { ParserMeta } from "../parser/index.ts"
import { initPosition, positionForwardChar } from "../span/index.ts"
import { type Token } from "../token/index.ts"
import { useCharHandlers } from "./CharHandler.ts"

export class Lexer {
  config: LexerConfig
  position = initPosition()
  text: string = ""
  url?: URL

  constructor(options: LexerOptions) {
    this.config = new LexerConfig(options)
  }

  lex(text: string, meta: ParserMeta = {}): Array<Token> {
    this.text = text
    this.url = meta.url
    this.position = initPosition()

    const tokens: Array<Token> = []
    while (!this.isEnd()) {
      const token = tryHandlers(this)
      if (token === undefined) continue
      tokens.push(token)
    }

    return tokens
  }

  isEnd(): boolean {
    return this.text.length === this.position.index
  }

  char(): string {
    const char = this.text[this.position.index]
    assert(char !== undefined)
    return char
  }

  rest(): string {
    return this.text.slice(this.position.index)
  }

  forward(count: number): void {
    if (this.isEnd()) return

    while (count-- > 0) {
      this.position = positionForwardChar(this.position, this.char())
    }
  }
}

function tryHandlers(lexer: Lexer): Token | undefined {
  for (const handler of useCharHandlers()) {
    if (handler.canHandle(lexer)) {
      const start = lexer.position
      const value = handler.handle(lexer)
      if (handler.kind === undefined) return undefined

      const end = lexer.position
      return {
        kind: handler.kind,
        value,
        meta: {
          span: { start, end },
          text: lexer.text,
          url: lexer.url,
        },
      }
    }
  }

  let message = `Can not handle char: ${lexer.char()}\n`
  throw new Error(message)
}
