[pretty] `renderSexp` -- "short target" heuristic -- for `if` `and` `or` `->` `*->`

[pretty] `flex` and `wrap` be part of ppml

- [bug] `flexWrap` does not really wrap well -- using `group` is not enough
  - x-lisp/examples/langs/blackjack/blackjack.lisp

[pretty] put every attributes after the first elements

- [bug] the position of attributes relative to elements, is lost
  - x-lisp/examples/xml/bookstore.snapshot.lisp

# to be a formatter

[ppml] support `hardbreak` -- for line comment
[lexer] `EmptyLine` as `Token` -- for formatter
[parser] parse `EmptyLine` as `(@empty-line)`
[lexer] `Comment` as `Token` -- for formatter
[parser] `parseSexpWithComment`
[parser] parse `Comment` as `(@line-comment <comment-content>)`
