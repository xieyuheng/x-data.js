import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class CommentConsumer implements Consumer {
  kind = undefined

  canConsume(lexer: Lexer): boolean {
    const text = lexer.char() + lexer.rest()
    return lexer.config.comments.some((prefix) => text.startsWith(prefix))
  }

  consume(lexer: Lexer): string {
    let value = lexer.char()
    lexer.forward(1)
    while (!lexer.isEnd() && lexer.char() !== "\n") {
      value += lexer.char()
      lexer.forward(1)
    }

    return value
  }
}
