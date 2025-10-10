import * as X from "./Sexp.ts"

export function asTael(sexp: X.Sexp): X.Tael {
  if (sexp.kind === "Tael") return sexp
  throw new Error(`[asTael] fail on: ${sexp.kind}`)
}

export function isTael(sexp: X.Sexp): sexp is X.Tael {
  return sexp.kind === "Tael"
}

export function List(elements: Array<X.Sexp>, meta: X.Attributes = {}): X.Tael {
  return X.Tael(elements, {}, meta)
}

export function Record(
  attributes: X.Attributes,
  meta: X.Attributes = {},
): X.Tael {
  return X.Tael([], attributes, meta)
}

export function Cons(head: X.Sexp, tail: X.Sexp): X.Tael {
  if (tail.kind !== "Tael") {
    throw new Error(`[Cons] tail to be a list, tail kind: ${tail.kind}.`)
  }

  return X.Tael([head, ...tail.elements], tail.attributes, tail.meta)
}
