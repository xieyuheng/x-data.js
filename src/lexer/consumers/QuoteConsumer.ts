import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class QuoteConsumer implements Consumer {
  kind = "Quote" as const

  canConsume(lexer: Lexer): boolean {
    const char = lexer.char()
    return lexer.config.quotes.includes(char)
  }

  consume(lexer: Lexer): string {
    const char = lexer.char()
    lexer.forward(1)
    return char
  }
}
