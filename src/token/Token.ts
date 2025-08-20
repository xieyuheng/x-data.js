import { type Span } from "../span/index.ts"

export type TokenKind =
  | "Symbol"
  | "String"
  | "Number"
  | "BracketStart"
  | "BracketEnd"
  | "Quote"

export type TokenMeta = {
  span: Span
  text: string
  url?: URL
}

export type Token = {
  kind: TokenKind
  value: string
} & TokenMeta
