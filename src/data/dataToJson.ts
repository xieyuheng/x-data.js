import { type Json } from "../utils/json/Json.ts"
import { recordMap } from "../utils/record/recordMap.ts"
import * as X from "./Data.ts"

// Only translate those data that can be translated to JSON,
// i.e. only pure list and pure record,
// not non-empty list or atom mixed with attributes.

export function dataToJson(data: X.Data): Json {
  if (X.isAtom(data)) {
    return data.content
  }

  if (data.kind === "List") {
    if (data.content.length === 0) {
      return recordMap(data.attributes, dataToJson)
    } else {
      return data.content.map(dataToJson)
    }
  }
}

export function dataToString(data: X.Data): string {
  if (data.kind !== "String") {
    throw new Error(`[dataToString] wrong data kind: ${data.kind}`)
  }

  return data.content
}

export function dataToBoolean(data: X.Data): boolean {
  if (data.kind !== "Bool") {
    throw new Error(`[dataToBoolean] wrong data kind: ${data.kind}`)
  }

  return data.content
}

export function dataToNumber(data: X.Data): number {
  if (data.kind !== "Int" && data.kind !== "Float") {
    throw new Error(`[dataToNumber] wrong data kind: ${data.kind}`)
  }

  return data.content
}

export function dataToArray(data: X.Data): Array<X.Data> {
  if (data.kind !== "List") {
    throw new Error(`[dataToArray] wrong data kind: ${data.kind}`)
  }

  return data.content
}
