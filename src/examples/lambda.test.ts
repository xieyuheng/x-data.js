import assert from "node:assert"
import { test } from "node:test"
import * as X from "../index.ts"

type Exp = Var | Lambda | Apply | Let
type Var = { kind: "Var"; name: string }
type Lambda = { kind: "Lambda"; name: string; ret: Exp }
type Apply = { kind: "Apply"; target: Exp; arg: Exp }
type Let = { kind: "Let"; name: string; rhs: Exp; body: Exp }

function matchExp(data: X.Data): Exp {
  return X.match(expMatcher, data)
}

const expMatcher: X.Matcher<Exp> = X.matcherChoice<Exp>([
  X.matcher("`(lambda (,name) ,ret)", ({ name, ret }) => ({
    kind: "Lambda",
    name: X.dataToString(name),
    ret: X.match(expMatcher, ret),
  })),
  X.matcher("`(let ((,name ,rhs)) ,body)", ({ name, rhs, body }) => ({
    kind: "Let",
    name: X.dataToString(name),
    rhs: X.match(expMatcher, rhs),
    body: X.match(expMatcher, body),
  })),
  X.matcher("`(,target ,arg)", ({ target, arg }) => ({
    kind: "Apply",
    target: X.match(expMatcher, target),
    arg: X.match(expMatcher, arg),
  })),
  X.matcher("name", ({ name }) => ({
    kind: "Var",
    name: X.dataToString(name),
  })),
])

function assertParse(text: string, exp: Exp): void {
  assert.deepStrictEqual(matchExp(X.parseData(text)), exp)
}

test("lambda", () => {
  assertParse("x", {
    kind: "Var",
    name: "x",
  })

  assertParse("(f x)", {
    kind: "Apply",
    target: { kind: "Var", name: "f" },
    arg: { kind: "Var", name: "x" },
  })

  assertParse("(lambda (x) x)", {
    kind: "Lambda",
    name: "x",
    ret: { kind: "Var", name: "x" },
  })

  assertParse("((lambda (x) x) (lambda (x) x))", {
    kind: "Apply",
    target: { kind: "Lambda", name: "x", ret: { kind: "Var", name: "x" } },
    arg: { kind: "Lambda", name: "x", ret: { kind: "Var", name: "x" } },
  })

  assertParse("(let ((id (lambda (x) x))) (id id))", {
    kind: "Let",
    name: "id",
    rhs: { kind: "Lambda", name: "x", ret: { kind: "Var", name: "x" } },
    body: {
      kind: "Apply",
      target: { kind: "Var", name: "id" },
      arg: { kind: "Var", name: "id" },
    },
  })
})
