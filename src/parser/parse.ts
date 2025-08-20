import { type Data } from "../data/index.ts"
import { Parser, type ParserMeta } from "./Parser.ts"

export function parseDataArray(
  text: string,
  meta: ParserMeta = {},
): Array<Data> {
  return new Parser().parse(text, meta)
}

export function parseData(text: string, meta: ParserMeta = {}): Data {
  const array = parseDataArray(text, meta)
  if (array.length === 1) {
    return array[0]
  }

  let message = `[parseData] expecting one data, but found multiple data\n`
  throw new Error(message)
}
