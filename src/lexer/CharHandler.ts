import { InternalError, ParsingError } from "../errors/index.ts"
import { positionForwardChar } from "../span/index.ts"
import { type TokenKind } from "../token/index.ts"
import { Lexer } from "./Lexer.ts"

export function useCharHandlers(lexer: Lexer): Array<CharHandler> {
  return [
    // The order matters, we must
    //   try `NumberHandler` before `SymbolHandler`.
    new SpaceHandler(lexer),
    new QuoteHandler(lexer),
    new BracketStartHandler(lexer),
    new BracketEndHandler(lexer),
    new CommentHandler(lexer),
    new StringHandler(lexer),
    new NumberHandler(lexer),
    new SymbolHandler(lexer),
  ]
}

export abstract class CharHandler {
  lexer: Lexer

  constructor(lexer: Lexer) {
    this.lexer = lexer
  }

  abstract kind: TokenKind | undefined

  abstract canHandle(char: string): boolean
  abstract handle(char: string): string
}

class SpaceHandler extends CharHandler {
  kind = undefined

  canHandle(char: string): boolean {
    return char.trim() === ""
  }

  handle(char: string): string {
    let value = char
    this.lexer.forward(1)
    while (this.lexer.char !== undefined && this.lexer.char.trim() === "") {
      value += this.lexer.char
      this.lexer.forward(1)
    }

    return value
  }
}

class BracketStartHandler extends CharHandler {
  kind = "BracketStart" as const

  canHandle(char: string): boolean {
    return this.lexer.config.brackets.map(({ start }) => start).includes(char)
  }

  handle(char: string): string {
    this.lexer.forward(1)
    return char
  }
}

class BracketEndHandler extends CharHandler {
  kind = "BracketEnd" as const

  canHandle(char: string): boolean {
    return this.lexer.config.brackets.map(({ end }) => end).includes(char)
  }

  handle(char: string): string {
    this.lexer.forward(1)
    return char
  }
}

class QuoteHandler extends CharHandler {
  kind = "Quote" as const

  canHandle(char: string): boolean {
    return this.lexer.config.quotes.map(({ mark }) => mark).includes(char)
  }

  handle(char: string): string {
    this.lexer.forward(1)
    return char
  }
}

class CommentHandler extends CharHandler {
  kind = undefined

  canHandle(char: string): boolean {
    const text = char + this.lexer.rest
    return this.lexer.config.comments.some((prefix) => text.startsWith(prefix))
  }

  handle(char: string): string {
    let value = char
    this.lexer.forward(1)
    while (this.lexer.char !== undefined && this.lexer.char !== "\n") {
      value += this.lexer.char
      this.lexer.forward(1)
    }

    return value
  }
}

class StringHandler extends CharHandler {
  kind = "String" as const

  canHandle(char: string): boolean {
    return char === '"'
  }

  handle(char: string): string {
    const text = this.lexer.rest.split("\n")[0] || ""
    let index = 2 // over first `"` and the folloing char.
    while (index <= text.length) {
      const head = text.slice(0, index)
      const str = this.tryToParseString(head)
      if (str === undefined) {
        index++
      } else {
        this.lexer.forward(index)
        return head
      }
    }

    const start = this.lexer.position
    const end = positionForwardChar(start, '"')
    throw new ParsingError(`Fail to parse JSON string: ${text}`, {
      span: { start, end },
      text: this.lexer.text,
      url: this.lexer.url,
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

  canHandle(char: string): boolean {
    const text = this.lexer.rest.split("\n")[0] || ""
    return this.lastSuccessAt(text) !== undefined
  }

  handle(char: string): string {
    const text = this.lexer.rest.split("\n")[0] || ""
    const index = this.lastSuccessAt(text)
    if (index === undefined) {
      throw new InternalError(`Expect to find lastSuccessAt in text: ${text}`)
    }

    this.lexer.forward(index)
    return text.slice(0, index)
  }

  private lastSuccessAt(text: string): number | undefined {
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
          this.lexer.config.isMark(text[index]))
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

  canHandle(char: string): boolean {
    return true
  }

  handle(char: string): string {
    let value = char
    this.lexer.forward(1)
    while (
      this.lexer.char !== undefined &&
      this.lexer.char.trim() !== "" &&
      !this.lexer.config.marks.includes(this.lexer.char)
    ) {
      value += this.lexer.char
      this.lexer.forward(1)
    }

    return value
  }
}
