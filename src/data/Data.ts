export type Data = Atom | Tael

export type Atom = Bool | Symbol | String | Int | Float
export type Bool = { kind: "Bool"; content: boolean; meta: Attributes }
export type Symbol = { kind: "Symbol"; content: string; meta: Attributes }
export type String = { kind: "String"; content: string; meta: Attributes }
export type Int = { kind: "Int"; content: number; meta: Attributes }
export type Float = { kind: "Float"; content: number; meta: Attributes }

export type Tael = {
  kind: "Tael"
  elements: Array<Data>
  attributes: Attributes
  meta: Attributes
}

export type Attributes = Record<string, Data>

export function isAtom(data: Data): data is Atom {
  return (
    data.kind === "Bool" ||
    data.kind === "Symbol" ||
    data.kind === "String" ||
    data.kind === "Int" ||
    data.kind === "Float"
  )
}

export function asBool(data: Data): Bool {
  if (data.kind === "Bool") return data
  throw new Error(`[asBool] fail on: ${data.kind}`)
}

export function Bool(content: boolean, meta?: Attributes): Bool {
  return {
    kind: "Bool",
    content,
    meta: meta || {},
  }
}

export function asSymbol(data: Data): Symbol {
  if (data.kind === "Symbol") return data
  throw new Error(`[asSymbol] fail on: ${data.kind}`)
}

export function Symbol(content: string, meta?: Attributes): Symbol {
  return {
    kind: "Symbol",
    content,
    meta: meta || {},
  }
}

export function asString(data: Data): String {
  if (data.kind === "String") return data
  throw new Error(`[asString] fail on: ${data.kind}`)
}

export function String(content: string, meta?: Attributes): String {
  return {
    kind: "String",
    content,
    meta: meta || {},
  }
}

export function asInt(data: Data): Int {
  if (data.kind === "Int") return data
  throw new Error(`[asInt] fail on: ${data.kind}`)
}

export function Int(content: number, meta?: Attributes): Int {
  if (!Number.isInteger(content)) {
    throw new Error(`[intAtom] expect number be int: ${content}.`)
  }

  return {
    kind: "Int",
    content,
    meta: meta || {},
  }
}

export function asFloat(data: Data): Float {
  if (data.kind === "Float") return data
  throw new Error(`[asFloat] fail on: ${data.kind}`)
}

export function Float(content: number, meta?: Attributes): Float {
  return {
    kind: "Float",
    content,
    meta: meta || {},
  }
}

export function asTael(data: Data): Tael {
  if (data.kind === "Tael") return data
  throw new Error(`[asTael] fail on: ${data.kind}`)
}

export function Tael(
  elements: Array<Data>,
  attributes: Attributes,
  meta?: Attributes,
): Tael {
  return {
    kind: "Tael",
    elements,
    attributes,
    meta: meta || {},
  }
}

export function List(elements: Array<Data>, meta?: Attributes): Tael {
  return {
    kind: "Tael",
    elements,
    attributes: {},
    meta: meta || {},
  }
}

export function Cons(head: Data, tail: Data): Tael {
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

export function Record(attributes: Attributes, meta?: Attributes): Tael {
  return {
    kind: "Tael",
    elements: [],
    attributes,
    meta: meta || {},
  }
}
