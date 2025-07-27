import assert from "node:assert"
import * as X from "../data/index.ts"
import { dataToJson } from "../data/index.ts"
import { Position } from "../span/index.ts"
import { Span } from "./index.ts"

export function spanFromData(data: X.Data): Span {
  assert(data.kind === "Tael")
  const json: any = dataToJson(X.Record(data.attributes))
  try {
    return new Span(new Position(json.start), new Position(json.end))
  } catch (error) {
    console.dir(
      {
        who: "spanFromData",
        message: "fail to create span",
        json,
        data,
        error,
      },
      { depth: null },
    )
    throw error
  }
}
