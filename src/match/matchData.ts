import * as X from "../data/index.ts"
import { deepEqual } from "../utils/deepEqual.ts"

export type Substitution = Record<string, X.Data>

export function matchData(
  pattern: X.Data,
  data: X.Data,
  substitution: Substitution,
): Substitution | undefined {
  return (
    matchVar(pattern, data, substitution) ||
    matchBool(pattern, data, substitution) ||
    matchInt(pattern, data, substitution) ||
    matchFloat(pattern, data, substitution)
  )
}

function matchVar(
  pattern: X.Data,
  data: X.Data,
  substitution: Substitution,
): Substitution | undefined {
  if (pattern.kind === "String") {
    return { ...substitution, [pattern.content]: data }
  }
}

function matchBool(
  pattern: X.Data,
  data: X.Data,
  substitution: Substitution,
): Substitution | undefined {
  if (pattern.kind === "Bool") {
    if (!deepEqual(pattern.content, data.content)) return
    return matchAttributes(pattern.attributes, data.attributes, substitution)
  }
}

function matchInt(
  pattern: X.Data,
  data: X.Data,
  substitution: Substitution,
): Substitution | undefined {
  if (pattern.kind === "Int") {
    if (!deepEqual(pattern.content, data.content)) return
    return matchAttributes(pattern.attributes, data.attributes, substitution)
  }
}

function matchFloat(
  pattern: X.Data,
  data: X.Data,
  substitution: Substitution,
): Substitution | undefined {
  if (pattern.kind === "Float") {
    if (!deepEqual(pattern.content, data.content)) return
    return matchAttributes(pattern.attributes, data.attributes, substitution)
  }
}

function matchAttributes(
  patternAttributes: X.Attributes,
  dataAttributes: X.Attributes,
  substitution: Substitution,
): Substitution | undefined {
  for (const key of Object.keys(patternAttributes)) {
    const pattern = patternAttributes[key]
    const data = dataAttributes[key]
    const newSubstitution = matchData(pattern, data, substitution)
    if (!newSubstitution) return undefined

    substitution = newSubstitution
  }

  return substitution
}
