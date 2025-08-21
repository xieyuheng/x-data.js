import assert from "node:assert"
import { stdin, stdout } from "node:process"
import * as Readline from "node:readline"
import { type Data } from "../data/index.ts"
import { LexerConfig } from "../lexer/index.ts"
import { type Token } from "../token/index.ts"

type Repl = {
  onData: (data: Data) => Promise<void>
  rl?: Readline.Interface
}

export function createRepl(options: Repl): Repl {
  return options
}

export function replStart(repl: Repl): void {
  repl.rl = Readline.createInterface({ input: stdin, output: stdout })
  repl.rl.on("line", (line) => {
    console.log(`line: ${line}`)
  })
}

export function replEnd(repl: Repl): void {
  assert(repl.rl)
  repl.rl.close()
}

type Balance = "Wrong" | "Ok" | "Perfect"

function bracketBalance(config: LexerConfig, tokens: Array<Token>): Balance {
  const bracketStack: Array<string> = []
  for (const token of tokens) {
    if (token.kind === "BracketStart") {
      bracketStack.push(token.value)
    }

    if (token.kind === "BracketEnd") {
      const start = bracketStack.pop()
      if (start === undefined) return "Wrong"
      if (!config.matchBrackets(start, token.value)) return "Wrong"
    }
  }

  if (bracketStack.length === 0) {
    return "Perfect"
  } else {
    return "Ok"
  }
}
