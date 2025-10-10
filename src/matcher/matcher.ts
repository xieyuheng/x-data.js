import { matchSexp, type Subst } from "../match/index.ts"
import { parseSexp } from "../parser/index.ts"
import * as X from "../sexp/index.ts"
import { tokenMetaFromSexpMeta, type TokenMeta } from "../token/index.ts"

export type Matcher<A> = (sexp: X.Sexp) => A | undefined

export type MatcherCallback<A> = (
  subst: Subst,
  options: { sexp: X.Sexp; meta: TokenMeta },
) => A | undefined

export function matcher<A>(
  patternText: string,
  f: MatcherCallback<A>,
): Matcher<A> {
  const pattern = parseSexp(patternText)
  return (sexp) => {
    const subst = matchSexp("NormalMode", pattern, sexp)({})
    if (!subst) return undefined
    return f(subst, {
      sexp: sexp,
      meta: tokenMetaFromSexpMeta(sexp.meta),
    })
  }
}

export function matcherChoice<A>(matchers: Array<Matcher<A>>): Matcher<A> {
  return (sexp) => {
    for (const matcher of matchers) {
      const result = matcher(sexp)
      if (result) return result
    }
  }
}

export function match<A>(matcher: Matcher<A>, sexp: X.Sexp): A {
  const result = matcher(sexp)
  if (result === undefined) throw new Error("match fail")
  else return result
}
