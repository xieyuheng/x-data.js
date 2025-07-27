import * as X from "../data/index.ts"
import { dataToJson } from "../data/index.ts"
import { type Span } from "./index.ts"

export function spanFromData(data: X.Data): Span {
  const json: any = dataToJson(X.Record(X.asTael(data).attributes))
  try {
    return { start: json.start, end: json.end }
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
