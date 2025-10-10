import assert from "node:assert"
import { test } from "node:test"
import * as X from "../sexp/index.ts"
import { sexpFromJson } from "../sexp/index.ts"

test("sexpFromJson", () => {
  assert.deepStrictEqual(sexpFromJson("abc"), X.String("abc"))

  assert.deepStrictEqual(
    sexpFromJson(["a", "b", "c"]),
    X.Tael([X.String("a"), X.String("b"), X.String("c")], {}),
  )

  assert.deepStrictEqual(
    sexpFromJson({ a: 1, b: 2, c: 3 }),
    X.Record({
      a: X.Int(1),
      b: X.Int(2),
      c: X.Int(3),
    }),
  )
})
