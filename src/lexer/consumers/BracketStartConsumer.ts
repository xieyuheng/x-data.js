import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class BracketStartConsumer implements Consumer {
  kind = "BracketStart" as const

  canConsume(lexer: Lexer): boolean {
    const char = lexer.char()
    return lexer.config.brackets.map(({ start }) => start).includes(char)
  }

  consume(lexer: Lexer): string {
    const char = lexer.char()
    lexer.forward(1)
    return char
  }
}
