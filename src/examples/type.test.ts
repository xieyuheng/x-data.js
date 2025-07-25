// import assert from "node:assert"
// import { test } from "node:test"
// import {
//   dataToString,
//   match,
//   matcher,
//   matcherChoice,
//   parseData,
//   type Matcher,
// } from "../index.ts"
// import * as X from "../index.ts"

// export type Type =
//   | TypeVar
//   | Arrow
//   | Union
//   | Inter
//   | Tau

// export type TypeVar = { kind: "TypeVar"; name: string }
// export type Arrow = { kind: "Arrow"; argType: Type; retType: Type }
// export type Union = { kind: "Union"; candidateTypes: Array<Type> }
// export type Inter = { kind: "Inter"; aspectTypes: Array<Type> }
// export type Tau = {
//   kind: "Tau"
//   elementTypes: Array<Type>
//   attrTypes: Record<string, Type>
//   restType?: Type
// }

// function matchType(data: X.Data): Type {
//   return X.match(typeMatcher, data)
// }

// const typeMatcher: X.Matcher<Type> = X.matcherChoice<Type>([
//   X.matcher("'anything-t", () => Types.AnythingType()),
//   X.matcher("'nothing-t", () => Types.NothingType()),
//   X.matcher("'bool-t", () => Types.BoolType()),
//   X.matcher("'string-t", () => Types.StringType()),
//   X.matcher("'int-t", () => Types.IntType()),
//   X.matcher("'float-t", () => Types.FloatType()),

//   X.matcher("(cons '-> types)", ({ types }) =>
//     X.dataToArray(types)
//       .map(matchType)
//       .reduceRight((retType, argType) => Types.Arrow(argType, retType)),
//   ),

//   X.matcher("(cons 'union types)", ({ types }) =>
//     Types.Union(X.dataToArray(types).map(matchType)),
//   ),

//   X.matcher("(cons 'inter types)", ({ types }) =>
//     Types.Inter(X.dataToArray(types).map(matchType)),
//   ),

//   X.matcher("(cons 'tau types)", ({ types }) =>
//     Types.Tau(X.dataToArray(types).map(matchType), {}),
//   ),

//   X.matcher("name", ({ name }) => Types.TypeVar(X.dataToString(name))),
// ])

// function assertParse(text: string, exp: Exp): void {
//   assert.deepStrictEqual(match(expMatcher, parseData(text)), exp)
// }

// test("lambda", () => {
//   assertParse("x", {
//     kind: "Var",
//     name: "x",
//   })

//   assertParse("(f x)", {
//     kind: "Apply",
//     target: { kind: "Var", name: "f" },
//     arg: { kind: "Var", name: "x" },
//   })

//   assertParse("(lambda (x) x)", {
//     kind: "Lambda",
//     name: "x",
//     ret: { kind: "Var", name: "x" },
//   })

//   assertParse("((lambda (x) x) (lambda (x) x))", {
//     kind: "Apply",
//     target: { kind: "Lambda", name: "x", ret: { kind: "Var", name: "x" } },
//     arg: { kind: "Lambda", name: "x", ret: { kind: "Var", name: "x" } },
//   })

//   assertParse("(let ((id (lambda (x) x))) (id id))", {
//     kind: "Let",
//     name: "id",
//     rhs: { kind: "Lambda", name: "x", ret: { kind: "Var", name: "x" } },
//     body: {
//       kind: "Apply",
//       target: { kind: "Var", name: "id" },
//       arg: { kind: "Var", name: "id" },
//     },
//   })
// })
