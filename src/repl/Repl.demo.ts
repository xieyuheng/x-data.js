import { createRepl, replStart } from "../repl/index.ts"

const repl = createRepl({
  welcome: "Welcome to demo repl.",
  prompt: "> ",
  async onSexps(sexps) {
    console.log(sexps)
  },
  async onClose() {
    console.log(`[onClose] bye`)
  },
})

replStart(repl)
