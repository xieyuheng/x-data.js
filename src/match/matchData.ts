import * as X from "../data/index.ts"

export type Subst = Record<string, X.Data>
export type Mode = "NormalMode" | "QuoteMode" | "QuasiquoteMode"
export type Effect = (subst: Subst) => Subst | void

export function matchData(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return choiceEffect([
    matchString(mode, pattern, data),
    matchBool(mode, pattern, data),
    matchInt(mode, pattern, data),
    matchFloat(mode, pattern, data),
    matchList(mode, pattern, data),
  ])
}

function matchString(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  switch (mode) {
    case "NormalMode": {
      return ifEffect(pattern.kind === "String", ({ subst }) => {
        const key = X.asString(pattern).content
        const foundData = subst[key]
        return (subst) => {
          if (foundData) {
            return guardEffect(() => X.dataEqual(foundData, data))(subst)
          } else {
            return { ...subst, [key]: data }
          }
        }
      })
    }

    case "QuoteMode":
    case "QuasiquoteMode": {
      return sequenceEffect([
        guardEffect(() => pattern.kind === "String"),
        guardEffect(() => pattern.content === data.content),
      ])
    }
  }
}

function matchBool(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return sequenceEffect([
    guardEffect(() => pattern.kind === "Bool"),
    guardEffect(() => pattern.content === data.content),
  ])
}

function matchInt(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return sequenceEffect([
    guardEffect(() => pattern.kind === "Int"),
    guardEffect(() => pattern.content === data.content),
  ])
}

function matchFloat(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return sequenceEffect([
    guardEffect(() => pattern.kind === "Float"),
    guardEffect(() => pattern.content === data.content),
  ])
}

function matchAttributes(
  mode: Mode,
  patternAttributes: X.Attributes,
  dataAttributes: X.Attributes,
): Effect {
  return sequenceEffect(
    Object.keys(patternAttributes).map((key) =>
      ifEffect(Boolean(dataAttributes[key]), () =>
        matchData(mode, patternAttributes[key], dataAttributes[key]),
      ),
    ),
  )
}

function matchList(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  switch (mode) {
    case "NormalMode": {
      return choiceEffect([
        matchTael(mode, pattern, data),
        matchQuote(mode, pattern, data),
        matchQuasiquote(mode, pattern, data),
        matchCons(mode, pattern, data),
        matchConsStar(mode, pattern, data),
      ])
    }

    case "QuoteMode": {
      return matchQuotedList(mode, pattern, data)
    }

    case "QuasiquoteMode": {
      return choiceEffect([
        matchUnquote(mode, pattern, data),
        matchQuotedList(mode, pattern, data),
      ])
    }
  }
}

function matchManyData(
  mode: Mode,
  patternArray: Array<X.Data>,
  dataArray: Array<X.Data>,
): Effect {
  return sequenceEffect([
    guardEffect(() => patternArray.length === dataArray.length),
    ...patternArray
      .keys()
      .map((index) => matchData(mode, patternArray[index], dataArray[index])),
  ])
}

function matchQuotedList(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return ifEffect(
    pattern.kind === "Tael" &&
      data.kind === "Tael" &&
      pattern.content.length === data.content.length,
    () =>
      sequenceEffect([
        matchManyData(mode, X.asTael(pattern).content, X.asTael(data).content),
        matchAttributes(
          mode,
          X.asTael(pattern).attributes,
          X.asTael(data).attributes,
        ),
      ]),
  )
}

function matchUnquote(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return ifEffect(
    pattern.kind === "Tael" &&
      pattern.content.length >= 2 &&
      pattern.content[0].kind === "String" &&
      pattern.content[0].content === "unquote",
    () => {
      const firstData = X.asTael(pattern).content[1]
      return sequenceEffect([matchData("NormalMode", firstData, data)])
    },
  )
}

