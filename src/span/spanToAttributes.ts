import { dataFromJson, type Attributes } from "../data/index.ts"
import { type Span } from "./index.ts"

export function spanToAttributes(span: Span): Attributes {
  return dataFromJson(span).attributes
}
