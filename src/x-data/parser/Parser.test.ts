import assert from "node:assert"
import { test } from "node:test"
import * as X from "../data/index.ts"
import { Parser } from "../parser/index.ts"

const parser = new Parser({
  quotes: [
    { mark: "'", symbol: "quote" },
    { mark: ",", symbol: "unquote" },
    { mark: "`", symbol: "quasiquote" },
  ],
  brackets: [
    { start: "(", end: ")" },
    { start: "[", end: "]" },
  ],
  comments: [";"],
})

function assertParse(text: string, data: X.Data): void {
  assert.partialDeepStrictEqual(parser.parseData(text), data)
}

test("symbol", () => {
  assertParse("abc", X.Symbol("abc"))
  assertParse("3-sphere", X.Symbol("3-sphere"))
})

test("string", () => {
  assertParse('"abc"', X.String("abc"))
})

test("number", () => {
  assertParse("1", X.Int(1))
  assertParse("0", X.Int(0))
  assertParse("-1", X.Int(-1))
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
  // assertParse("[]", X.List([]))
  // assertParse("[a b c]", X.List([X.Symbol("a"), X.Symbol("b"), X.Symbol("c")]))
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
