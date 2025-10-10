import * as pp from "../../helper/ppml/index.ts"
import { recordIsEmpty } from "../../helper/record/recordIsEmpty.ts"
import { formatSexp } from "../format/index.ts"
import { isAtom, type Sexp } from "../sexp/index.ts"

type KeywordConfig = [name: string, headerLength: number]
type Config = {
  keywords: Array<KeywordConfig>
}

const defaultConfig: Config = {
  keywords: [
    ["export", 0],
    ["import-all", 0],
    ["include-all", 0],
    ["include", 0],
    ["=", 2],
    ["import", 0],
    ["define", 1],
    ["begin", 0],
    ["lambda", 1],
    ["match", 1],
    ["pipe", 1],
    ["compose", 0],
    ["->", 0],
    ["*->", 0],
    ["if", 1],
    ["when", 1],
    ["unless", 1],
    ["cond", 0],
    ["@list", 0],
    ["@tael", 0],
    ["@set", 0],
    ["@hash", 0],
  ],
}

export function prettySexp(
  maxWidth: number,
  sexp: Sexp,
  config: Config = defaultConfig,
): string {
  return pp.format(maxWidth, renderSexp(config)(sexp))
}

export function renderSexp(config: Config): (sexp: Sexp) => pp.Node {
  return (sexp) => {
    if (isAtom(sexp)) {
      return pp.text(formatSexp(sexp))
    }

    if (sexp.elements.length === 0) {
      if (recordIsEmpty(sexp.attributes)) {
        return pp.text("()")
      } else {
        return pp.group(
          pp.text("("),
          pp.indent(1, renderAttributes(config)(sexp.attributes)),
          pp.text(")"),
        )
      }
    }

    const [keyword, ...restSexps] = sexp.elements
    if (keyword.kind === "Symbol") {
      const keywordConfig = config.keywords.find(
        ([name]) => name === keyword.content,
      )
      if (keywordConfig !== undefined) {
        const [name, headerLength] = keywordConfig
        const headerSexps = restSexps.slice(0, headerLength)
        const bodySexps = restSexps.slice(headerLength)
        return pp.group(
          pp.text("("),
          pp.text(name),
          ...(headerSexps.length === 0
            ? []
            : [pp.indent(4, pp.br(), renderSexps(config)(headerSexps))]),
          ...(recordIsEmpty(sexp.attributes)
            ? []
            : [
                pp.indent(2, pp.br()),
                pp.group(
                  pp.indent(2, renderAttributes(config)(sexp.attributes)),
                ),
              ]),
          ...(bodySexps.length === 0
            ? []
            : [
                pp.indent(2, pp.br()),
                pp.indent(2, renderSexps(config)(bodySexps)),
              ]),
          pp.text(")"),
        )
      }
    }

    return pp.group(
      pp.text("("),
      pp.group(pp.indent(1, renderSexps(config)(sexp.elements))),
      ...(recordIsEmpty(sexp.attributes)
        ? []
        : [
            pp.indent(1, pp.br()),
            pp.group(pp.indent(1, renderAttributes(config)(sexp.attributes))),
          ]),
      pp.text(")"),
    )
  }
}

function renderSexps(config: Config): (sexps: Array<Sexp>) => pp.Node {
  return (sexps) => {
    return pp.flexWrap(sexps.map(renderSexp(config)))
  }
}

function renderAttribute(
  config: Config,
): ([key, sexp]: [string, Sexp]) => pp.Node {
  return ([key, sexp]) => {
    return pp.group(pp.text(`:${key}`), pp.br(), renderSexp(config)(sexp))
  }
}

function renderAttributes(
  config: Config,
): (attributes: Record<string, Sexp>) => pp.Node {
  return (attributes) => {
    return pp.flex(Object.entries(attributes).map(renderAttribute(config)))
  }
}