function matchTael(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return ifEffect(
    pattern.kind === "Tael" &&
      data.kind === "Tael" &&
      pattern.content.length >= 1 &&
      pattern.content[0].kind === "String" &&
      pattern.content[0].content === "tael",
    () => {
      const patternBody = X.asTael(pattern).content.slice(1)
      const dataBody = X.asTael(data).content
      return sequenceEffect([
        guardEffect(() => patternBody.length === dataBody.length),
        ...patternBody
          .keys()
          .map((index) => matchData(mode, patternBody[index], dataBody[index])),
        matchAttributes(
          mode,
          X.asTael(pattern).attributes,
          X.asTael(data).attributes,
        ),
      ])
    },
  )
}

function matchQuote(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return ifEffect(
    pattern.kind === "Tael" &&
      pattern.content.length >= 2 &&
      pattern.content[0].kind === "String" &&
      pattern.content[0].content === "quote",
    () => {
      const firstData = X.asTael(pattern).content[1]
      return sequenceEffect([matchData("QuoteMode", firstData, data)])
    },
  )
}

function matchQuasiquote(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return ifEffect(
    pattern.kind === "Tael" &&
      pattern.content.length >= 2 &&
      pattern.content[0].kind === "String" &&
      pattern.content[0].content === "quasiquote",
    () => {
      const firstData = X.asTael(pattern).content[1]
      return sequenceEffect([matchData("QuasiquoteMode", firstData, data)])
    },
  )
}

function matchCons(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return ifEffect(
    pattern.kind === "Tael" &&
      data.kind === "Tael" &&
      pattern.content.length === 3 &&
      pattern.content[0].kind === "String" &&
      pattern.content[0].content === "cons",
    () => {
      const listPattern = X.asTael(pattern)
      const headPattern = listPattern.content[1]
      const tailPattern = listPattern.content[2]

      const listData = X.asTael(data)
      if (listData.content.length === 0) return failEffect()
      const headData = listData.content[0]
      const tailData = X.Tael(listData.content.slice(1), {})

      return sequenceEffect([
        matchData(mode, headPattern, headData),
        matchData(mode, tailPattern, tailData),
      ])
    },
  )
}

function matchConsStar(mode: Mode, pattern: X.Data, data: X.Data): Effect {
  return ifEffect(
    pattern.kind === "Tael" &&
      data.kind === "Tael" &&
      pattern.content.length >= 3 &&
      pattern.content[0].kind === "String" &&
      pattern.content[0].content === "cons*",
    () => {
      const listPattern = X.asTael(pattern)
      const prefixCount = listPattern.content.length - 2
      const patternPrefix = listPattern.content.slice(1, prefixCount + 1)
      const tailPattern = listPattern.content[listPattern.content.length - 1]

      const listData = X.asTael(data)
      if (listData.content.length < prefixCount) return failEffect()
      const dataPrefix = listData.content.slice(0, prefixCount)
      const tailData = X.Tael(listData.content.slice(prefixCount), {})

      return sequenceEffect([
        matchManyData(mode, patternPrefix, dataPrefix),
        matchData(mode, tailPattern, tailData),
      ])
    },
  )
}

// effect combinators

function choiceEffect(effects: Array<Effect>): Effect {
  return (subst) => {
    for (const effect of effects) {
      const newSubst = effect(subst)
      if (newSubst) return newSubst
    }
  }
}

function sequenceEffect(effects: Array<Effect>): Effect {
  return (subst) => {
    for (const effect of effects) {
      const newSubst = effect(subst)
      if (!newSubst) return
      subst = newSubst
    }

    return subst
  }
}

function guardEffect(p: () => boolean): Effect {
  return (subst) => {
    if (p()) return subst
  }
}

function ifEffect(
  p: boolean,
  f: (options: { subst: Subst }) => Effect,
): Effect {
  return sequenceEffect([guardEffect(() => p), (subst) => f({ subst })(subst)])
}

function failEffect(): Effect {
  return guardEffect(() => false)
}
