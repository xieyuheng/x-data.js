import * as X from "../data/index.ts"
import { matchData, type Subst } from "../match/index.ts"
import { parseData } from "../parser/index.ts"
import { tokenMetaFromDataMeta, type TokenMeta } from "../token/index.ts"

export type Matcher<A> = (data: X.Data) => A | undefined

export type MatcherCallback<A> = (
  subst: Subst,
  options: { data: X.Data; meta: TokenMeta },
) => A | undefined

export function matcher<A>(
  patternText: string,
  f: MatcherCallback<A>,
): Matcher<A> {
  const pattern = parseData(patternText)
  return (data) => {
    const subst = matchData("NormalMode", pattern, data)({})
    if (!subst) return undefined
    return f(subst, {
      data: data,
      meta: tokenMetaFromDataMeta(data.meta),
    })
  }
}

export function matcherChoice<A>(matchers: Array<Matcher<A>>): Matcher<A> {
  return (data) => {
    for (const matcher of matchers) {
      const result = matcher(data)
      if (result) return result
    }
  }
}

export function match<A>(matcher: Matcher<A>, data: X.Data): A {
  const result = matcher(data)
  if (result === undefined) throw new Error("match fail")
  else return result
}
