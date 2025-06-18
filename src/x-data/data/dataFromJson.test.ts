import assert from "node:assert"
import { test } from "node:test"
import { dataFromJson } from "../data/index.js"
import * as X from "../data/index.js"

test("dataFromJson", () => {
  assert.deepStrictEqual(dataFromJson("abc"), X.String("abc"))

  assert.deepStrictEqual(dataFromJson(["a", "b", "c"]),
                         X.List([X.String("a"), X.String("b"), X.String("c")]))

  assert.deepStrictEqual(dataFromJson({ a: 1, b: 2, c: 3 }), X.Record({
    a: X.Int(1),
    b: X.Int(2),
    c: X.Int(3),
  }))
})
