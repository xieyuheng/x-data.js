import { tokenMetaReport, type TokenMeta } from "../token/index.ts"

export class ErrorWithMeta extends Error {
  meta: TokenMeta

  constructor(message: string, meta: TokenMeta) {
    super(report(message, meta))
    this.meta = meta
  }
}

function report(message: string, meta: TokenMeta): string {
  message += "\n"
  message += tokenMetaReport(meta)
  return message
}
