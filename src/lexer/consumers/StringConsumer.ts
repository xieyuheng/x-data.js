import { ErrorWithMeta } from "../../errors/ErrorWithMeta.ts"
import { positionForwardChar } from "../../span/Position.ts"
import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class StringConsumer implements Consumer {
  kind = "String" as const

  canConsume(lexer: Lexer): boolean {
    const char = lexer.char()
    return char === '"'
  }

  consume(lexer: Lexer): string {
    const text = lexer.rest().split("\n")[0] || ""
    let index = 2 // over first `"` and the folloing char.
    while (index <= text.length) {
      const head = text.slice(0, index)
      const str = tryToParseString(head)
      if (str === undefined) {
        index++
      } else {
        lexer.forward(index)
        return head
      }
    }

    const start = lexer.position
    const end = positionForwardChar(start, '"')
    let message = `Fail to parse JSON string: ${text}\n`
    throw new ErrorWithMeta(message, {
      span: { start, end },
      text: lexer.text,
      url: lexer.url,
    })
  }
}

function tryToParseString(text: string): string | undefined {
  try {
    return JSON.parse(text)
  } catch (error) {
    return undefined
  }
}
