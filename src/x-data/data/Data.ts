export type Data = Atom | List
export type Atom = Bool | Symbol | String | Int | Float
export type Bool = { kind: "Bool"; content: boolean; attributes: Attributes }
export type Symbol = { kind: "Symbol"; content: string; attributes: Attributes }
export type String = { kind: "String"; content: string; attributes: Attributes }
export type Int = { kind: "Int"; content: number; attributes: Attributes }
export type Float = { kind: "Float"; content: number; attributes: Attributes }
export type List = {
  kind: "List"
  content: Array<Data>
  attributes: Attributes
}
export type Attributes = Record<string, Data>

export function Bool(content: boolean, attributes?: Attributes): Bool {
  return {
    kind: "Bool",
    content,
    attributes: attributes || {},
  }
}

export function Symbol(content: string, attributes?: Attributes): Symbol {
  if (content.includes(" ")) {
    throw new Error(`[symbolAtom] expect string to have no space: ${content}.`)
  }

  return {
    kind: "Symbol",
    content,
    attributes: attributes || {},
  }
}

export function String(content: string, attributes?: Attributes): String {
  return {
    kind: "String",
    content,
    attributes: attributes || {},
  }
}

export function Int(content: number, attributes?: Attributes): Int {
  if (!Number.isInteger(content)) {
    throw new Error(`[intAtom] expect number be int: ${content}.`)
  }

  return {
    kind: "Int",
    content,
    attributes: attributes || {},
  }
}

export function Float(content: number, attributes?: Attributes): Float {
  return {
    kind: "Float",
    content,
    attributes: attributes || {},
  }
}

export function List(content: Array<Data>, attributes?: Attributes): List {
  return {
    kind: "List",
    content,
    attributes: attributes || {},
  }
}

export function Cons(head: Data, tail: Data, attributes?: Attributes): List {
  if (tail.kind !== "List") {
    throw new Error(`[Cons] tail to be a list, tail kind: ${tail.kind}.`)
  }

  return {
    kind: "List",
    content: [head, ...tail.content],
    attributes: attributes || {},
  }
}

export function Record(attributes: Attributes): List {
  return {
    kind: "List",
    content: [],
    attributes,
  }
}
