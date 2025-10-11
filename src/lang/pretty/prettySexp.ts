import * as pp from "../../helper/ppml/index.ts"
import { recordIsEmpty } from "../../helper/record/recordIsEmpty.ts"
import { formatSexp } from "../format/index.ts"
import { isAtom, type Sexp } from "../sexp/index.ts"
import { defaultConfig } from "./defaultConfig.ts"

export type Config = {
  keywords: Array<KeywordConfig>
}

type KeywordConfig = [name: string, headerLength: number]

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

    const [first, ...rest] = sexp.elements
    if (first.kind === "Symbol") {
      switch (
        first.content
        // case "@set": {
        //   renderSet(config)(rest)
        // }
      ) {
      }
    }

    const keywordConfig = findKeywordConfig(config, first)
    if (keywordConfig !== undefined) {
      const [name, headerLength] = keywordConfig
      return renderSyntax(config)(
        name,
        rest.slice(0, headerLength),
        rest.slice(headerLength),
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
  header: Array<Sexp>,
  body: Array<Sexp>,
  attributes: Record<string, Sexp>,
) => pp.Node {
  return (name, header, body, attributes) => {
    const headNode = pp.indent(
      4,
      pp.flexWrap([pp.text(name), ...header.map(renderSexp(config))]),
    )

    const neckNode = recordIsEmpty(attributes)
      ? pp.nil()
      : pp.group(pp.indent(2, pp.br(), renderAttributes(config)(attributes)))

    const bodyNode =
      body.length === 0
        ? pp.nil()
        : pp.indent(2, pp.br(), pp.flexWrap(body.map(renderSexp(config))))

    return pp.group(pp.text("("), headNode, neckNode, bodyNode, pp.text(")"))
  }
}

function renderApplication(
  config: Config,
): (elements: Array<Sexp>, attributes: Record<string, Sexp>) => pp.Node {
  return (elements, attributes) => {
    const footNode = recordIsEmpty(attributes)
      ? pp.nil()
      : pp.group(pp.indent(1, pp.br(), renderAttributes(config)(attributes)))

    return pp.group(
      pp.text("("),
      pp.group(pp.indent(1, pp.flexWrap(elements.map(renderSexp(config))))),
      footNode,
      pp.text(")"),
    )
  }
}

function renderElementLess(
  config: Config,
): (attributes: Record<string, Sexp>) => pp.Node {
  return (attributes) => {
    return recordIsEmpty(attributes)
      ? pp.text("()")
      : pp.group(
          pp.text("("),
          pp.indent(1, renderAttributes(config)(attributes)),
          pp.text(")"),
        )
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
