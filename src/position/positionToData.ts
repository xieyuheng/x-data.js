import * as X from "../data/index.ts"
import { Position } from "./Position.ts"

export function positionToData(position: Position): X.Data {
  return X.Record({
    index: X.Int(position.index),
    row: X.Int(position.row),
    column: X.Int(position.column),
  })
}
