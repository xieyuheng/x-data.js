import assert from "node:assert"
import { test } from "node:test"
import { dataPruneAttributes } from "../data/index.ts"
import { matchData } from "../match/index.ts"
import { parseData } from "../parse/index.ts"

function assertMatch(
  patternText: string,
  dataText: string,
  expectedText: string,
): void {
  const substitution = matchData(
    dataPruneAttributes(parseData(patternText), ["span"]),
    dataPruneAttributes(parseData(dataText), ["span"]),
    {},
  )
  const expectedData = dataPruneAttributes(parseData(expectedText), ["span"])
  assert.deepStrictEqual(substitution, expectedData.attributes)
}

function assertMatchFail(patternText: string, dataText: string): void {
  const substitution = matchData(
    dataPruneAttributes(parseData(patternText), ["span"]),
    dataPruneAttributes(parseData(dataText), ["span"]),
    {},
  )
  assert.deepStrictEqual(substitution, undefined)
}

test("var", () => {
  assertMatch("x", "1", "[:x 1]")
  assertMatch("x", "hi", "[:x hi]")
})

test("bool int float", () => {
  assertMatch("#f", "#f", "[]")
  assertMatch("1", "1", "[]")
  assertMatch("3.14", "3.14", "[]")

  assertMatchFail("#f", "#t")
  assertMatchFail("1", "2")
  assertMatchFail("3.14", "3.1415")
})
