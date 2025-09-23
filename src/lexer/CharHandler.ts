import { ErrorWithMeta } from "../errors/index.ts"
import { positionForwardChar } from "../span/index.ts"
import { type TokenKind } from "../token/index.ts"
import { Lexer } from "./Lexer.ts"

export function useCharHandlers(lexer: Lexer): Array<CharHandler> {
  return [
    // The order matters,
    // we must try `NumberHandler`
    // before `SymbolHandler`.
    new SpaceHandler(),
    new QuoteHandler(),
    new BracketStartHandler(),
    new BracketEndHandler(),
    new CommentHandler(),
    new StringHandler(),
    new NumberHandler(),
    new SymbolHandler(),
  ]
}

export abstract class CharHandler {
  abstract kind: TokenKind | undefined

  abstract canHandle(lexer: Lexer): boolean
  abstract handle(lexer: Lexer): string
}

class SpaceHandler extends CharHandler {
  kind = undefined

  canHandle(lexer: Lexer): boolean {
    const char = lexer.char()
    return char.trim() === ""
  }

  handle(lexer: Lexer): string {
    const char = lexer.char()
    let value = char
    lexer.forward(1)
    while (!lexer.isEnd() && lexer.char().trim() === "") {
      value += lexer.char()
      lexer.forward(1)
    }

    return value
  }
}

class BracketStartHandler extends CharHandler {
  kind = "BracketStart" as const

  canHandle(lexer: Lexer): boolean {
    const char = lexer.char()
    return lexer.config.brackets.map(({ start }) => start).includes(char)
  }

  handle(lexer: Lexer): string {
    const char = lexer.char()
    lexer.forward(1)
    return char
  }
}

class BracketEndHandler extends CharHandler {
  kind = "BracketEnd" as const

  canHandle(lexer: Lexer): boolean {
    const char = lexer.char()
    return lexer.config.brackets.map(({ end }) => end).includes(char)
  }

  handle(lexer: Lexer): string {
    const char = lexer.char()
    lexer.forward(1)
    return char
  }
}

class QuoteHandler extends CharHandler {
  kind = "Quote" as const

  canHandle(lexer: Lexer): boolean {
    const char = lexer.char()
    return lexer.config.quotes.includes(char)
  }

  handle(lexer: Lexer): string {
    const char = lexer.char()
    lexer.forward(1)
    return char
  }
}

class CommentHandler extends CharHandler {
  kind = undefined

  canHandle(lexer: Lexer): boolean {
    const char = lexer.char()
    const text = char + lexer.rest()
    return lexer.config.comments.some((prefix) => text.startsWith(prefix))
  }

  handle(lexer: Lexer): string {
    const char = lexer.char()
    let value = char
    lexer.forward(1)
    while (!lexer.isEnd() && lexer.char() !== "\n") {
      value += lexer.char()
      lexer.forward(1)
    }

    return value
  }
}

class StringHandler extends CharHandler {
  kind = "String" as const

  canHandle(lexer: Lexer): boolean {
    const char = lexer.char()
    return char === '"'
  }

  handle(lexer: Lexer): string {
    const char = lexer.char()
    const text = lexer.rest().split("\n")[0] || ""
    let index = 2 // over first `"` and the folloing char.
    while (index <= text.length) {
      const head = text.slice(0, index)
      const str = this.tryToParseString(head)
      if (str === undefined) {
        index++
      } else {
        lexer.forward(index)
        return head
      }
    }

    const start = lexer.position
    const end = positionForwardChar(start, '"')
    let message = `Fail to parse JSON string: ${text}\n`
    throw new ErrorWithMeta(message, {
      span: { start, end },
      text: lexer.text,
      url: lexer.url,
    })
  }

  private tryToParseString(text: string): string | undefined {
    try {
      return JSON.parse(text)
    } catch (error) {
      return undefined
    }
  }
}

class NumberHandler extends CharHandler {
  kind = "Number" as const

  canHandle(lexer: Lexer): boolean {
    const char = lexer.char()
    const text = lexer.rest().split("\n")[0] || ""
    return this.lastSuccessAt(lexer, text) !== undefined
  }

  handle(lexer: Lexer): string {
    const char = lexer.char()
    const text = lexer.rest().split("\n")[0] || ""
    const index = this.lastSuccessAt(lexer, text)
    if (index === undefined) {
      let message = `Expect to find lastSuccessAt in text: ${text}\n`
      throw new Error(message)
    }

    lexer.forward(index)
    return text.slice(0, index)
  }

  private lastSuccessAt(lexer: Lexer, text: string): number | undefined {
    let index = 0
    let lastSuccessAt: number | undefined = undefined
    while (index <= text.length) {
      const head = text.slice(0, index)
      const result = this.tryToParseNumber(head)
      if (
        result !== undefined &&
        text[index - 1] !== undefined &&
        text[index - 1].trim() !== "" &&
        (text[index] === undefined ||
          text[index].trim() === "" ||
          lexer.config.isMark(text[index]))
      ) {
        lastSuccessAt = index
      }

      index++
    }

    return lastSuccessAt
  }

  private tryToParseNumber(text: string): number | undefined {
    try {
      const value = JSON.parse(text)
      if (typeof value === "number") return value
      else return undefined
    } catch (error) {
      return undefined
    }
  }
}

class SymbolHandler extends CharHandler {
  kind = "Symbol" as const

  canHandle(lexer: Lexer): boolean {
    const char = lexer.char()
    return true
  }

  handle(lexer: Lexer): string {
    const char = lexer.char()
    let value = char
    lexer.forward(1)
    while (
      !lexer.isEnd() &&
      lexer.char().trim() !== "" &&
      !lexer.config.marks.includes(lexer.char())
    ) {
      value += lexer.char()
      lexer.forward(1)
    }

    return value
  }
}
