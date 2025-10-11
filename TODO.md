[pretty] `renderTael` -- handle pure record
[pretty] `renderQuote` -- parser level syntax sugar
[pretty] `renderUnquote` -- parser level syntax sugar
[pretty] `renderQuasiquote` -- parser level syntax sugar

[pretty] `renderSexp` -- function application with "short target" heuristic

[ppml] support `hardbreak`

[lexer] empty line as `Token` -- for formatter

- be like XML parser which include all information

[lexer] `Comment` as `Token` -- for formatter
[parser] `parseSexpWithComment`
[parser] parse `Comment` as `(@line-comment "<comment-line>")`
