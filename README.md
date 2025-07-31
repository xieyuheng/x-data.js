# x-data.js

An extension to [S-expression](https://en.wikipedia.org/wiki/S-expression)
to support list with attributes.

For example, we can represent the following JSON:

```json
{ "oranges": 2, "apples": 6, "pears": 5 }
```

as:

```scheme
[:oranges 2 :apples 6 :pears 5]
```

Quoted list:

```scheme
'(lambda (x) x)
```

evaluates to:

```scheme
['lambda ['x] 'x]
```

This is useful for writing interpreter in lisp
with good support for error report.

For example:

```scheme
(lambda (x) x)
```

can be parsed to:

```scheme
['lambda ['x] 'x :row 0 :colum 0]
```

## Install

```sh
npm install @xieyuheng/x-data.js
```

## Examples

[src/examples/lambda.test.ts](src/examples/lambda.test.ts):

```typescript
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
    Lambda(X.symbolToString(name), X.match(expMatcher, ret)),
  ),

  X.matcher("`(let ((,name ,rhs)) ,body)", ({ name, rhs, body }) =>
    Let(
      X.symbolToString(name),
      X.match(expMatcher, rhs),
      X.match(expMatcher, body),
    ),
  ),

  X.matcher("`(,target ,arg)", ({ target, arg }) =>
    Apply(X.match(expMatcher, target), X.match(expMatcher, arg)),
  ),

  X.matcher("name", ({ name }) => Var(X.symbolToString(name))),
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
```

## Development

```sh
npm install     # Install dependencies
npm run build   # Compile `src/` to `lib/`
npm run test    # Run test
```

## References

- [Some Thoughts on JSON vs S-expressions](https://eli.thegreenplace.net/2012/03/04/some-thoughts-on-json-vs-s-expressions), by Eli Bendersky, 2012.
- [with-meta in clojure.core](https://clojuredocs.org/clojure.core/with-meta)

## License

[GPLv3](LICENSE)
