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
    ["claim", 1],
    ["define", 1],
    ["define-data", 1],
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
    ["polymorphic", 1],
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
      return renderElementLess(config)(sexp.attributes)
    }

    const [firstSexp, ...restSexps] = sexp.elements
    const keywordConfig = findKeywordConfig(config, firstSexp)
    if (keywordConfig !== undefined) {
      const [name, headerLength] = keywordConfig
      return renderSyntax(config)(
        name,
        restSexps.slice(0, headerLength),
        restSexps.slice(headerLength),
        sexp.attributes,
      )
    }

    return renderApplication(config)(sexp.elements, sexp.attributes)
  }
}

function findKeywordConfig(
  config: Config,
  sexp: Sexp,
): KeywordConfig | undefined {
  if (sexp.kind === "Symbol") {
    return config.keywords.find(([name]) => name === sexp.content)
  }
}

function renderSyntax(
  config: Config,
): (
  name: string,
  headerSexps: Array<Sexp>,
  bodySexps: Array<Sexp>,
  attributes: Record<string, Sexp>,
) => pp.Node {
  return (name, header, body, attributes) => {
    const headNode =
      header.length === 0
        ? [pp.text(name)]
        : [
            pp.indent(
              4,
              pp.flexWrap([pp.text(name), ...header.map(renderSexp(config))]),
            ),
          ]

    const neckNode = recordIsEmpty(attributes)
      ? []
      : [
          pp.indent(2, pp.br()),
          pp.group(pp.indent(2, renderAttributes(config)(attributes))),
        ]

    const bodyNode =
      body.length === 0
        ? []
        : [
            pp.indent(2, pp.br()),
            pp.indent(2, pp.flexWrap(body.map(renderSexp(config)))),
          ]

    return pp.group(
      pp.text("("),
      ...headNode,
      ...neckNode,
      ...bodyNode,
      pp.text(")"),
    )
  }
}

function renderApplication(
  config: Config,
): (elements: Array<Sexp>, attributes: Record<string, Sexp>) => pp.Node {
  return (elements, attributes) => {
    const footNode = recordIsEmpty(attributes)
      ? []
      : [
          pp.indent(1, pp.br()),
          pp.group(pp.indent(1, renderAttributes(config)(attributes))),
        ]

    return pp.group(
      pp.text("("),
      pp.group(pp.indent(1, pp.flexWrap(elements.map(renderSexp(config))))),
      ...footNode,
      pp.text(")"),
    )
  }
}

function renderElementLess(
  config: Config,
): (attributes: Record<string, Sexp>) => pp.Node {
  return (attributes) => {
    if (recordIsEmpty(attributes)) {
      return pp.text("()")
    } else {
      return pp.group(
        pp.text("("),
        pp.indent(1, renderAttributes(config)(attributes)),
        pp.text(")"),
      )
    }
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
