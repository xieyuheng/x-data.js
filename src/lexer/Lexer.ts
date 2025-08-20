import { InternalError } from "../errors/InternalError.ts"
import { LexerConfig, type LexerOptions } from "../lexer/index.ts"
import { initPosition, positionForwardChar } from "../span/Position.ts"
import { type Token } from "../token/index.ts"
import { useCharHandlers } from "./CharHandler.ts"

export class Lexer {
  config: LexerConfig
  position = initPosition()
  handlers = useCharHandlers(this)
  text: string = ""

  constructor(options: LexerOptions) {
    this.config = new LexerConfig(options)
  }

  lex(text: string): Array<Token> {
    this.text = text
    const tokens: Array<Token> = []
    while (true) {
      const token = this.next()
      if (token) {
        tokens.push(token)
      } else {
        return tokens
      }
    }
  }

  get char(): string | undefined {
    return this.text[this.position.index]
  }

  get rest(): string {
    return this.text.slice(this.position.index)
  }

  forward(count: number): void {
    if (this.char === undefined) return

    while (count-- > 0) {
      this.position = positionForwardChar(this.position, this.char)
    }
  }

  next(): Token | undefined {
    while (this.char !== undefined) {
      const result = this.handleChar(this.char)
      if (result !== undefined) return result
    }

    return undefined
  }

  private handleChar(char: string): Token | undefined {
    for (const handler of this.handlers) {
      if (handler.canHandle(char)) {
        const start = this.position
        const value = handler.handle(char)
        if (handler.kind === undefined) return undefined
        const end = this.position
        const span = { start, end }
        const token = { kind: handler.kind, value, span }
        return token
      }
    }

    throw new InternalError(`Can not handle char: ${char}`)
  }
}
