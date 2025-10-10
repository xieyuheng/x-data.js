#!/usr/bin/env -S node --stack-size=65536

import { Commander } from "@xieyuheng/commander.js"
import { FormatCommand } from "./commands/FormatCommand.ts"

async function main() {
  const commander = new Commander()

  commander.use(FormatCommand)

  await commander.run(process.argv)
}

main()
