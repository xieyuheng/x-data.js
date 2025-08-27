import assert from "node:assert"
import * as X from "../data/index.ts"
import { recordMap } from "../utils/record/recordMap.ts"
import { type TokenMeta } from "./Token.ts"

export function tokenMetaToDataMeta(meta: TokenMeta): X.Attributes {
  return X.asTael(X.dataFromJson(meta)).attributes
}

export function tokenMetaFromDataMeta(meta: X.Attributes): TokenMeta {
  const json: any = recordMap(meta, X.dataToJson)

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
        who: "tokenMetaFromData",
        json,
        meta,
        error,
      },
      { depth: null },
    )

    throw error
  }
}
