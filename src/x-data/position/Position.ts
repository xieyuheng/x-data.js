export class Position {
  index: number
  row: number
  column: number

  constructor(options: { index: number; row: number; column: number }) {
    this.index = options.index
    this.row = options.row
    this.column = options.column
  }

  step(char: string): void {
    if (char.length !== 1) {
      throw new Error(`I expect the char to be length of one: ${char}`)
    }

    this.index++

    if (char === "\n") {
      this.column = 0
      this.row++
    } else {
      this.column++
    }
  }
}

export function initPosition(): Position {
  return new Position({ index: 0, column: 0, row: 0 })
}
