import { jsonParseNumber } from "../../utils/json/jsonParse.ts"
import { stringIsBlank } from "../../utils/string/stringIsBlank.ts"
import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class NumberConsumer implements Consumer {
  kind = "Number" as const

  canConsume(lexer: Lexer): boolean {
    const word = lexer.word()
    return lastSuccessAt(lexer, word) !== undefined
  }

  consume(lexer: Lexer): string {
    const word = lexer.word()
    const index = lastSuccessAt(lexer, word)
    if (index === undefined) {
      let message = `Expect to find lastSuccessAt in word: ${word}\n`
      throw new Error(message)
    }

    lexer.forward(index)
    return word.slice(0, index)
  }
}

function lastSuccessAt(lexer: Lexer, text: string): number | undefined {
  let index = 0
  let lastSuccessAt: number | undefined = undefined
  while (index <= text.length) {
    const head = text.slice(0, index)
    const value = jsonParseNumber(head)
    const lastChar = text[index - 1]
    const nextChar = text[index]
    if (
      value !== undefined &&
      !stringIsBlank(lastChar) &&
      (nextChar === undefined ||
        stringIsBlank(nextChar) ||
        lexer.config.isMark(nextChar))
    ) {
      lastSuccessAt = index
    }

    index++
  }

  return lastSuccessAt
}
