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

function assertData(text: string, data: X.Data): void {
  assert.partialDeepStrictEqual(parser.parseData(text), data)
}

test("symbol", () => {
  assertData("abc", X.Symbol("abc"))
  assertData("3-sphere", X.Symbol("3-sphere"))
})

test("string", () => {
  assertData('"abc"', X.String("abc"))
})

test("number", () => {
  assertData("1", X.Int(1))
  assertData("0", X.Int(0))
  assertData("-1", X.Int(-1))
  assertData("3.14", X.Float(3.14))
})

test("list", () => {
  assertData("()", X.List([]))
  assertData("(a b c)", X.List([X.Symbol("a"), X.Symbol("b"), X.Symbol("c")]))
  assertData(
    "(a (b) c)",
    X.List([X.Symbol("a"), X.List([X.Symbol("b")]), X.Symbol("c")]),
  )
})

test("list", () => {
  // assertData("[]", X.List([]))
  // assertData("[a b c]", X.List([X.Symbol("a"), X.Symbol("b"), X.Symbol("c")]))
})
