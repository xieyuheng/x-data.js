import { formatData } from "../format/index.ts"
import { createRepl, replStart } from "../repl/index.ts"

const repl = createRepl({
  welcome: "Welcome to format-data repl.",
  prompt: "> ",
  onSexps(sexps) {
    for (const sexp of sexps) {
      process.stdout.write(formatData(sexp))
      process.stdout.write(" ")
    }
    console.log()
  },
  onClose() {
    console.log(`[onClose] bye`)
  },
})

replStart(repl)
