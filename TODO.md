[matcher] `matcher` -- to create combinators
[matcher] `matcherChoice` -- to create combinators

[example] examples/lambda -- `Exp`
[example] examples/lambda -- `expMatcher`

```typescript
export function matchStmt(data: X.Data): Stmt {
  return X.matcherChoice([
    X.matcher("['define (cons name args) exp]", ({ name, args, exp }) =>
      Stmts.Define(
        X.dataToString(name),
        X.dataToArray(args)
          .map(X.dataToString)
          .reduceRight((fn, name) => Exps.Fn(name, fn), matchExp(exp)),
      ),
    ),
    X.matcher("['define (cons name args) exp]", ({ name, args, exp }) =>
      Stmts.Define(
        X.dataToString(name),
        X.dataToArray(args)
          .map(X.dataToString)
          .reduceRight((fn, name) => Exps.Fn(name, fn), matchExp(exp)),
      ),
    ),
  ])(data)
}
```
