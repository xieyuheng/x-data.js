import type { Attributes } from "../data/index.ts"
import * as X from "../data/index.ts"
import { Position } from "./Position.ts"

export function positionToAttributes(position: Position): Attributes {
  return {
    index: X.Int(position.index),
    row: X.Int(position.row),
    column: X.Int(position.column),
  }
}
