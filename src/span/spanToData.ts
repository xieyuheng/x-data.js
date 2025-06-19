import * as X from "../data/index.ts"
import { positionToData } from "../position/index.ts"
import { Span } from "./Span.ts"

export function spanToData(span: Span): X.Data {
  return X.Record({
    start: positionToData(span.start),
    end: positionToData(span.end),
  })
}
