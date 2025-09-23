import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class SpaceConsumer implements Consumer {
  kind = undefined

  canConsume(lexer: Lexer): boolean {
    const char = lexer.char()
    return char.trim() === ""
  }

  consume(lexer: Lexer): string {
    const char = lexer.char()
    let value = char
    lexer.forward(1)
    while (!lexer.isEnd() && lexer.char().trim() === "") {
      value += lexer.char()
      lexer.forward(1)
    }

    return value
  }
}
