import { stringHasBlank } from "../utils/string/stringHasBlank.ts"

export function stringIsSymbol(string: string): boolean {
  return !stringHasBlank(string) && tryParseNumber(string) === undefined
}

function tryParseNumber(text: string): number | undefined {
  try {
    const value = JSON.parse(text)
    if (typeof value === "number") return value
    else return undefined
  } catch (error) {
    return undefined
  }
}
