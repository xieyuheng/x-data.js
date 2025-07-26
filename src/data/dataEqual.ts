import { arrayZip } from "../utils/array/arrayZip.ts"
import type { Attributes, Data } from "./Data.ts"

export function dataEqual(x: Data, y: Data): boolean {
  if (!attributesEqual(x.attributes, y.attributes)) return false

  if (
    (x.kind === "Bool" && y.kind === "Bool") ||
    (x.kind === "String" && y.kind === "String") ||
    (x.kind === "Int" && y.kind === "Int") ||
    (x.kind === "Float" && y.kind === "Float")
  ) {
    return x.content === y.content
  }

  if (x.kind === "List" && y.kind === "List") {
    return dataArrayEqual(x.content, y.content)
  }

  return false
}

export function dataArrayEqual(xs: Array<Data>, ys: Array<Data>): boolean {
  if (xs.length !== ys.length) return false
  for (const [x, y] of arrayZip(xs, ys)) {
    if (!dataEqual(x, y)) return false
  }

  return true
}

function attributesEqual(x: Attributes, y: Attributes): boolean {
  if (Object.keys(x).length !== Object.keys(y).length) return false

  for (const key of Object.keys(x)) {
    if (x[key] === undefined) return false
    if (y[key] === undefined) return false
    if (!dataEqual(x[key], y[key])) return false
  }

  return true
}
