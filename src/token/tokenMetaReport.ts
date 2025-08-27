import { spanReport } from "../span/index.ts"
import { type TokenMeta } from "./Token.ts"

export function tokenMetaReport(meta: TokenMeta): string {
  return spanReport(meta.span, meta.text)
}
