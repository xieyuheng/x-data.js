import { formatData } from "../format/index.ts"
import { createRepl, replStart } from "../repl/index.ts"

const repl = createRepl({
  welcome: "Welcome to demo repl.",
  prompt: "> ",
  onSexps(sexps) {
    console.log(sexps.map(formatData))
  },
  onClose() {
    console.log(`[onClose] bye`)
  },
})

replStart(repl)
