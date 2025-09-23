import { type Token } from "../token/index.ts"
import { useConsumers } from "./Consumer.ts"
import { Lexer } from "./Lexer.ts"

export function consume(lexer: Lexer): Token | undefined {
  for (const handler of useConsumers()) {
    if (handler.canHandle(lexer)) {
      const start = lexer.position
      const value = handler.handle(lexer)
      if (handler.kind === undefined) {
        return undefined
      }

      const end = lexer.position
      return {
        kind: handler.kind,
        value,
        meta: {
          span: { start, end },
          text: lexer.text,
          url: lexer.url,
        },
      }
    }
  }

  let message = `Can not handle char: ${lexer.char()}\n`
  throw new Error(message)
}
