import * as X from "../data/index.ts"
import { deepEqual } from "../utils/deepEqual.ts"

export type Subst = Record<string, X.Data>
export type MatchMode = "NormalMode" | "QuoteMode" | "QuasiquoteMode"
export type MatchEffect = (subst: Subst) => Subst | undefined

export function matchData(
  mode: MatchMode,
  pattern: X.Data,
  data: X.Data,
): MatchEffect {
  return (subst) =>
    matchVar(mode, pattern, data)(subst) ||
    matchBool(mode, pattern, data)(subst) ||
    matchInt(mode, pattern, data)(subst) ||
    matchFloat(mode, pattern, data)(subst) ||
    matchMakeList(mode, pattern, data)(subst) ||
    matchQuote(mode, pattern, data)(subst) ||
    matchList(mode, pattern, data)(subst)
}

function matchVar(mode: MatchMode, pattern: X.Data, data: X.Data): MatchEffect {
  return (subst) => {
    switch (mode) {
      case "NormalMode": {
        if (pattern.kind === "String") {
          const key = pattern.content
          const foundData = subst[key]
          if (foundData) {
            if (!deepEqual(foundData, data)) return

            return subst
          } else {
            return { ...subst, [key]: data }
          }
        }
      }

      case "QuoteMode":
      case "QuasiquoteMode": {
        return matchString(mode, pattern, data)(subst)
      }
    }
  }
}

function matchString(
  mode: MatchMode,
  pattern: X.Data,
  data: X.Data,
): MatchEffect {
  return (subst) => {
    if (pattern.kind === "String") {
      if (!deepEqual(pattern.content, data.content)) return

      return matchAttributes(mode, pattern.attributes, data.attributes)(subst)
    }
  }
}

function matchBool(
  mode: MatchMode,
  pattern: X.Data,
  data: X.Data,
): MatchEffect {
  return (subst) => {
    if (pattern.kind === "Bool") {
      if (!deepEqual(pattern.content, data.content)) return

      return matchAttributes(mode, pattern.attributes, data.attributes)(subst)
    }
  }
}

function matchInt(mode: MatchMode, pattern: X.Data, data: X.Data): MatchEffect {
  return (subst) => {
    if (pattern.kind === "Int") {
      if (!deepEqual(pattern.content, data.content)) return

      return matchAttributes(mode, pattern.attributes, data.attributes)(subst)
    }
  }
}

function matchFloat(
  mode: MatchMode,
  pattern: X.Data,
  data: X.Data,
): MatchEffect {
  return (subst) => {
    if (pattern.kind === "Float") {
      if (!deepEqual(pattern.content, data.content)) return

      return matchAttributes(mode, pattern.attributes, data.attributes)(subst)
    }
  }
}

function matchAttributes(
  mode: MatchMode,
  patternAttributes: X.Attributes,
  dataAttributes: X.Attributes,
): MatchEffect {
  return (subst) => {
    for (const key of Object.keys(patternAttributes)) {
      const pattern = patternAttributes[key]
      const data = dataAttributes[key]
      if (!data) return
      const newSubst = matchData(mode, pattern, data)(subst)
      if (!newSubst) return

      subst = newSubst
    }

    return subst
  }
}

function matchMakeList(
  mode: MatchMode,
  pattern: X.Data,
  data: X.Data,
): MatchEffect {
  return (subst) => {
    if (pattern.kind === "List" && data.kind === "List") {
      if (pattern.content.length === 0) return

      const keyword = pattern.content[0]
      if (keyword.kind !== "String") return
      if (keyword.content !== "make-list") return

      const patternBody = pattern.content.slice(1)
      if (patternBody.length !== data.content.length) return

      for (const [index, elementPattern] of patternBody.entries()) {
        const elementData = data.content[index]
        const newSubst = matchData(mode, elementPattern, elementData)(subst)
        if (!newSubst) return

        subst = newSubst
      }

      return matchAttributes(mode, pattern.attributes, data.attributes)(subst)
    }
  }
}

function matchQuote(
  mode: MatchMode,
  pattern: X.Data,
  data: X.Data,
): MatchEffect {
  return (subst) => {
    if (pattern.kind === "List") {
      if (pattern.content.length === 0) return

      const keyword = pattern.content[0]
      if (keyword.kind !== "String") return
      if (keyword.content !== "quote") return

      const firstData = pattern.content[1]
      if (!firstData) return

      {
        const newSubst = matchData("QuoteMode", firstData, data)(subst)

        if (!newSubst) return
        subst = newSubst
      }

      {
        const newSubst = matchAttributes(
          mode,
          pattern.attributes,
          data.attributes,
        )(subst)

        if (!newSubst) return
        subst = newSubst
      }

      {
        const newSubst = matchAttributes(
          "QuoteMode",
          firstData.attributes,
          data.attributes,
        )(subst)

        if (!newSubst) return
        subst = newSubst
      }

      return subst
    }
  }
}

function matchList(
  mode: MatchMode,
  pattern: X.Data,
  data: X.Data,
): MatchEffect {
  return (subst) => {
    if (mode === "QuoteMode") {
      if (pattern.kind === "List" && data.kind === "List") {
        const patternBody = pattern.content
        if (patternBody.length !== data.content.length) return

        for (const [index, elementPattern] of patternBody.entries()) {
          const elementData = data.content[index]
          const newSubst = matchData(mode, elementPattern, elementData)(subst)
          if (!newSubst) return

          subst = newSubst
        }

        return matchAttributes(mode, pattern.attributes, data.attributes)(subst)
      }
    }
  }
}
