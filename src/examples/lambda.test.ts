import assert from "node:assert"
import { test } from "node:test"
import { dataToString } from "../data/index.ts"
import {
  match,
  matcher,
  matcherChoice,
  type Matcher,
} from "../matcher/index.ts"
import { parseData } from "../parse/index.ts"

type Exp = Var | Lambda | Apply | Let
type Var = { kind: "Var"; name: string }
type Lambda = { kind: "Lambda"; name: string; ret: Exp }
type Apply = { kind: "Apply"; target: Exp; arg: Exp }
type Let = { kind: "Let"; name: string; rhs: Exp; body: Exp }

const expMatcher: Matcher<Exp> = matcherChoice<Exp>([
  matcher("`(lambda (,name) ,ret)", ({ name, ret }) => ({
    kind: "Lambda",
    name: dataToString(name),
    ret: match(expMatcher, ret),
  })),
  matcher("`(let ((,name ,rhs)) ,body)", ({ name, rhs, body }) => ({
    kind: "Let",
    name: dataToString(name),
    rhs: match(expMatcher, rhs),
    body: match(expMatcher, body),
  })),
  matcher("`(,target ,arg)", ({ target, arg }) => ({
    kind: "Apply",
    target: match(expMatcher, target),
    arg: match(expMatcher, arg),
  })),
  matcher("name", ({ name }) => ({
    kind: "Var",
    name: dataToString(name),
  })),
])

test("lambda", () => {
  assert.deepStrictEqual(match(expMatcher, parseData("x")), {
    kind: "Var",
    name: "x",
  })

  assert.deepStrictEqual(match(expMatcher, parseData("(f x)")), {
    kind: "Apply",
    target: { kind: "Var", name: "f" },
    arg: { kind: "Var", name: "x" },
  })

  assert.deepStrictEqual(match(expMatcher, parseData("(lambda (x) x)")), {
    kind: "Lambda",
    name: "x",
    ret: { kind: "Var", name: "x" },
  })

  assert.deepStrictEqual(
    match(expMatcher, parseData("((lambda (x) x) (lambda (x) x))")),
    {
      kind: "Apply",
      target: { kind: "Lambda", name: "x", ret: { kind: "Var", name: "x" } },
      arg: { kind: "Lambda", name: "x", ret: { kind: "Var", name: "x" } },
    },
  )

  assert.deepStrictEqual(
    match(expMatcher, parseData("(let ((id (lambda (x) x))) (id id))")),
    {
      kind: "Let",
      name: "id",
      rhs: { kind: "Lambda", name: "x", ret: { kind: "Var", name: "x" } },
      body: {
        kind: "Apply",
        target: { kind: "Var", name: "id" },
        arg: { kind: "Var", name: "id" },
      },
    },
  )
})
