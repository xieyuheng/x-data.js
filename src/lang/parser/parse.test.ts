import { test } from "node:test"
import { formatSexp } from "../format/index.ts"
import * as X from "../sexp/index.ts"
import { parseSexp } from "./index.ts"

function assertParse(text: string, expected: X.Sexp): void {
  const sexp = parseSexp(text)
  const ok = X.sexpEqual(expected, sexp)
  if (!ok) {
    let message = `[assertParse] fail\n`
    message += `  sexp: ${formatSexp(sexp)}\n`
    message += `  expected: ${formatSexp(expected)}\n`
    throw new Error(message)
  }
}

test("parse -- symbol", () => {
  assertParse("abc", X.Symbol("abc"))
  assertParse("3-sphere", X.Symbol("3-sphere"))
})

test("parse -- string", () => {
  assertParse('"abc"', X.String("abc"))
})

test("parse -- hashtag", () => {
  assertParse("#t", X.Hashtag("t"))
  assertParse("#f", X.Hashtag("f"))
  assertParse("#null", X.Hashtag("null"))
  assertParse("#void", X.Hashtag("void"))
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
  assertParse("'(a)", X.List([X.Symbol("@quote"), X.List([X.Symbol("a")])]))
  assertParse("'(#a)", X.List([X.Symbol("@quote"), X.List([X.Hashtag("a")])]))
  assertParse(
    "'(a b c)",
    X.List([
      X.Symbol("@quote"),
      X.List([X.Symbol("a"), X.Symbol("b"), X.Symbol("c")]),
    ]),
  )
  assertParse(
    ",(a b c)",
    X.List([
      X.Symbol("@unquote"),
      X.List([X.Symbol("a"), X.Symbol("b"), X.Symbol("c")]),
    ]),
  )
  assertParse(
    "`(a ,b c)",
    X.List([
      X.Symbol("@quasiquote"),
      X.List([
        X.Symbol("a"),
        X.List([X.Symbol("@unquote"), X.Symbol("b")]),
        X.Symbol("c"),
      ]),
    ]),
  )
})
