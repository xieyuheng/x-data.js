import { type Data } from "../data/index.ts"
import { Lexer } from "../lexer/index.ts"
import { type Token } from "../token/index.ts"
import { Parsing } from "./Parsing.ts"

const lexer = new Lexer({
  quotes: [
    { mark: "'", symbol: "quote" },
    { mark: ",", symbol: "unquote" },
    { mark: "`", symbol: "quasiquote" },
  ],
  brackets: [
    { start: "(", end: ")" },
    { start: "[", end: "]" },
  ],
  comments: [";"],
})

export function parseData(text: string): Data {
  const array = parseDataArray(text)
  if (array.length === 1) {
    return array[0]
  }

  let message = `[parseData] expecting one data, but found multiple data\n`
  throw new Error(message)
}

export function parseDataArray(text: string): Array<Data> {
  const array: Array<Data> = []
  let tokens = lexer.lex(text)
  while (tokens.length > 0) {
    const { data, remain } = parseDataFromTokens(tokens)
    array.push(data)
    if (remain.length === 0) return array
    tokens = remain
  }

  return array
}

function parseDataFromTokens(tokens: Array<Token>): {
  data: Data
  remain: Array<Token>
} {
  const parsing = new Parsing(lexer)
  return parsing.parse(tokens)
}
