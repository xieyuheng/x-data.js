import assert from "node:assert"
import { test } from "node:test"
import * as X from "../index.ts"
import { errorReport } from "../utils/error/errorReport.ts"

type Exp = Var | Lambda | Apply | Let
type Var = { kind: "Var"; name: string }
type Lambda = { kind: "Lambda"; name: string; ret: Exp }
type Apply = { kind: "Apply"; target: Exp; arg: Exp }
type Let = { kind: "Let"; name: string; rhs: Exp; body: Exp }

function Var(name: string): Var {
  return { kind: "Var", name }
}

function Lambda(name: string, ret: Exp): Lambda {
  return { kind: "Lambda", name, ret }
}

function Apply(target: Exp, arg: Exp): Apply {
  return { kind: "Apply", target, arg }
}

function Let(name: string, rhs: Exp, body: Exp): Let {
  return { kind: "Let", name, rhs, body }
}

function matchExp(sexp: X.Sexp): Exp {
  return X.match(expMatcher, sexp)
}

const keywords = ["lambda", "let"]

const expMatcher: X.Matcher<Exp> = X.matcherChoice<Exp>([
  X.matcher("`(lambda (,name) ,ret)", ({ name, ret }) =>
    Lambda(X.symbolContent(name), X.match(expMatcher, ret)),
  ),

  X.matcher("`(let ((,name ,rhs)) ,body)", ({ name, rhs, body }) =>
    Let(
      X.symbolContent(name),
      X.match(expMatcher, rhs),
      X.match(expMatcher, body),
    ),
  ),

  X.matcher("`(,target ,arg)", ({ target, arg }) =>
    Apply(X.match(expMatcher, target), X.match(expMatcher, arg)),
  ),

  X.matcher("name", ({ name }, { meta }) => {
    const nameSymbol = X.symbolContent(name)
    if (keywords.includes(nameSymbol)) {
      let message = "keywork should not be used as variable\n"
      throw new X.ErrorWithMeta(message, meta)
    }

    return Var(nameSymbol)
  }),
])

function assertParse(text: string, exp: Exp): void {
  const url = new URL("test:lambda")
  assert.deepStrictEqual(matchExp(X.parseSexp(text, { url })), exp)
}

test("examples/lambda", () => {
  assertParse("x", Var("x"))

  assertParse("(f x)", Apply(Var("f"), Var("x")))

  assertParse("(lambda (x) x)", Lambda("x", Var("x")))

  assertParse(
    "((lambda (x) x) (lambda (x) x))",
    Apply(Lambda("x", Var("x")), Lambda("x", Var("x"))),
  )

  assertParse(
    "(let ((id (lambda (x) x))) (id id))",
    Let("id", Lambda("x", Var("x")), Apply(Var("id"), Var("id"))),
  )
})

function assertErrorWithMeta(text: string): void {
  try {
    const url = new URL("test:lambda")
    matchExp(X.parseSexp(text, { url }))
  } catch (error) {
    console.log(errorReport(error))
  }
}

test("examples/lambda -- parsing errors", () => {
  assertErrorWithMeta("(f x")
  assertErrorWithMeta("(f x\n(g y)")
  assertErrorWithMeta("f x)")

  assertErrorWithMeta("(lambda x)")
})
