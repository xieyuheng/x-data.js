import assert from "node:assert"
import { LexerConfig, type LexerOptions } from "../lexer/index.ts"
import type { ParserMeta } from "../parser/index.ts"
import { initPosition, positionForwardChar } from "../span/index.ts"
import { type Token } from "../token/index.ts"
import { useCharHandlers } from "./CharHandler.ts"

export class Lexer {
  config: LexerConfig
  position = initPosition()
  handlers = useCharHandlers(this)
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
      const token = this.handleChar()
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

  private handleChar(): Token | undefined {
    for (const handler of this.handlers) {
      if (handler.canHandle(this)) {
        const start = this.position
        const value = handler.handle(this)
        if (handler.kind === undefined) return undefined

        const end = this.position
        return {
          kind: handler.kind,
          value,
          meta: {
            span: { start, end },
            text: this.text,
            url: this.url,
          },
        }
      }
    }

    let message = `Can not handle char: ${this.char()}\n`
    throw new Error(message)
  }
}
