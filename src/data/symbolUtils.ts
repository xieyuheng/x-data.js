import { lexerMarks } from "../lexer/index.ts"
import { jsonParseNumber } from "../utils/json/jsonParse.ts"
import { stringHasBlank } from "../utils/string/stringHasBlank.ts"

export function stringIsSymbol(string: string): boolean {
  return (
    !stringHasBlank(string) &&
    jsonParseNumber(string) === undefined &&
    lexerMarks().every((mark) => !string.includes(mark))
  )
}
