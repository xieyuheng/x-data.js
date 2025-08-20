import assert from "node:assert"
import { test } from "node:test"
import * as X from "../data/index.ts"
import { matchData } from "../match/index.ts"
import { parseData } from "../parser/index.ts"

function assertMatch(
  patternInput: string,
  dataInput: string | X.Data,
  expectedInput: string,
): void {
  const pattern = parseData(patternInput)
  const data = typeof dataInput === "string" ? parseData(dataInput) : dataInput
  const subst = matchData("NormalMode", pattern, data)({})
  const expectedData = parseData(expectedInput)
  assert(subst)
  assert(X.attributesEqual(subst, X.asTael(expectedData).attributes))
}

function assertMatchFail(patternInput: string, dataInput: string): void {
  const subst = matchData(
    "NormalMode",
    parseData(patternInput),
    parseData(dataInput),
  )({})
  assert.deepStrictEqual(subst, undefined)
}

test("var", () => {
  assertMatch("x", "1", "[:x 1]")
  assertMatch("x", "hi", "[:x hi]")
})

test("bool int float", () => {
  assertMatch("#f", "#f", "[]")
  assertMatch("1", "1", "[]")
  assertMatch("3.14", "3.14", "[]")

  assertMatchFail("#f", "#t")
  assertMatchFail("1", "2")
  assertMatchFail("3.14", "3.1415")
})

test("list", () => {
  assertMatch("[x y z]", "(1 2 3)", "[:x 1 :y 2 :z 3]")
  assertMatch(
    "[x y z :a a :b b]",
    "(1 2 3 :a 10 :b 20)",
    "[:x 1 :y 2 :z 3 :a 10 :b 20]",
  )
  assertMatch("[x [y] z]", "(1 (2) 3)", "[:x 1 :y 2 :z 3]")
  assertMatchFail("[x y x]", "(1 2 3)")
  assertMatchFail("[x 0 z]", "(1 2 3)")
})

test("quote", () => {
  assertMatch("'x", "x", "[]")
  assertMatch("(quote x)", "x", "[]")
  assertMatch("(quote 3)", "3", "[]")

  assertMatch("['lambda [x] x]", "(lambda (x) x)", "[:x x]")
  assertMatch("'(lambda (x) x)", "(lambda (x) x)", "[]")
})

test("quote record", () => {
  assertMatch("'(:x 1 :y 2)", "(:x 1 :y 2 :z 3)", "[]")
  assertMatchFail("'(:x 1 :y 2)", "(:x 1 :y 3)")
  assertMatchFail("'(:x 1 :y 2 :z 3)", "(:x 1 :y 2)")
  assertMatch(
    "'(:x 1 :y 2 :p (:x 1 :y 2))",
    "(:x 1 :y 2 :z 3 :p (:x 1 :y 2 :z 3))",
    "[]",
  )
})

test("quasiquote", () => {
  assertMatch("`x", "x", "[]")
  assertMatch("`(lambda (,x) ,x)", "(lambda (x) x)", "[:x x]")
  assertMatch("`(lambda (,name) ,ret)", "(lambda (x) x)", "[:name x :ret x]")
  assertMatch("`(,target ,arg)", "(f x)", "[:target f :arg x]")
})

test("cons", () => {
  assertMatch("(cons head tail)", "(f x y)", "[:head f :tail (x y)]")
})

test("cons*", () => {
  assertMatch(
    "(cons* head next tail)",
    "(f x y)",
    "[:head f :next x :tail (y)]",
  )
})
