// import assert from "node:assert"
import { test } from "node:test"
// import { matchData } from "../match/index.ts"

function assertMatch(
  patternText: string,
  dataText: string,
  expectedText: string,
): void {
  // const expectedData = parse(expectedText)
  // const result = matchData(parse(patternText), parse(dataText))
}

test("var", () => {
  assertMatch("x", "1", "[:x 1]")
})
