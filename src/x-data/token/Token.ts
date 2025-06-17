import { Span } from "../span/index.ts"

export type TokenKind =
  | "Symbol"
  | "String"
  | "Number"
  | "ParenthesisStart"
  | "ParenthesisEnd"
  | "Quote"

export class Token {
   kind: TokenKind
   value: string
   span: Span

  constructor(
   kind: TokenKind,
   value: string,
   span: Span,
  ) {
    this.kind = kind
    this.value = value
    this.span = span
  }
}
