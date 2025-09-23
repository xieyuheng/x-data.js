import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"
import { consumeDoubleQoutedString } from "./StringConsumer.ts"

export class StringKeywordConsumer implements Consumer {
  kind = "Keyword" as const

  canConsume(lexer: Lexer): boolean {
    return lexer.remain().startsWith(':"')
  }

  consume(lexer: Lexer): string {
    lexer.forward(1)
    return consumeDoubleQoutedString(lexer)
  }
}
