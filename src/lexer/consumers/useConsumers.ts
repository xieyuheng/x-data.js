import { type Consumer } from "../Consumer.ts"
import { BracketEndConsumer } from "./BracketEndConsumer.ts"
import { BracketStartConsumer } from "./BracketStartConsumer.ts"
import { CommentConsumer } from "./CommentConsumer.ts"
import { KeywordConsumer } from "./KeywordConsumer.ts"
import { NumberConsumer } from "./NumberConsumer.ts"
import { QuoteConsumer } from "./QuoteConsumer.ts"
import { SpaceConsumer } from "./SpaceConsumer.ts"
import { StringConsumer } from "./StringConsumer.ts"
import { StringKeywordConsumer } from "./StringKeywordConsumer.ts"
import { SymbolConsumer } from "./SymbolConsumer.ts"

export function useConsumers(): Array<Consumer> {
  return [
    // The order matters.
    new SpaceConsumer(),
    new QuoteConsumer(),
    new BracketStartConsumer(),
    new BracketEndConsumer(),
    new CommentConsumer(),
    new StringKeywordConsumer(),
    new StringConsumer(),
    new NumberConsumer(),
    new KeywordConsumer(),
    new SymbolConsumer(),
  ]
}
