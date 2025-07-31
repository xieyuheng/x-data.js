import assert from "node:assert"
import { test } from "node:test"
import * as X from "../index.ts"
import { recordMap } from "../utils/record/recordMap.ts"

type Type = TypeVar | Arrow | Union | Inter | Tau
type TypeVar = { kind: "TypeVar"; name: string }
type Arrow = { kind: "Arrow"; argType: Type; retType: Type }
type Union = { kind: "Union"; candidateTypes: Array<Type> }
type Inter = { kind: "Inter"; aspectTypes: Array<Type> }
type Tau = {
  kind: "Tau"
  elementTypes: Array<Type>
  attrTypes: Record<string, Type>
  restType?: Type
}

function TypeVar(name: string): TypeVar {
  return { kind: "TypeVar", name }
}

function Arrow(argType: Type, retType: Type): Arrow {
  return { kind: "Arrow", argType, retType }
}

function Union(candidateTypes: Array<Type>): Union {
  return { kind: "Union", candidateTypes }
}

function Inter(aspectTypes: Array<Type>): Inter {
  return { kind: "Inter", aspectTypes }
}

function Tau(
  elementTypes: Array<Type>,
  attrTypes: Record<string, Type>,
  restType?: Type,
): Tau {
  return {
    kind: "Tau",
    elementTypes,
    attrTypes,
    restType,
  }
}

function matchType(data: X.Data): Type {
  return X.match(typeMatcher, data)
}

const typeMatcher: X.Matcher<Type> = X.matcherChoice<Type>([
  X.matcher("(cons '-> types)", ({ types }) =>
    X.dataToArray(types)
      .map(matchType)
      .reduceRight((retType, argType) => Arrow(argType, retType)),
  ),

  X.matcher("(cons 'union types)", ({ types }) =>
    Union(X.dataToArray(types).map(matchType)),
  ),

  X.matcher("(cons 'inter types)", ({ types }) =>
    Inter(X.dataToArray(types).map(matchType)),
  ),

  X.matcher("(cons 'tau types)", ({ types }, { data }) =>
    Tau(
      X.dataToArray(types).map(matchType),
      recordMap(X.asTael(data).attributes, matchType),
    ),
  ),

  X.matcher("name", ({ name }) => TypeVar(X.dataToSymbol(name))),
])

function assertParse(text: string, type: Type): void {
  assert.deepStrictEqual(matchType(X.parseData(text)), type)
}

test("examples/tau", () => {
  assertParse("A", TypeVar("A"))

  assertParse(
    "(-> A B C)",
    Arrow(TypeVar("A"), Arrow(TypeVar("B"), TypeVar("C"))),
  )

  assertParse(
    "(union A B C)",
    Union([TypeVar("A"), TypeVar("B"), TypeVar("C")]),
  )

  assertParse(
    "(inter A B C)",
    Inter([TypeVar("A"), TypeVar("B"), TypeVar("C")]),
  )

  assertParse(
    "(tau A B C)",
    Tau([TypeVar("A"), TypeVar("B"), TypeVar("C")], {}),
  )

  assertParse(
    "(tau :x A :y B :z C)",
    Tau([], {
      x: TypeVar("A"),
      y: TypeVar("B"),
      z: TypeVar("C"),
    }),
  )

  assertParse(
    "(tau A B C :x A :y B :z C)",
    Tau([TypeVar("A"), TypeVar("B"), TypeVar("C")], {
      x: TypeVar("A"),
      y: TypeVar("B"),
      z: TypeVar("C"),
    }),
  )

  assertParse(
    "(tau A B C :x A :y B :z (tau :x A :y B))",
    Tau([TypeVar("A"), TypeVar("B"), TypeVar("C")], {
      x: TypeVar("A"),
      y: TypeVar("B"),
      z: Tau([], {
        x: TypeVar("A"),
        y: TypeVar("B"),
      }),
    }),
  )
})

function assertParsingError(text: string): void {
  try {
    matchType(X.parseData(text))
  } catch (error) {
    if (error instanceof X.ParsingError) {
      console.log("[assertParsingError]", error.report({ text }))
      return
    }

    throw error
  }
}

test("examples/test -- parsing errors", () => {
  assertParsingError("(-> A B")
  assertParsingError("(tau :x :y)")
  assertParsingError("(tau A B C :x A :y B :z (tau :x :y))")
})
