import { formatSexp } from "../format/index.ts"
import * as pp from "../helper/ppml/index.ts"
import { isTael, type Sexp } from "../sexp/index.ts"

export function prettySexp(maxWidth: number, sexp: Sexp): string {
  return pp.format(maxWidth, renderSexp(sexp))
}

export function renderSexp(sexp: Sexp): pp.Node {
  if (isTael(sexp)) {
    const elements = renderSexps(sexp.elements)
    const attributes = renderAttributes(Object.entries(sexp.attributes))
    if (
      sexp.elements.length === 0 &&
      Object.keys(sexp.attributes).length === 0
    ) {
      return pp.text("()")
    } else if (Object.keys(sexp.attributes).length === 0) {
      return pp.group(pp.text("("), pp.indent(1, elements), pp.text(")"))
    } else if (sexp.elements.length === 0) {
      return pp.group(pp.text("("), pp.indent(1, attributes), pp.text(")"))
    } else {
      return pp.group(
        pp.text("("),
        pp.group(pp.indent(1, attributes)),
        pp.indent(1, pp.br()),
        pp.group(pp.indent(1, elements)),
        pp.text(")"),
      )
    }
  }

  return pp.text(formatSexp(sexp))
}

function renderSexps(sexps: Array<Sexp>): pp.Node {
  return pp.mapWithBreak(renderSexp, sexps)
}

function renderAttribute([key, sexp]: [string, Sexp]): pp.Node {
  return pp.group(pp.text(`:${key}`), pp.br(), renderSexp(sexp))
}

function renderAttributes(entries: Array<[string, Sexp]>): pp.Node {
  return pp.mapWithBreak(renderAttribute, entries)
}
