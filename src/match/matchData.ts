import * as X from "../data/index.ts"
import { deepEqual } from "../utils/deepEqual.ts"

export type Subst = Record<string, X.Data>
export type Mode = "NormalMode" | "QuoteMode" | "QuasiquoteMode"
export type Effect = (subst: Subst) => Subst | void

export function effectChoice(effects: Array<Effect>): Effect {
  return (subst) => {
    for (const effect of effects) {
      const newSubst = effect(subst)
      if (newSubst) return newSubst
    }
  }
}

export function effectSequence(effects: Array<Effect>): Effect {
  return (subst) => {
    for (const effect of effects) {
      const newSubst = effect(subst)
      if (!newSubst) return
      subst = newSubst
    }

    return subst
  }
}

export function ifEffect(p: boolean): Effect {
  return (subst) => {
    if (p) return subst
  }
}

export function lazyEffect(f: () => Effect): Effect {
  return (subst) => f()(subst)
}

export function guardEffect(p: boolean, f: () => Effect): Effect {
  return effectSequence([ifEffect(p), lazyEffect(f)])
}

export function failEffect(): Effect {
  return ifEffect(false)
}

export function matchData(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return effectChoice([
    matchString(mode, pattern, data),
    matchBool(mode, pattern, data),
    matchInt(mode, pattern, data),
    matchFloat(mode, pattern, data),
    matchList(mode, pattern, data),
  ])
}

function matchString(mode: Mode, pattern: X.Data, data: X.Data): Effect {
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
        return effectSequence([
          ifEffect(pattern.kind === "String"),
          ifEffect(deepEqual(pattern.content, data.content)),
          matchAttributes(mode, pattern.attributes, data.attributes),
        ])(subst)
      }
    }
  }
}

function matchBool(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return effectSequence([
    ifEffect(pattern.kind === "Bool"),
    ifEffect(deepEqual(pattern.content, data.content)),
    matchAttributes(mode, pattern.attributes, data.attributes),
  ])
}

function matchInt(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return effectSequence([
    ifEffect(pattern.kind === "Int"),
    ifEffect(deepEqual(pattern.content, data.content)),
    matchAttributes(mode, pattern.attributes, data.attributes),
  ])
}

function matchFloat(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return effectSequence([
    ifEffect(pattern.kind === "Float"),
    ifEffect(deepEqual(pattern.content, data.content)),
    matchAttributes(mode, pattern.attributes, data.attributes),
  ])
}

function matchAttributes(
  mode: Mode,
  patternAttributes: X.Attributes,
  dataAttributes: X.Attributes,
): Effect {
  return effectSequence(
    Object.keys(patternAttributes).map((key) =>
      guardEffect(Boolean(dataAttributes[key]), () =>
        matchData(mode, patternAttributes[key], dataAttributes[key]),
      ),
    ),
  )
}

function matchList(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  if (mode === "NormalMode") {
    return effectChoice([
      matchMakeList(mode, pattern, data),
      matchQuote(mode, pattern, data),
    ])
  }

  if (mode === "QuoteMode") {
    return guardEffect(
      pattern.kind === "List" &&
        data.kind === "List" &&
        pattern.content.length === data.content.length,
      () =>
        effectSequence([
          ...(pattern as X.List).content
            .keys()
            .map((index) =>
              matchData(
                mode,
                (pattern as X.List).content[index],
                (data as X.List).content[index],
              ),
            ),

          matchAttributes(mode, pattern.attributes, data.attributes),
        ]),
    )
  }

  return failEffect()
}

function matchMakeList(mode: Mode, pattern: X.Data, data: X.Data): Effect {
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

function matchQuote(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return guardEffect(
    pattern.kind === "List" &&
      pattern.content.length >= 2 &&
      pattern.content[0].kind === "String" &&
      pattern.content[0].content === "quote",
    () => {
      const firstData = (pattern as X.List).content[1]
      return effectSequence([
        matchData("QuoteMode", firstData, data),
        matchAttributes(mode, pattern.attributes, data.attributes),
        matchAttributes("QuoteMode", firstData.attributes, data.attributes),
      ])
    },
  )
}
