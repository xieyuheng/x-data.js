import * as X from "./Data.ts"

export function isAtom(data: X.Data): data is X.Atom {
  return (
    data.kind === "Symbol" ||
    data.kind === "String" ||
    data.kind === "Int" ||
    data.kind === "Float" ||
    data.kind === "Hashtag"
  )
}

export function isSymbol(data: X.Data): data is X.Symbol {
  return data.kind === "Symbol"
}

export function isString(data: X.Data): data is X.String {
  return data.kind === "String"
}

export function isInt(data: X.Data): data is X.Int {
  return data.kind === "Int"
}

export function isFloat(data: X.Data): data is X.Float {
  return data.kind === "Float"
}

export function isHashtag(data: X.Data): data is X.Hashtag {
  return data.kind === "Hashtag"
}

export function asSymbol(data: X.Data): X.Symbol {
  if (data.kind === "Symbol") return data
  throw new Error(`[asSymbol] fail on: ${data.kind}`)
}

export function asString(data: X.Data): X.String {
  if (data.kind === "String") return data
  throw new Error(`[asString] fail on: ${data.kind}`)
}

export function asInt(data: X.Data): X.Int {
  if (data.kind === "Int") return data
  throw new Error(`[asInt] fail on: ${data.kind}`)
}

export function asFloat(data: X.Data): X.Float {
  if (data.kind === "Float") return data
  throw new Error(`[asFloat] fail on: ${data.kind}`)
}

export function asHashtag(data: X.Data): X.Hashtag {
  if (data.kind === "Hashtag") return data
  throw new Error(`[asHashtag] fail on: ${data.kind}`)
}
