import * as X from "./Data.ts"

export function isAtom(data: X.Data): data is X.Atom {
  return (
    data.kind === "Bool" ||
    data.kind === "String" ||
    data.kind === "Int" ||
    data.kind === "Float"
  )
}

export function isBool(data: X.Data): data is X.Bool {
  return data.kind === "Bool"
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

export function asBool(data: X.Data): X.Bool {
  if (data.kind === "Bool") return data
  throw new Error(`[asBool] fail on: ${data.kind}`)
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
