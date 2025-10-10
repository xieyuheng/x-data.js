[pretty] `prettySexp` -- setup
[pretty] `prettySexp` -- all `()` as function application
[pretty] `prettySexp` -- can be config-ed by keyword lists -- like emacs scheme-mode
[pretty] `prettySexp` -- function application with "short target" heuristic

[pretty] `PrettyCommand` -- setup and call `prettySexp`
[pretty] `PrettyCommand` -- read config from a tael lisp file

[ppml] support `hardbreak`

[lexer] `Comment` should be token
[parser] `parseSexpWithComment`
[parser] parse `Comment` as `(@line-comment "<comment-line>")`
