export type Data = Atom | Tael

export type Atom = Bool | String | Int | Float
export type Bool = { kind: "Bool"; content: boolean; meta: Attributes }
export type String = { kind: "String"; content: string; meta: Attributes }
export type Int = { kind: "Int"; content: number; meta: Attributes }
export type Float = { kind: "Float"; content: number; meta: Attributes }

export type Tael = {
  kind: "Tael"
  content: Array<Data>
  attributes: Attributes
  meta: Attributes
}

export type Attributes = Record<string, Data>

export function isAtom(data: Data): data is Atom {
  return (
    data.kind === "Bool" ||
    data.kind === "String" ||
    data.kind === "Int" ||
    data.kind === "Float"
  )
}

export function Bool(content: boolean, meta?: Attributes): Bool {
  return {
    kind: "Bool",
    content,
    meta: meta || {},
  }
}

export function String(content: string, meta?: Attributes): String {
  return {
    kind: "String",
    content,
    meta: meta || {},
  }
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

export function Float(content: number, meta?: Attributes): Float {
  return {
    kind: "Float",
    content,
    meta: meta || {},
  }
}

export function Tael(
  content: Array<Data>,
  attributes: Attributes,
  meta?: Attributes,
): Tael {
  return {
    kind: "Tael",
    content,
    attributes,
    meta: meta || {},
  }
}

export function List(content: Array<Data>, meta?: Attributes): Tael {
  return {
    kind: "Tael",
    content,
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
    content: [head, ...tail.content],
    attributes: tail.attributes,
    meta: tail.meta,
  }
}

export function Record(attributes: Attributes, meta?: Attributes): Tael {
  return {
    kind: "Tael",
    content: [],
    attributes,
    meta: meta || {},
  }
}
