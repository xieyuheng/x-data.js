import { Position } from "../position/index.ts"

export class Span {
  start: Position
  end: Position

  constructor(start: Position, end: Position) {
    this.start = start
    this.end = end
  }

  get lo(): number {
    return this.start.index
  }

  get hi(): number {
    return this.end.index
  }
}
