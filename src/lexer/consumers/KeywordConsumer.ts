import { stringIsSymbol } from "../../data/index.ts"
import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"
import { consumeSymbol } from "./SymbolConsumer.ts"

export class KeywordConsumer implements Consumer {
  kind = "Keyword" as const

  canConsume(lexer: Lexer): boolean {
    const word = lexer.word()
    return word.startsWith(":") && stringIsSymbol(word.slice(1))
  }

  consume(lexer: Lexer): string {
    return consumeSymbol(lexer)
  }
}
