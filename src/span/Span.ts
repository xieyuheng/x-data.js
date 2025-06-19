import { Position } from "../position/index.ts"

export class Span {
  start: Position
  end: Position

  constructor(start: Position, end: Position) {
    this.start = start
    this.end = end
  }
}
