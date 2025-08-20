[lexer] inline `Lexing` to `Lexer`
[lexer] `Lexer` be stateful -- be able to `lex` `text` little by little
[parser] `Parser` be stateful -- be able to `parse` `text` little by little

[repl] `Repl` -- has `commitedTokens`
[repl] `Repl` -- has `currentTokens`
[repl] `replStart` -- handle `line` event of readline
