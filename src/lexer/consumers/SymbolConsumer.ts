import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class SymbolConsumer implements Consumer {
  kind = "Symbol" as const

  canConsume(lexer: Lexer): boolean {
    return true
  }

  consume(lexer: Lexer): string {
    return consumeSymbol(lexer)
  }
}

export function consumeSymbol(lexer: Lexer): string {
  let value = lexer.char()
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
