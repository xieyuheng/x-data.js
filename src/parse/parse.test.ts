import assert from "node:assert"
import { test } from "node:test"
import * as X from "../data/index.ts"
import { parseData } from "../parse/index.ts"

function assertParse(text: string, data: X.Data): void {
  assert(X.dataEqual(parseData(text), data))
}

test("symbol", () => {
  assertParse("abc", X.String("abc"))
  assertParse("3-sphere", X.String("3-sphere"))
})

test("string", () => {
  assertParse('"abc"', X.String("abc"))
})

test("bool", () => {
  assertParse("#t", X.Bool(true))
  assertParse("#f", X.Bool(false))
})

test("number", () => {
  assertParse("1", X.Int(1))
  assertParse("0", X.Int(0))
  assertParse("-1", X.Int(-1))
  assertParse("3.14", X.Float(3.14))
})

test("list in round brackets", () => {
  assertParse("()", X.List([]))
  assertParse("(a b c)", X.List([X.String("a"), X.String("b"), X.String("c")]))
  assertParse(
    "(a (b) c)",
    X.List([X.String("a"), X.List([X.String("b")]), X.String("c")]),
  )
})

test("list in square brackets", () => {
  assertParse("[]", X.List([X.String("tael")]))
  assertParse(
    "[a b c]",
    X.List([X.String("tael"), X.String("a"), X.String("b"), X.String("c")]),
  )
})

test("list with attributes", () => {
  assertParse("(:x 1 :y 2)", X.Record({ x: X.Int(1), y: X.Int(2) }))
  assertParse(
    "(a b c :x 1 :y 2)",
    X.Tael([X.String("a"), X.String("b"), X.String("c")], {
      x: X.Int(1),
      y: X.Int(2),
    }),
  )
})

test("quotes", () => {
  assertParse("'a", X.List([X.String("quote"), X.String("a")]))
  assertParse("'(a)", X.List([X.String("quote"), X.List([X.String("a")])]))
  assertParse(
    "'(a b c)",
    X.List([
      X.String("quote"),
      X.List([X.String("a"), X.String("b"), X.String("c")]),
    ]),
  )
  assertParse(
    ",(a b c)",
    X.List([
      X.String("unquote"),
      X.List([X.String("a"), X.String("b"), X.String("c")]),
    ]),
  )
  assertParse(
    "`(a ,b c)",
    X.List([
      X.String("quasiquote"),
      X.List([
        X.String("a"),
        X.List([X.String("unquote"), X.String("b")]),
        X.String("c"),
      ]),
    ]),
  )
})
