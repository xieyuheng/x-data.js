import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class NumberConsumer implements Consumer {
  kind = "Number" as const

  canConsume(lexer: Lexer): boolean {
    const char = lexer.char()
    const text = lexer.rest().split("\n")[0] || ""
    return this.lastSuccessAt(lexer, text) !== undefined
  }

  consume(lexer: Lexer): string {
    const char = lexer.char()
    const text = lexer.rest().split("\n")[0] || ""
    const index = this.lastSuccessAt(lexer, text)
    if (index === undefined) {
      let message = `Expect to find lastSuccessAt in text: ${text}\n`
      throw new Error(message)
    }

    lexer.forward(index)
    return text.slice(0, index)
  }

  private lastSuccessAt(lexer: Lexer, text: string): number | undefined {
    let index = 0
    let lastSuccessAt: number | undefined = undefined
    while (index <= text.length) {
      const head = text.slice(0, index)
      const result = this.tryToParseNumber(head)
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

  private tryToParseNumber(text: string): number | undefined {
    try {
      const value = JSON.parse(text)
      if (typeof value === "number") return value
      else return undefined
    } catch (error) {
      return undefined
    }
  }
}
