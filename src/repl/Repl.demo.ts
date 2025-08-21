import { createRepl, replStart } from "../repl/index.ts"

const repl = createRepl({
  prompt: "> ",

  async onData(data) {
    console.log(data)
  },

  async onClose() {
    console.log(`[onClose] bye`)
  },
})

replStart(repl)
