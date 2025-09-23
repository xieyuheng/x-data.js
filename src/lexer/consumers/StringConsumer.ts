import { ErrorWithMeta } from "../../errors/ErrorWithMeta.ts"
import { positionForwardChar } from "../../span/Position.ts"
import { jsonParseString } from "../../utils/json/jsonParse.ts"
import type { Consumer } from "../Consumer.ts"
import type { Lexer } from "../Lexer.ts"

export class StringConsumer implements Consumer {
  kind = "String" as const

  canConsume(lexer: Lexer): boolean {
    return lexer.char() === '"'
  }

  consume(lexer: Lexer): string {
    const line = lexer.line()
    let index = 2 // over first `"` and the folloing char.
    while (index <= line.length) {
      const head = line.slice(0, index)
      const str = jsonParseString(head)
      if (str === undefined) {
        index++
      } else {
        lexer.forward(index)
        return head
      }
    }

    const start = lexer.position
    const end = positionForwardChar(start, '"')
    let message = `Fail to parse JSON string: ${line}\n`
    throw new ErrorWithMeta(message, {
      span: { start, end },
      text: lexer.text,
      url: lexer.url,
    })
  }
}
