import { spanReport } from "../span/index.ts"
import { type TokenMeta } from "../token/index.ts"

export class ParsingError extends Error {
  meta: TokenMeta

  constructor(message: string, meta: TokenMeta) {
    super(report(message, meta))
    this.meta = meta
  }
}

function report(message: string, meta: TokenMeta): string {
  message += "\n"
  message += spanReport(meta.span, meta.text)
  return message
}
