import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class NumberConsumer implements Consumer {
  kind = "Number" as const

  canConsume(lexer: Lexer): boolean {
    const text = lexer.remain().split("\n")[0] || ""
    return lastSuccessAt(lexer, text) !== undefined
  }

  consume(lexer: Lexer): string {
    const text = lexer.remain().split("\n")[0] || ""
    const index = lastSuccessAt(lexer, text)
    if (index === undefined) {
      let message = `Expect to find lastSuccessAt in text: ${text}\n`
      throw new Error(message)
    }

    lexer.forward(index)
    return text.slice(0, index)
  }
}

function lastSuccessAt(lexer: Lexer, text: string): number | undefined {
  let index = 0
  let lastSuccessAt: number | undefined = undefined
  while (index <= text.length) {
    const head = text.slice(0, index)
    const result = tryToParseNumber(head)
    if (
      result !== undefined &&
      text[index - 1] !== undefined &&
      text[index - 1].trim() !== "" &&
      (text[index] === undefined ||
        text[index].trim() === "" ||
        lexer.config.isMark(text[index]))
    ) {
      lastSuccessAt = index
    }

    index++
  }

  return lastSuccessAt
}

function tryToParseNumber(text: string): number | undefined {
  try {
    const value = JSON.parse(text)
    if (typeof value === "number") return value
    else return undefined
  } catch (error) {
    return undefined
  }
}
