# x-data.js

A extension to [S-expression](https://en.wikipedia.org/wiki/S-expression)
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
import {
  dataToString,
  match,
  matcher,
  matcherChoice,
  parseData,
  type Matcher,
} from "../index.ts"

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

function assertParse(text: string, exp: Exp): void {
  assert.deepStrictEqual(match(expMatcher, parseData(text)), exp)
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

## Contributions

To make a contribution, fork this project and create a pull request.

Please read the [STYLE-GUIDE.md](STYLE-GUIDE.md) before you change the code.

Remember to add yourself to [AUTHORS](AUTHORS).
Your line belongs to you, you can write a little
introduction to yourself but not too long.

## License

[GPLv3](LICENSE)
