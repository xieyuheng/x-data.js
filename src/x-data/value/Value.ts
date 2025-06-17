export type Value = Atom | List
export type Atom = Bool | Symbol | String | Int | Float
export type Bool = { type: "Bool"; content: boolean; attributes: Attributes }
export type Symbol = { type: "Symbol"; content: string; attributes: Attributes }
export type String = { type: "String"; content: string; attributes: Attributes }
export type Int = { type: "Int"; content: number; attributes: Attributes }
export type Float = { type: "Float"; content: number; attributes: Attributes }
export type List = {
  type: "List"
  content: Array<Value>
  attributes: Attributes
}
export type Attributes = Record<string, Value>

export function Bool(content: boolean, attributes?: Attributes): Bool {
  return {
    type: "Bool",
    content,
    attributes: attributes || {},
  }
}

export function Symbol(content: string, attributes?: Attributes): Symbol {
  if (content.includes(" ")) {
    throw new Error(`[symbolAtom] expect string to have no space: ${content}.`)
  }

  return {
    type: "Symbol",
    content,
    attributes: attributes || {},
  }
}

export function String(content: string, attributes?: Attributes): String {
  return {
    type: "String",
    content,
    attributes: attributes || {},
  }
}

export function Int(content: number, attributes?: Attributes): Int {
  if (!Number.isInteger(content)) {
    throw new Error(`[intAtom] expect number be int: ${content}.`)
  }

  return {
    type: "Int",
    content,
    attributes: attributes || {},
  }
}

export function Float(content: number, attributes?: Attributes): Float {
  return {
    type: "Float",
    content,
    attributes: attributes || {},
  }
}

export function List(content: Array<Value>, attributes?: Attributes): List {
  return {
    type: "List",
    content,
    attributes: attributes || {},
  }
}
