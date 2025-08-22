import { spanReport } from "../span/index.ts"
import { type TokenMeta } from "../token/index.ts"

export class ParsingError extends Error {
  meta: TokenMeta

  constructor(message: string, meta: TokenMeta) {
    super(message)
    this.meta = meta
  }

  report(): string {
    let message = this.message
    message += "\n"
    message += spanReport(this.meta.span, this.meta.text)
    return message
  }
}
