export type LexerOptions = {
  quotes: Array<{ mark: string; symbol: string }>
  brackets: Array<{ start: string; end: string }>
  comments: Array<string>
}

export class LexerConfig {
  quotes: Array<{ mark: string; symbol: string }>
  brackets: Array<{ start: string; end: string }>
  comments: Array<string>
  marks: Array<string>

  constructor(options: LexerOptions) {
    this.quotes = options.quotes
    this.brackets = options.brackets
    this.comments = options.comments
    this.marks = [
      ...options.quotes.map(({ mark }) => mark),
      ...options.brackets.flatMap(({ start, end }) => [start, end]),
    ]
  }

  isMark(value: string): boolean {
    return this.marks.some((x) => x === value)
  }

  matchBrackets(start: string, end: string): boolean {
    const found = this.brackets.find((entry) => entry.start === start)
    if (found === undefined) {
      return false
    }

    return found.end === end
  }

  findQuoteSymbolOrFail(mark: string): string {
    const found = this.quotes.find((entry) => entry.mark === mark)
    if (found === undefined) {
      let message = `Fail to find quote symbol for mark: ${mark}\n`
      throw new Error(message)
    }

    return found.symbol
  }
}
