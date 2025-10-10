import * as X from "./Sexp.ts"

export function isAtom(sexp: X.Sexp): sexp is X.Atom {
  return (
    sexp.kind === "Symbol" ||
    sexp.kind === "String" ||
    sexp.kind === "Int" ||
    sexp.kind === "Float" ||
    sexp.kind === "Hashtag"
  )
}

export function isSymbol(sexp: X.Sexp): sexp is X.Symbol {
  return sexp.kind === "Symbol"
}

export function isString(sexp: X.Sexp): sexp is X.String {
  return sexp.kind === "String"
}

export function isInt(sexp: X.Sexp): sexp is X.Int {
  return sexp.kind === "Int"
}

export function isFloat(sexp: X.Sexp): sexp is X.Float {
  return sexp.kind === "Float"
}

export function isHashtag(sexp: X.Sexp): sexp is X.Hashtag {
  return sexp.kind === "Hashtag"
}

export function asSymbol(sexp: X.Sexp): X.Symbol {
  if (sexp.kind === "Symbol") return sexp
  throw new Error(`[asSymbol] fail on: ${sexp.kind}`)
}

export function asString(sexp: X.Sexp): X.String {
  if (sexp.kind === "String") return sexp
  throw new Error(`[asString] fail on: ${sexp.kind}`)
}

export function asInt(sexp: X.Sexp): X.Int {
  if (sexp.kind === "Int") return sexp
  throw new Error(`[asInt] fail on: ${sexp.kind}`)
}

export function asFloat(sexp: X.Sexp): X.Float {
  if (sexp.kind === "Float") return sexp
  throw new Error(`[asFloat] fail on: ${sexp.kind}`)
}

export function asHashtag(sexp: X.Sexp): X.Hashtag {
  if (sexp.kind === "Hashtag") return sexp
  throw new Error(`[asHashtag] fail on: ${sexp.kind}`)
}
