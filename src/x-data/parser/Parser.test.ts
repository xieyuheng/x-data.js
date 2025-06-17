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
  parentheses: [
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
