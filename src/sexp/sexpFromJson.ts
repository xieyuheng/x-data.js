import { isJsonArray, isJsonObject } from "../helper/json/Json.ts"
import * as X from "../sexp/index.ts"

// Can not handle null and undefined,
// when found in a record, they will be ignored.

export function sexpFromJson(json: any): X.Sexp {
  if (typeof json === "string") {
    return X.String(json)
  }

  if (json instanceof URL) {
    return X.String(json.href)
  }

  if (typeof json === "number") {
    if (Number.isInteger(json)) {
      return X.Int(json)
    } else {
      return X.Float(json)
    }
  }

  if (typeof json === "boolean") {
    if (json === true) {
      return X.Hashtag("#t")
    } else {
      return X.Hashtag("#f")
    }
  }

  if (isJsonArray(json)) {
    return X.Tael(json.map(sexpFromJson), {})
  }

  if (isJsonObject(json)) {
    return X.Record(
      Object.fromEntries(
        Object.entries(json)
          .filter(([key, value]) => value !== null && value !== undefined)
          .map(([key, value]) => [key, sexpFromJson(value)]),
      ),
    )
  }

  throw new Error(`[sexpFromJson] can not handle json: ${JSON.stringify(json)}`)
}
