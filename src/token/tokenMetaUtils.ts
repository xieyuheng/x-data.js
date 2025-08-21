import * as X from "../data/index.ts"
import { recordMap } from "../utils/record/recordMap.ts"
import { type TokenMeta } from "./Token.ts"

export function tokenMetaToDataMeta(meta: TokenMeta): X.Attributes {
  return X.asTael(X.dataFromJson(meta)).attributes
}

export function tokenMetaFromDataMeta(meta: X.Attributes): TokenMeta {
  const json: any = recordMap(meta, X.dataToJson)

  try {
    return {
      span: {
        start: json.span.start,
        end: json.span.end,
      },
      text: json.text,
      url: json.url,
    }
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
