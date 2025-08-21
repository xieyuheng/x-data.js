import assert from "node:assert"
import process from "node:process"
import * as Readline from "node:readline"
import { type Data } from "../data/index.ts"
import { LexerConfig } from "../lexer/index.ts"
import { Parser } from "../parser/index.ts"
import { type Token } from "../token/index.ts"
import { errorReport } from "../utils/error/errorReport.ts"

type ReplOptions = {
  prompt: string
  onSexps: (sexps: Array<Data>) => Promise<void>
  onClose?: () => Promise<void>
}

type Repl = ReplOptions & {
  parser: Parser
  text: string
  sexps: Array<Data>
  count: number
  rl?: Readline.Interface
}

export function createRepl(options: ReplOptions): Repl {
  return {
    prompt: options.prompt,
    onSexps: options.onSexps,
    onClose: options.onClose,
    parser: new Parser(),
    text: "",
    sexps: [],
    count: 0,
  }
}

function replPrompt(repl: Repl) {
  assert(repl.rl)
  repl.rl.prompt()
  repl.text = ""
}

export function replStart(repl: Repl): void {
  repl.rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  repl.rl.setPrompt(repl.prompt)

  replPrompt(repl)

  repl.rl.on("close", async () => {
    if (repl.onClose) {
      await repl.onClose()
    }
  })

  repl.rl.on("line", async (line) => {
    replHandleLine(repl, line)
    await repl.onSexps(repl.sexps)
    repl.sexps = []
  })
}

function replHandleLine(repl: Repl, line: string) {
  assert(repl.rl)
  repl.text += line
  const tokens = repl.parser.lexer.lex(repl.text)
  const balance = bracketBalance(repl.parser.lexer.config, tokens)
  switch (balance) {
    case "Ok": {
      return
    }

    case "Wrong": {
      let message = `[repl] Unbalanced brackets\n`
      message += "```\n"
      message += repl.text
      message += "\n"
      message += "```\n"
      process.stdout.write(message)
      replPrompt(repl)
    }

    case "Perfect": {
      try {
        const url = new URL(`repl:${++repl.count}`)
        repl.sexps.push(...repl.parser.parse(repl.text, { url }))
      } catch (error) {
        let message = `[repl] error\n`
        message += errorReport(error)
        message += `\n`
        process.stdout.write(message)
      }

      replPrompt(repl)
    }
  }
}

export function replClose(repl: Repl): void {
  assert(repl.rl)
  repl.rl.close()
}

type Balance = "Ok" | "Wrong" | "Perfect"

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
