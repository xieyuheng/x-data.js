import assert from "node:assert"
import { test } from "node:test"
import { dataFromJson, dataToJson } from "../data/index.js"

test("dataToJson", () => {
  assert.deepStrictEqual("abc", dataToJson(dataFromJson("abc")))

  assert.deepStrictEqual(
    ["a", "b", "c"],
    dataToJson(dataFromJson(["a", "b", "c"])),
  )

  assert.deepStrictEqual(
    { a: 1, b: 2, c: 3 },
    dataToJson(dataFromJson({ a: 1, b: 2, c: 3 })),
  )
})
