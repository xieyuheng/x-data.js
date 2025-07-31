import { isJsonArray, isJsonObject } from "../utils/json/Json.ts"
import * as X from "./Data.ts"

// Can not handle null and undefined,
// when found in a record, they will be ignored.

export function dataFromJson(json: any): X.Data {
  if (typeof json === "string") {
    return X.String(json)
  }

  if (typeof json === "number") {
    if (Number.isInteger(json)) {
      return X.Int(json)
    } else {
      return X.Float(json)
    }
  }

  if (typeof json === "boolean") {
    return X.Bool(json)
  }

  if (isJsonArray(json)) {
    return X.Tael(json.map(dataFromJson), {})
  }

  if (isJsonObject(json)) {
    return X.Record(
      Object.fromEntries(
        Object.entries(json)
          .filter(([key, value]) => value !== null && value !== undefined)
          .map(([key, value]) => [key, dataFromJson(value)]),
      ),
    )
  }

  throw new Error(`[dataFromJson] can not handle json: ${JSON.stringify(json)}`)
}
