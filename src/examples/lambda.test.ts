import assert from "node:assert"
import { test } from "node:test"
import * as X from "../index.ts"

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

function matchExp(data: X.Data): Exp {
  return X.match(expMatcher, data)
}

const expMatcher: X.Matcher<Exp> = X.matcherChoice<Exp>([
  X.matcher("`(lambda (,name) ,ret)", ({ name, ret }) =>
    Lambda(X.dataToString(name), X.match(expMatcher, ret)),
  ),

  X.matcher("`(let ((,name ,rhs)) ,body)", ({ name, rhs, body }) =>
    Let(
      X.dataToString(name),
      X.match(expMatcher, rhs),
      X.match(expMatcher, body),
    ),
  ),

  X.matcher("`(,target ,arg)", ({ target, arg }) =>
    Apply(X.match(expMatcher, target), X.match(expMatcher, arg)),
  ),

  X.matcher("name", ({ name }) => Var(X.dataToString(name))),
])

function assertParse(text: string, exp: Exp): void {
  assert.deepStrictEqual(matchExp(X.parseData(text)), exp)
}

test("lambda example", () => {
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
