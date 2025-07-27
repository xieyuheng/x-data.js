import { leftPad } from "../utils/format/leftPad.ts"
import { stringIsBlank } from "../utils/string/stringIsBlank.ts"
import { type Span } from "./Span.ts"

type Line = {
  index: number
  text: string
  underline?: string
}

export function spanReport(span: Span, context: string): string {
  const lines = context.split("\n").map((text, index) => ({ index, text }))
  linesMarkUnderline(lines, span)
  const leftMargin = linesLeftMargin(lines)
  return lines
    .filter((line) => lineIsCloseToSpan(line, span))
    .map((line) => formatLine(line, leftMargin))
    .join("")
}

function lineIsCloseToSpan(line: Line, span: Span): boolean {
  return line.index > span.start.column - 3 && line.index < span.end.column + 3
}

function linesLeftMargin(lines: Array<Line>): number {
  return lines.length.toString().length + 1
}

function linesMarkUnderline(lines: Array<Line>, span: Span): void {
  let cursor = 0
  for (const line of lines) {
    const start = cursor
    const end = cursor + line.text.length + 1
    line.underline = lineUnderline(line, start, end, span)
    cursor = end
  }
}

function lineUnderline(
  line: Line,
  start: number,
  end: number,
  span: Span,
): string | undefined {
  let underline = ""
  for (let i = start; i < end; i++) {
    if (span.start.index <= i && i < span.end.index) {
      underline += "~"
    } else {
      underline += " "
    }
  }

  if (stringIsBlank(underline)) {
    return undefined
  } else {
    return underline
  }
}

function formatLine(line: Line, leftMargin: number): string {
  const prefix = leftPad(line.index.toString(), leftMargin, " ")
  if (line.underline) {
    const emptyPrefix = leftPad("", leftMargin, " ")
    return `${prefix}|${line.text}\n${emptyPrefix} ${line.underline}\n`
  } else {
    return `${prefix}|${line.text}\n`
  }
}
