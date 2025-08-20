import { type Span } from "../span/index.ts"

export type TokenKind =
  | "Symbol"
  | "String"
  | "Number"
  | "BracketStart"
  | "BracketEnd"
  | "Quote"

export type Token = {
  kind: TokenKind
  value: string
  span: Span
  text: string
  url?: URL
}
