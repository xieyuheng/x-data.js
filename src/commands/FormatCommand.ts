import { type Command } from "@xieyuheng/commander.js"
import fs from "node:fs"
import { errorReport } from "../helpers/error/errorReport.ts"
import { createUrlOrFileUrl } from "../helpers/url/createUrlOrFileUrl.ts"
import * as X from "../index.ts"

export const FormatCommand: Command = {
  name: "format",
  description: "Run a file",
  help(commander) {
    let message = `The ${this.name} command format a file.`
    message += `\n`
    message += `\n  ${commander.name} ${this.name} <file>`
    message += `\n`
    return message
  },

  async run(commander) {
    if (typeof commander.args[0] !== "string") {
      let message = `[format] expect the first argument to be a path`
      message += `\n  first argument: ${commander.args[0]}`
      throw new Error(message)
    }

    try {
      const url = createUrlOrFileUrl(commander.args[0])
      const text = loadText(url)
      const sexps = X.parseSexps(text)
      for (const sexp of sexps) {
        console.log(X.prettySexp(60, sexp))
        console.log()
      }
    } catch (error) {
      console.log(errorReport(error))
      process.exit(1)
    }
  },
}

function loadText(url: URL): string {
  if (url.protocol === "file:") {
    return fs.readFileSync(url.pathname, "utf8")
  }

  throw new Error(`[loadText] not supported protocol: ${url}`)
}
