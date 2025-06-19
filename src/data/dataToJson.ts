import { type Json } from "../utils/Json.ts"
import { recordMap } from "../utils/recordMap.ts"
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
