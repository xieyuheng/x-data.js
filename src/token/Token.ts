import { type Span } from "../span/index.ts"

export type TokenKind =
  | "Symbol"
  | "DoubleQoutedString"
  | "Number"
  | "BracketStart"
  | "BracketEnd"
  | "QuotationMark"
  | "Keyword"

export type TokenMeta = {
  span: Span
  text: string
  url?: URL
}

export type Token = {
  kind: TokenKind
  value: string
  meta: TokenMeta
}
