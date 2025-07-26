import { type Span } from "./Span.ts"

// TODO The code is copied from `@cicada-lang/partech`,
//   in need of refactoring.

export function spanReport(span: Span, context: string): string {
  let s = repr_in_context(span, context)
  s = decorate_line_number(s)
  s = line_span_focus(to_line_span_in_context(span, context), s, 3)
  return s
}

function repr_in_context(span: Span, context: string): string {
  let s = ""
  for (let i = 0; i < context.length; i++) {
    if (span.start.index <= i && i < span.end.index) {
      s += context.charAt(i)
    } else {
      s += context.charAt(i)
    }
  }
  // NOTE END_OF_FILE
  if (
    span.start.index === context.length &&
    span.end.index === context.length
  ) {
    s += " "
  }
  return s
}

function decorate_line_number(text: string): string {
  let lines = text.split("\n")
  let max = lines.length + 1
  let width = max.toString().length
  let decorated = ""
  for (const [i, line] of lines.entries()) {
    let line_number = i + 1 // NOTE index from 1 instead of 0
    let line_number_string = line_number.toString()
    line_number_string =
      " ".repeat(width - line_number_string.length) + line_number_string
    decorated += " "
    decorated += line_number_string
    decorated += " |"
    decorated += line
    decorated += "\n"
  }
  return decorated
}

function to_line_span_in_context(
  span: Span,
  context: string,
): { lo: number; hi: number } {
  let line_indexes = new Set<number>()
  let cursor = 0
  let lines = context.split("\n")
  for (let [i, line] of lines.entries()) {
    if (
      intervalOverlap(
        span.start.index,
        span.end.index,
        cursor,
        cursor + line.length + 1,
      )
    ) {
      line_indexes.add(i)
    }
    cursor += line.length + 1
  }
  const lo = Math.min(...line_indexes)
  const hi = Math.max(...line_indexes)
  return { lo, hi }
}

function line_span_focus(
  span: { lo: number; hi: number },
  context: string,
  margin: number,
): string {
  let lines = context.split("\n")
  return lines.slice(Math.max(0, span.lo - margin), span.hi + margin).join("\n")
}

// NOTE [x0, x1] not overlap with [y0, y1]
export function intervalNotOverlap(
  x0: number,
  x1: number,
  y0: number,
  y1: number,
): boolean {
  return y0 > x1 || y1 < x0
}

// NOTE [x0, x1] overlap with [y0, y1]
export function intervalOverlap(
  x0: number,
  x1: number,
  y0: number,
  y1: number,
): boolean {
  return !intervalNotOverlap(x0, x1, y0, y1)
}
