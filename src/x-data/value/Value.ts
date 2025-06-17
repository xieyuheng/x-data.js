export type Value = Atom | Data
export type Atom = { kind: "Atom"; literal: Literal; attributes: Attributes }
export type Data = { kind: "Data"; list: List; attributes: Attributes }

export type Attributes = Record<string, Value>

export type Literal = Bool | Symbol | String | Int | Float
export type Bool = { kind: "Boolean"; content: boolean }
export type Symbol = { kind: "Symbol"; content: string }
export type String = { kind: "String"; content: string }
export type Int = { kind: "Int"; content: number }
export type Float = { kind: "Float"; content: number }

export type List = Cons | Null
export type Cons = { kind: "Cons"; head: Value; tail: Value }
export type Null = { kind: "Null" }

export function boolAtom(content: boolean, attributes?: Attributes): Atom {
  return {
    kind: "Atom",
    literal: { kind: "Boolean", content },
    attributes: attributes || {},
  }
}

export function symbolAtom(content: string, attributes?: Attributes): Atom {
  if (content.includes(" ")) {
    throw new Error(`[symbolAtom] expect string to have no space: ${content}.`)
  }

  return {
    kind: "Atom",
    literal: { kind: "Symbol", content },
    attributes: attributes || {},
  }
}

export function stringAtom(content: string, attributes?: Attributes): Atom {
  return {
    kind: "Atom",
    literal: { kind: "String", content },
    attributes: attributes || {},
  }
}

export function intAtom(content: number, attributes?: Attributes): Atom {
  if (!Number.isInteger(content)) {
    throw new Error(`[intAtom] expect number be int: ${content}.`)
  }

  return {
    kind: "Atom",
    literal: { kind: "Int", content },
    attributes: attributes || {},
  }
}

export function floatAtom(content: number, attributes?: Attributes): Atom {
  return {
    kind: "Atom",
    literal: { kind: "Float", content },
    attributes: attributes || {},
  }
}

// listData
// consData
// nullData
