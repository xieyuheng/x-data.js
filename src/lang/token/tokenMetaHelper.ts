import assert from "node:assert"
import { recordMapValue } from "../../helper/record/recordMapValue.ts"
import * as X from "../sexp/index.ts"
import { type TokenMeta } from "./Token.ts"

export function tokenMetaToSexpMeta(meta: TokenMeta): X.Attributes {
  return X.asTael(X.sexpFromJson(meta)).attributes
}

export function tokenMetaFromSexpMeta(meta: X.Attributes): TokenMeta {
  const json: any = recordMapValue(meta, X.sexpToJson)

  try {
    assert(json)
    assert(json.span)
    assert(json.span.start)
    assert(json.span.end)
    assert(json.text)
    if (json.url) {
      json.url = new URL(json.url)
    }

    return json
  } catch (error) {
    console.dir(
      {
        who: "tokenMetaFromSexp",
        json,
        meta,
        error,
      },
      { depth: null },
    )

    throw error
  }
}
