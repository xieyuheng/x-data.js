import { formatSexp } from "../format/index.ts"
import * as pp from "../helper/ppml/index.ts"
import { isTael, type Sexp } from "../sexp/index.ts"

type Config = {}

const defaultConfig = {}

export function prettySexp(
  maxWidth: number,
  sexp: Sexp,
  config: Config = defaultConfig,
): string {
  return pp.format(maxWidth, renderSexp(config, sexp))
}

export function renderSexp(config: Config, sexp: Sexp): pp.Node {
  if (isTael(sexp)) {
    const elements = renderSexps(config, sexp.elements)
    const attributes = renderAttributes(config, Object.entries(sexp.attributes))
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

function renderSexps(config: Config, sexps: Array<Sexp>): pp.Node {
  return pp.mapWithBreak((sexp) => renderSexp(config, sexp), sexps)
}

function renderAttribute(config: Config, [key, sexp]: [string, Sexp]): pp.Node {
  return pp.group(pp.text(`:${key}`), pp.br(), renderSexp(config, sexp))
}

function renderAttributes(
  config: Config,
  entries: Array<[string, Sexp]>,
): pp.Node {
  return pp.mapWithBreak((entry) => renderAttribute(config, entry), entries)
}
