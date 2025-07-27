import { type Span, spanReport } from "../span/index.ts"

export class ParsingError extends Error {
  span: Span

  constructor(message: string, span: Span) {
    super(message)
    this.span = span
  }

  report(text: string): string {
    return [this.message + "\n", spanReport(this.span, text)].join("\n")
  }
}
