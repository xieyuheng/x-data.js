import { type Span } from "../span/index.ts"

export type TokenKind =
  | "Symbol"
  | "String"
  | "Number"
  | "BracketStart"
  | "BracketEnd"
  | "Quote"

export class Token {
  kind: TokenKind
  value: string
  span: Span

  constructor(kind: TokenKind, value: string, span: Span) {
    this.kind = kind
    this.value = value
    this.span = span
  }
}
