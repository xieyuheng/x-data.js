import assert from "node:assert"
import { test } from "node:test"
import * as X from "../index.ts"

export type Type = TypeVar | Arrow | Union | Inter | Tau
export type TypeVar = { kind: "TypeVar"; name: string }
export type Arrow = { kind: "Arrow"; argType: Type; retType: Type }
export type Union = { kind: "Union"; candidateTypes: Array<Type> }
export type Inter = { kind: "Inter"; aspectTypes: Array<Type> }
export type Tau = {
  kind: "Tau"
  elementTypes: Array<Type>
  attrTypes: Record<string, Type>
  restType?: Type
}

function matchType(data: X.Data): Type {
  return X.match(typeMatcher, data)
}

const typeMatcher: X.Matcher<Type> = X.matcherChoice<Type>([
  X.matcher("(cons '-> types)", ({ types }) =>
    X.dataToArray(types)
      .map(matchType)
      .reduceRight((retType, argType) => ({
        kind: "Arrow",
        argType,
        retType,
      })),
  ),

  X.matcher("(cons 'union types)", ({ types }) => ({
    kind: "Union",
    candidateTypes: X.dataToArray(types).map(matchType),
  })),

  X.matcher("(cons 'inter types)", ({ types }) => ({
    kind: "Inter",
    aspectTypes: X.dataToArray(types).map(matchType),
  })),

  X.matcher("(cons 'tau types)", ({ types }) => ({
    kind: "Tau",
    elementTypes: X.dataToArray(types).map(matchType),
    attrTypes: {},
  })),

  X.matcher("name", ({ name }) => ({
    kind: "TypeVar",
    name: X.dataToString(name),
  })),
])

function assertParse(text: string, type: Type): void {
  assert.deepStrictEqual(X.match(typeMatcher, X.parseData(text)), type)
}

test("tau example", () => {
  assertParse("x", {
    kind: "TypeVar",
    name: "x",
  })
})
