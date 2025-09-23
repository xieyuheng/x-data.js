import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class BracketEndConsumer implements Consumer {
  kind = "BracketEnd" as const

  canConsume(lexer: Lexer): boolean {
    const char = lexer.char()
    return lexer.config.brackets.map(({ end }) => end).includes(char)
  }

  consume(lexer: Lexer): string {
    const char = lexer.char()
    lexer.forward(1)
    return char
  }
}
