import * as X from "../data/index.ts"
import { deepEqual } from "../utils/deepEqual.ts"

export type Substitution = Record<string, X.Data>
export type MatchMode = "NormalMode" | "QuoteMode" | "QuasiquoteMode"

export function matchData(
  mode: MatchMode,
  pattern: X.Data,
  data: X.Data,
  substitution: Substitution,
): Substitution | undefined {
  return (
    matchVar(mode, pattern, data, substitution) ||
    matchBool(mode, pattern, data, substitution) ||
    matchInt(mode, pattern, data, substitution) ||
    matchFloat(mode, pattern, data, substitution) ||
    matchList(mode, pattern, data, substitution) ||
    matchQuote(mode, pattern, data, substitution)
  )
}

function matchVar(
  mode: MatchMode,
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
  mode: MatchMode,
  pattern: X.Data,
  data: X.Data,
  substitution: Substitution,
): Substitution | undefined {
  if (pattern.kind === "Bool") {
    if (!deepEqual(pattern.content, data.content)) return

    return matchAttributes(
      mode,
      pattern.attributes,
      data.attributes,
      substitution,
    )
  }
}

function matchInt(
  mode: MatchMode,
  pattern: X.Data,
  data: X.Data,
  substitution: Substitution,
): Substitution | undefined {
  if (pattern.kind === "Int") {
    if (!deepEqual(pattern.content, data.content)) return

    return matchAttributes(
      mode,
      pattern.attributes,
      data.attributes,
      substitution,
    )
  }
}

function matchFloat(
  mode: MatchMode,
  pattern: X.Data,
  data: X.Data,
  substitution: Substitution,
): Substitution | undefined {
  if (pattern.kind === "Float") {
    if (!deepEqual(pattern.content, data.content)) return

    return matchAttributes(
      mode,
      pattern.attributes,
      data.attributes,
      substitution,
    )
  }
}

function matchAttributes(
  mode: MatchMode,
  patternAttributes: X.Attributes,
  dataAttributes: X.Attributes,
  substitution: Substitution,
): Substitution | undefined {
  for (const key of Object.keys(patternAttributes)) {
    const pattern = patternAttributes[key]
    const data = dataAttributes[key]
    if (!data) return
    const newSubstitution = matchData(mode, pattern, data, substitution)
    if (!newSubstitution) return

    substitution = newSubstitution
  }

  return substitution
}

function matchList(
  mode: MatchMode,
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
        mode,
        elementPattern,
        elementData,
        substitution,
      )
      if (!newSubstitution) return

      substitution = newSubstitution
    }

    return matchAttributes(
      mode,
      pattern.attributes,
      data.attributes,
      substitution,
    )
  }
}

function matchQuote(
  mode: MatchMode,
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

    // const newSubstitution = matchData(mode, firstData, data, substitution)
    // if (!newSubstitution) return

    // substitution = newSubstitution

    return matchAttributes(
      mode,
      { ...firstData.attributes, ...pattern.attributes },
      data.attributes,
      substitution,
    )
  }
}
