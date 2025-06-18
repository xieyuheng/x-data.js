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

export function spanUnion(x: Span, y: Span): Span {
  const start = x.start.index < y.start.index ? x.start : y.start
  const end = x.end.index > y.end.index ? x.end : y.end
  return new Span(start, end)
}
