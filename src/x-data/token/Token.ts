import { Span } from "../span/index.ts"

export type TokenKind =
  | "Symbol"
  | "String"
  | "Number"
  | "ParenthesisStart"
  | "ParenthesisEnd"
  | "Quote"

export class Token {
  constructor(
    public kind: TokenKind,
    public value: string,
    public span: Span,
  ) {}
}
