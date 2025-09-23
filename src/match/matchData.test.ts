import assert from "node:assert"
import { test } from "node:test"
import * as X from "../data/index.ts"
import { formatData } from "../format/index.ts"
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
  const expected = parseData(expectedInput)
  if (subst === undefined) {
    let message = `[assertMatch] match fail\n`
    message += `  pattern: ${formatData(pattern)}\n`
    message += `  data: ${formatData(data)}\n`
    message += `  expected: ${formatData(expected)}\n`
    throw new Error(message)
  }

  const ok = X.attributesEqual(subst, X.asTael(expected).attributes)
  if (!ok) {
    let message = `[assertMatch] subst not equal to expected subst\n`
    message += `  pattern: ${formatData(pattern)}\n`
    message += `  data: ${formatData(data)}\n`
    message += `  subst: ${formatData(X.Record(subst))}\n`
    message += `  expected: ${formatData(expected)}\n`
    throw new Error(message)
  }
}

function assertMatchFail(patternInput: string, dataInput: string): void {
  const subst = matchData(
    "NormalMode",
    parseData(patternInput),
    parseData(dataInput),
  )({})
  assert.deepStrictEqual(subst, undefined)
}

test("matchData -- var", () => {
  assertMatch("x", "1", "[:x 1]")
  assertMatch("x", "hi", "[:x hi]")
})

test("matchData -- int", () => {
  assertMatch("1", "1", "[]")
  assertMatchFail("1", "2")
})

test("matchData -- float", () => {
  assertMatch("3.14", "3.14", "[]")
  assertMatchFail("3.14", "3.1415")
})

test("matchData -- literal string", () => {
  assertMatch('"hello world"', X.String("hello world"), "[]")
})

test("matchData -- list", () => {
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

test("matchData -- quote", () => {
  assertMatch("'x", "x", "[]")
  assertMatch("(@quote x)", "x", "[]")
  assertMatch("(@quote 3)", "3", "[]")
  assertMatch('(@quote "hello world")', '"hello world"', "[]")

  assertMatch("['lambda [x] x]", "(lambda (x) x)", "[:x x]")
  assertMatch("'(lambda (x) x)", "(lambda (x) x)", "[]")
})

test("matchData -- quote record", () => {
  assertMatch("'(:x 1 :y 2)", "(:x 1 :y 2 :z 3)", "[]")
  assertMatchFail("'(:x 1 :y 2)", "(:x 1 :y 3)")
  assertMatchFail("'(:x 1 :y 2 :z 3)", "(:x 1 :y 2)")
  assertMatch(
    "'(:x 1 :y 2 :p (:x 1 :y 2))",
    "(:x 1 :y 2 :z 3 :p (:x 1 :y 2 :z 3))",
    "[]",
  )
})

test("matchData -- quasiquote", () => {
  assertMatch("`x", "x", "[]")
  assertMatch("`(lambda (,x) ,x)", "(lambda (x) x)", "[:x x]")
  assertMatch("`(lambda (,name) ,ret)", "(lambda (x) x)", "[:name x :ret x]")
  assertMatch("`(,target ,arg)", "(f x)", "[:target f :arg x]")
})

test("matchData -- cons", () => {
  assertMatch("(cons head tail)", "(f x y)", "[:head f :tail (x y)]")
})

test("matchData -- cons*", () => {
  assertMatch(
    "(cons* head next tail)",
    "(f x y)",
    "[:head f :next x :tail (y)]",
  )
})
