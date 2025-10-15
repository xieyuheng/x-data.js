import { type Json } from "../../helpers/json/Json.ts"
import { recordMapValue } from "../../helpers/record/recordMapValue.ts"
import * as X from "../sexp/index.ts"

// Only translate those sexp that can be translated to JSON,
// i.e. only pure list and pure record,
// not non-empty list or atom mixed with attributes.

export function sexpToJson(sexp: X.Sexp): Json {
  if (X.isAtom(sexp)) {
    return sexp.content
  }

  if (sexp.kind === "Tael") {
    if (sexp.elements.length === 0) {
      return recordMapValue(sexp.attributes, sexpToJson)
    } else {
      return sexp.elements.map(sexpToJson)
    }
  }
}

export function symbolContent(sexp: X.Sexp): string {
  if (sexp.kind !== "Symbol") {
    throw new Error(`[symbolContent] wrong sexp kind: ${sexp.kind}`)
  }

  return sexp.content
}

export function hashtagContent(sexp: X.Sexp): string {
  if (sexp.kind !== "Hashtag") {
    throw new Error(`[hashtagContent] wrong sexp kind: ${sexp.kind}`)
  }

  return sexp.content
}

export function stringContent(sexp: X.Sexp): string {
  if (sexp.kind !== "String") {
    throw new Error(`[stringContent] wrong sexp kind: ${sexp.kind}`)
  }

  return sexp.content
}

export function numberContent(sexp: X.Sexp): number {
  if (sexp.kind !== "Int" && sexp.kind !== "Float") {
    throw new Error(`[numberContent] wrong sexp kind: ${sexp.kind}`)
  }

  return sexp.content
}

export function listElements(sexp: X.Sexp): Array<X.Sexp> {
  if (sexp.kind !== "Tael") {
    throw new Error(`[listElements] wrong sexp kind: ${sexp.kind}`)
  }

  return sexp.elements
}
