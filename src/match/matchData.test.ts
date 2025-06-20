import assert from "node:assert"
import { test } from "node:test"
import * as X from "../data/index.ts"
import { dataPruneAttributes } from "../data/index.ts"
import { matchData } from "../match/index.ts"
import { parseData } from "../parse/index.ts"

function assertMatch(
  patternInput: string,
  dataInput: string | X.Data,
  expectedInput: string,
): void {
  const pattern = dataPruneAttributes(parseData(patternInput), ["span"])
  const data =
    typeof dataInput === "string"
      ? dataPruneAttributes(parseData(dataInput), ["span"])
      : dataInput
  const subst = matchData("NormalMode", pattern, data)({})
  const expectedData = dataPruneAttributes(parseData(expectedInput), ["span"])
  assert.deepStrictEqual(subst, expectedData.attributes)
}

function assertMatchFail(patternInput: string, dataInput: string): void {
  const subst = matchData(
    "NormalMode",
    dataPruneAttributes(parseData(patternInput), ["span"]),
    dataPruneAttributes(parseData(dataInput), ["span"]),
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

test("quote with attributes", () => {
  assertMatchFail("(quote x :a 1)", "x")
  assertMatch("(quote x :a a)", X.String("x", { a: X.Int(1) }), "[:a 1]")
  assertMatch("(quote 3 :a a)", X.Int(3, { a: X.Bool(false) }), "[:a #f]")
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
})

test("cons", () => {
  assertMatch("(cons head tail)", "(f x y)", "[:head f :tail (x y)]")
})
