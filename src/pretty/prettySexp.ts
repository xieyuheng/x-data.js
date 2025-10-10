import * as pp from "../helper/ppml/index.ts"
import type { Sexp } from "../sexp/index.ts"

export function prettySexp(maxWidth: number, sexp: Sexp): string {
  return pp.format(maxWidth, renderSexp(sexp))
}

export function renderSexp(sexp: Sexp): pp.Node {
  return pp.text("TODO")
}
