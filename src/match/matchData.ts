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
    matchFloat(pattern, data, substitution) ||
    matchList(pattern, data, substitution) ||
    matchQuote(pattern, data, substitution)
  )
}

function matchVar(
  pattern: X.Data,
  data: X.Data,
  substitution: Substitution,
): Substitution | undefined {
  if (pattern.kind === "String") {
    const key = pattern.content
    const foundData = substitution[key]
    if (foundData) {
      if (!deepEqual(foundData, data)) return

      return substitution
    } else {
      return { ...substitution, [key]: data }
    }
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
    if (!data) return
    const newSubstitution = matchData(pattern, data, substitution)
    if (!newSubstitution) return

    substitution = newSubstitution
  }

  return substitution
}

function matchList(
  pattern: X.Data,
  data: X.Data,
  substitution: Substitution,
): Substitution | undefined {
  if (pattern.kind === "List" && data.kind === "List") {
    if (pattern.content.length === 0) return

    const keyword = pattern.content[0]
    if (keyword.kind !== "String") return
    if (keyword.content !== "make-list") return

    const patternBody = pattern.content.slice(1)
    if (patternBody.length !== data.content.length) return

    for (const [index, elementPattern] of patternBody.entries()) {
      const elementData = data.content[index]
      const newSubstitution = matchData(
        elementPattern,
        elementData,
        substitution,
      )
      if (!newSubstitution) return

      substitution = newSubstitution
    }

    return matchAttributes(pattern.attributes, data.attributes, substitution)
  }
}

function matchQuote(
  pattern: X.Data,
  data: X.Data,
  substitution: Substitution,
): Substitution | undefined {
  if (pattern.kind === "List") {
    if (pattern.content.length === 0) return

    const keyword = pattern.content[0]
    if (keyword.kind !== "String") return
    if (keyword.content !== "quote") return

    const firstData = pattern.content[1]
    if (!firstData) return
    if (!deepEqual(firstData.content, data.content)) return

    return matchAttributes(
      { ...firstData.attributes, ...pattern.attributes },
      data.attributes,
      substitution,
    )
  }
}
