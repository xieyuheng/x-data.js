import * as X from "../data/index.ts"
import { dataToJson } from "../data/index.ts"
import { Position } from "../position/index.ts"
import { Span } from "./index.ts"

export function spanFromData(data: X.Data): Span {
  const json: any = dataToJson(X.Record(data.attributes))
  return new Span(new Position(json.start), new Position(json.end))
}
