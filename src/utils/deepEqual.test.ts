import assert from "node:assert"
import { test } from "node:test"
import { deepEqual } from "./deepEqual.ts"

test("equal -- set in array", () => {
  const x = [1, 2, new Set([1, 2, [1, 2, 3]])]
  const y = [1, 2, new Set([1, 2, [1, 2, 3]])]
  assert(deepEqual(x, y))
})

test("equal -- map", () => {
  const x = new Map().set("a", "a").set("b", "b").set("c", "c")
  const y = new Map().set("c", "c").set("b", "b").set("a", "a")
  assert(deepEqual(x, y))
})

test("equal -- object in array in set", () => {
  const x = [1, { x: "x", y: "y" }, new Set([1, 2, [1, 2, { x: "x", y: "y" }]])]
  const y = [1, { x: "x", y: "y" }, new Set([1, 2, [1, 2, { x: "x", y: "y" }]])]
  assert(deepEqual(x, y))
})

test("equal -- function", () => {
  function f(x: number): string {
    return `x: ${x}`
  }

  const x = [f, { x: "x", y: "y" }, new Set([1, 2, [1, 2, { x: "x", y: "y" }]])]
  const y = [f, { x: "x", y: "y" }, new Set([1, 2, [1, 2, { x: "x", y: "y" }]])]
  assert(deepEqual(x, y))
})

test("equal -- closure fail", () => {
  function f(x: number): (y: number) => string {
    return (y: number) => `x: ${x}, y: ${y}`
  }

  const x = f(1)
  const y = f(1)
  assert(!deepEqual(x, y))
})
