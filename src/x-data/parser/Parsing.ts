import { InternalError, ParsingError } from "../errors/index.ts"
import { Parser } from "../parser/index.ts"
import { Position } from "../position/index.ts"
import * as X from "../../x-data/index.ts"
import { type Data } from "../../x-data/index.ts"
import { Span } from "../span/index.ts"
import { Token } from "../token/index.ts"

type Result = { data: Data; remain: Array<Token> }

export class Parsing {
  index = 0

  constructor(public parser: Parser) {}

  parse(tokens: Array<Token>): Result {
    throw new Error("TODO");
  }
}
