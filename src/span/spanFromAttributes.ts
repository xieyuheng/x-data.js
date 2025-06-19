import * as X from "../data/index.ts"
import { dataToJson, type Attributes } from "../data/index.ts"
import { Position } from "../position/index.ts"
import { Span } from "./index.ts"

export function spanFromAttributes(attributes: Attributes): Span {
  const json: any = dataToJson(X.Record(attributes))
  return new Span(new Position(json.start), new Position(json.end))
}
