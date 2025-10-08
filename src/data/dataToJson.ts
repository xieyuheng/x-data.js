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

export function symbolContent(data: X.Data): string {
  if (data.kind !== "Symbol") {
    throw new Error(`[symbolContent] wrong data kind: ${data.kind}`)
  }

  return data.content
}

export function hashtagContent(data: X.Data): string {
  if (data.kind !== "Hashtag") {
    throw new Error(`[hashtagContent] wrong data kind: ${data.kind}`)
  }

  return data.content
}

export function stringContent(data: X.Data): string {
  if (data.kind !== "String") {
    throw new Error(`[stringContent] wrong data kind: ${data.kind}`)
  }

  return data.content
}

export function numberContent(data: X.Data): number {
  if (data.kind !== "Int" && data.kind !== "Float") {
    throw new Error(`[numberContent] wrong data kind: ${data.kind}`)
  }

  return data.content
}

export function listElements(data: X.Data): Array<X.Data> {
  if (data.kind !== "Tael") {
    throw new Error(`[listElements] wrong data kind: ${data.kind}`)
  }

  return data.elements
}
