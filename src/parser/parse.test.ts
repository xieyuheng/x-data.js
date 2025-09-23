import { test } from "node:test"
import * as X from "../data/index.ts"
import { formatData } from "../format/index.ts"
import { parseData } from "./index.ts"

function assertParse(text: string, expected: X.Data): void {
  const data = parseData(text)
  const ok = X.dataEqual(expected, data)
  if (!ok) {
    let message = `[assertParse] fail\n`
    message += `  data: ${formatData(data)}\n`
    message += `  expected: ${formatData(expected)}\n`
    throw new Error(message)
  }
}

test("parse -- symbol", () => {
  assertParse("abc", X.Symbol("abc"))
  assertParse("3-sphere", X.Symbol("3-sphere"))
  assertParse("#abc", X.Symbol("#abc"))
  assertParse("#3-sphere", X.Symbol("#3-sphere"))
})

test("parse -- string", () => {
  assertParse('"abc"', X.String("abc"))
})

test("parse -- bool", () => {
  assertParse("#t", X.Bool(true))
  assertParse("#f", X.Bool(false))
})

test("parse -- number", () => {
  assertParse("1", X.Int(1))
  assertParse("0", X.Int(0))
  assertParse("-1", X.Int(-1))
  assertParse("0.0", X.Float(0.0))
  assertParse("3.14", X.Float(3.14))
})

test("parse -- round brackets", () => {
  assertParse("()", X.List([]))
  assertParse("(a b c)", X.List([X.Symbol("a"), X.Symbol("b"), X.Symbol("c")]))
  assertParse(
    "(a (b) c)",
    X.List([X.Symbol("a"), X.List([X.Symbol("b")]), X.Symbol("c")]),
  )
})

test("parse -- square brackets", () => {
  assertParse("[]", X.List([X.Symbol("@tael")]))
  assertParse(
    "[a b c]",
    X.List([X.Symbol("@tael"), X.Symbol("a"), X.Symbol("b"), X.Symbol("c")]),
  )
})

test("parse -- flower brackets", () => {
  assertParse("{}", X.List([X.Symbol("@set")]))
  assertParse(
    "{a b c}",
    X.List([X.Symbol("@set"), X.Symbol("a"), X.Symbol("b"), X.Symbol("c")]),
  )
})

test("parse -- list with attributes", () => {
  assertParse("(:x 1 :y 2)", X.Record({ x: X.Int(1), y: X.Int(2) }))
  assertParse(
    "(a b c :x 1 :y 2)",
    X.Tael([X.Symbol("a"), X.Symbol("b"), X.Symbol("c")], {
      x: X.Int(1),
      y: X.Int(2),
    }),
  )
})

test("parse -- quotes", () => {
  assertParse("'a", X.List([X.Symbol("@quote"), X.Symbol("a")]))
  // assertParse("'(a)", X.List([X.Symbol("@quote"), X.List([X.Symbol("a")])]))
  // assertParse(
  //   "'(a b c)",
  //   X.List([
  //     X.Symbol("@quote"),
  //     X.List([X.Symbol("a"), X.Symbol("b"), X.Symbol("c")]),
  //   ]),
  // )
  // assertParse(
  //   ",(a b c)",
  //   X.List([
  //     X.Symbol("@unquote"),
  //     X.List([X.Symbol("a"), X.Symbol("b"), X.Symbol("c")]),
  //   ]),
  // )
  // assertParse(
  //   "`(a ,b c)",
  //   X.List([
  //     X.Symbol("@quasiquote"),
  //     X.List([
  //       X.Symbol("a"),
  //       X.List([X.Symbol("@unquote"), X.Symbol("b")]),
  //       X.Symbol("c"),
  //     ]),
  //   ]),
  // )
})
