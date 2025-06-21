import * as X from "../data/index.ts"
import { matchData, type Subst } from "../match/index.ts"
import { parseData } from "../parse/index.ts"

export type Matcher<A> = (data: X.Data) => A | undefined

export function matcher<A>(
  patternText: string,
  f: (subst: Subst) => A | undefined,
): Matcher<A> {
  return (data) => {
    const pattern = parseData(patternText)
    const subst = matchData("NormalMode", pattern, data)({})
    if (!subst) return undefined
    return f(subst)
  }
}
