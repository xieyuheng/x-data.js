import { spanReport, type Position } from "../span/index.ts"
import { urlRelativeToCwd } from "../utils/url/urlRelativeToCwd.ts"
import { type TokenMeta } from "./Token.ts"

export function tokenMetaReport(meta: TokenMeta): string {
  let message = ""
  if (meta.url) {
    message += `--> ${urlRelativeToCwd(meta.url)}:${formatPosition(meta.span.start)}\n`
  }

  message += spanReport(meta.span, meta.text)
  return message
}

function formatPosition(position: Position): string {
  return `${position.row + 1}:${position.column + 1}`
}
