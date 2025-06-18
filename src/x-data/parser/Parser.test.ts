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
  assertParse("abc", X.String("abc"))
  assertParse("3-sphere", X.String("3-sphere"))
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
  assertParse("(a b c)", X.List([X.String("a"), X.String("b"), X.String("c")]))
  assertParse(
    "(a (b) c)",
    X.List([X.String("a"), X.List([X.String("b")]), X.String("c")]),
  )
})

test("list in square brackets", () => {
  // assertParse("[]", X.List([]))
  // assertParse("[a b c]", X.List([X.String("a"), X.String("b"), X.String("c")]))
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
