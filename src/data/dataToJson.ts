import * as X from "../data/index.ts"
import { type Json } from "../utils/json/Json.ts"
import { recordMapValue } from "../utils/record/recordMapValue.ts"

// Only translate those data that can be translated to JSON,
// i.e. only pure list and pure record,
// not non-empty list or atom mixed with attributes.

export function dataToJson(data: X.Data): Json {
  if (X.isAtom(data)) {
    return data.content
  }

  if (data.kind === "Tael") {
    if (data.elements.length === 0) {
      return recordMapValue(data.attributes, dataToJson)
    } else {
      return data.elements.map(dataToJson)
    }
  }
}

export function symbolToString(data: X.Data): string {
  if (data.kind !== "Symbol") {
    throw new Error(`[symbolToString] wrong data kind: ${data.kind}`)
  }

  return data.content
}

export function hashtagToString(data: X.Data): string {
  if (data.kind !== "Hashtag") {
    throw new Error(`[hashtagToString] wrong data kind: ${data.kind}`)
  }

  return data.content
}

export function dataToString(data: X.Data): string {
  if (data.kind !== "String") {
    throw new Error(`[dataToString] wrong data kind: ${data.kind}`)
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
  if (data.kind !== "Tael") {
    throw new Error(`[dataToArray] wrong data kind: ${data.kind}`)
  }

  return data.elements
}
