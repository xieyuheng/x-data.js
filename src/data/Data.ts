export type Data = Atom | Tael

export type Atom = String | Int | Float

export type Attributes = Record<string, Data>

export type String = {
  kind: "String"
  content: string
  meta: Attributes
}

export function String(content: string, meta: Attributes = {}): String {
  return {
    kind: "String",
    content,
    meta,
  }
}

export type Int = {
  kind: "Int"
  content: number
  meta: Attributes
}

export function Int(content: number, meta: Attributes = {}): Int {
  if (!Number.isInteger(content)) {
    throw new Error(`[intAtom] expect number be int: ${content}.`)
  }

  return {
    kind: "Int",
    content,
    meta,
  }
}

export type Float = {
  kind: "Float"
  content: number
  meta: Attributes
}

export function Float(content: number, meta: Attributes = {}): Float {
  return {
    kind: "Float",
    content,
    meta,
  }
}

export type Tael = {
  kind: "Tael"
  elements: Array<Data>
  attributes: Attributes
  meta: Attributes
}

export function Tael(
  elements: Array<Data>,
  attributes: Attributes,
  meta: Attributes = {},
): Tael {
  return {
    kind: "Tael",
    elements,
    attributes,
    meta,
  }
}
