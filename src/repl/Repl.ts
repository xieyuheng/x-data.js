import assert from "node:assert"
import { stdin, stdout } from "node:process"
import * as Readline from "node:readline"
import { type Data } from "../data/index.ts"

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
