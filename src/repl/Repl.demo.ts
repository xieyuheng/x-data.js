import { createRepl, replStart } from "../repl/index.ts"

const repl = createRepl({
  async onData(data) {
    console.log(data)
  },
})

replStart(repl)
