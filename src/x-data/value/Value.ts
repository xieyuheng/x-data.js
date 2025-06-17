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

// boolAtom
// symbolAtom
// stringAtom
// intAtom
// floatAtom

// listData
// consData
// nullData
