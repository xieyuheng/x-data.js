`Token` rename `Quote` kind to `QuotationMark`

`Token` -- `DoubleQoutedString` -- value should be parsed string
`Token` -- `Keyword` -- value should be parsed string

[lexer] `Lexer` -- `StringKeywordConsumer` -- support `:"hello world"`
[lexer] `Lexer` -- test string keyword
[match] `matchData` -- test literal string
