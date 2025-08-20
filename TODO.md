`Token` has `meta` instead of just `span`
`ParsingError` has `TokenMeta` instead of `span`
`ParsingError.report` no need to take `text`
`Data`'s `meta` has optional `url` and `text`

[repl] `Repl` -- has `commitedTokens`
[repl] `Repl` -- has `currentTokens`
[repl] `replStart` -- handle `line` event of readline
