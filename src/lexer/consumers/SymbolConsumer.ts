import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class SymbolConsumer implements Consumer {
  kind = "Symbol" as const

  canConsume(lexer: Lexer): boolean {
    const char = lexer.char()
    return true
  }

  consume(lexer: Lexer): string {
    const char = lexer.char()
    let value = char
    lexer.forward(1)
    while (
      !lexer.isEnd() &&
      lexer.char().trim() !== "" &&
      !lexer.config.marks.includes(lexer.char())
    ) {
      value += lexer.char()
      lexer.forward(1)
    }

    return value
  }
}
