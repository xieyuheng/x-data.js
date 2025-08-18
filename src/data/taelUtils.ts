import * as X from "./Data.ts"

export function asTael(data: X.Data): X.Tael {
  if (data.kind === "Tael") return data
  throw new Error(`[asTael] fail on: ${data.kind}`)
}

export function List(elements: Array<X.Data>, meta?: X.Attributes): X.Tael {
  return {
    kind: "Tael",
    elements,
    attributes: {},
    meta: meta || {},
  }
}

export function Cons(head: X.Data, tail: X.Data): X.Tael {
  if (tail.kind !== "Tael") {
    throw new Error(`[Cons] tail to be a list, tail kind: ${tail.kind}.`)
  }

  return {
    kind: "Tael",
    elements: [head, ...tail.elements],
    attributes: tail.attributes,
    meta: tail.meta,
  }
}

export function Record(attributes: X.Attributes, meta?: X.Attributes): X.Tael {
  return {
    kind: "Tael",
    elements: [],
    attributes,
    meta: meta || {},
  }
}
