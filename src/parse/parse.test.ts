import assert from "node:assert"
import { test } from "node:test"
import * as X from "../data/index.ts"
import { parseData } from "../parse/index.ts"

function assertParse(text: string, data: X.Data): void {
  assert(X.dataEqual(parseData(text), data))
}

test("symbol", () => {
  assertParse("abc", X.Symbol("abc"))
  assertParse("3-sphere", X.Symbol("3-sphere"))
})

test("doublequoted string", () => {
  assertParse('"abc"', X.List([X.Symbol("quote"), X.Symbol("abc")]))
})

test("bool", () => {
  assertParse("#t", X.Bool(true))
  assertParse("#f", X.Bool(false))
})

test("number", () => {
  assertParse("1", X.Int(1))
  assertParse("0", X.Int(0))
  assertParse("-1", X.Int(-1))
  assertParse("0.0", X.Float(0.0))
  assertParse("3.14", X.Float(3.14))
})

test("list in round brackets", () => {
  assertParse("()", X.List([]))
  assertParse("(a b c)", X.List([X.Symbol("a"), X.Symbol("b"), X.Symbol("c")]))
  assertParse(
    "(a (b) c)",
    X.List([X.Symbol("a"), X.List([X.Symbol("b")]), X.Symbol("c")]),
  )
})

test("list in square brackets", () => {
  assertParse("[]", X.List([X.Symbol("tael")]))
  assertParse(
    "[a b c]",
    X.List([X.Symbol("tael"), X.Symbol("a"), X.Symbol("b"), X.Symbol("c")]),
  )
})

test("list with attributes", () => {
  assertParse("(:x 1 :y 2)", X.Record({ x: X.Int(1), y: X.Int(2) }))
  assertParse(
    "(a b c :x 1 :y 2)",
    X.Tael([X.Symbol("a"), X.Symbol("b"), X.Symbol("c")], {
      x: X.Int(1),
      y: X.Int(2),
    }),
  )
})

test("quotes", () => {
  assertParse("'a", X.List([X.Symbol("quote"), X.Symbol("a")]))
  assertParse("'(a)", X.List([X.Symbol("quote"), X.List([X.Symbol("a")])]))
  assertParse(
    "'(a b c)",
    X.List([
      X.Symbol("quote"),
      X.List([X.Symbol("a"), X.Symbol("b"), X.Symbol("c")]),
    ]),
  )
  assertParse(
    ",(a b c)",
    X.List([
      X.Symbol("unquote"),
      X.List([X.Symbol("a"), X.Symbol("b"), X.Symbol("c")]),
    ]),
  )
  assertParse(
    "`(a ,b c)",
    X.List([
      X.Symbol("quasiquote"),
      X.List([
        X.Symbol("a"),
        X.List([X.Symbol("unquote"), X.Symbol("b")]),
        X.Symbol("c"),
      ]),
    ]),
  )
})
