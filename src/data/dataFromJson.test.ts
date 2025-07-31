import assert from "node:assert"
import { test } from "node:test"
import * as X from "../data/index.js"
import { dataFromJson } from "../data/index.js"

test("dataFromJson", () => {
  assert.deepStrictEqual(dataFromJson("abc"), X.Symbol("abc"))

  assert.deepStrictEqual(
    dataFromJson(["a", "b", "c"]),
    X.Tael([X.Symbol("a"), X.Symbol("b"), X.Symbol("c")], {}),
  )

  assert.deepStrictEqual(
    dataFromJson({ a: 1, b: 2, c: 3 }),
    X.Record({
      a: X.Int(1),
      b: X.Int(2),
      c: X.Int(3),
    }),
  )
})
