[pretty] `renderSexp` -- "short target" heuristic -- for `if` `and` `or` `->` `*->`

[bug] `flexWrap` does not really wrap well -- using `group` is not enough

- x-lisp/examples/langs/blackjack/blackjack.lisp
- `flex` and `wrap` be part of ppml

[bug] the position of attributes relative to elements, is lost

- x-lisp/examples/xml/bookstore.snapshot.lisp
- put every attributes after the first elements

# to be a formatter

[ppml] support `hardbreak`

[lexer] `Blank` as `Token` -- for formatter

- be like XML parser which include all information

[parser] parse `EmptyLine` as `(@blank <line-count>)`

[lexer] `Comment` as `Token` -- for formatter
[parser] `parseSexpWithComment`
[parser] parse `Comment` as `(@line-comment <comment-content>)`
