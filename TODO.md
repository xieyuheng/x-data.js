[pretty] `prettySexp` -- setup
[pretty] `prettySexp` -- can be config-ed by keyword lists -- like emacs scheme-mode

[pretty] `PrettyCommand` -- setup and call `prettySexp`
[pretty] `PrettyCommand` -- read config from a tael lisp file

[ppml] support `hardbreak`

[lexer] `Comment` should be token
[parser] `parseSexpWithComment`
[parser] parse `Comment` as `(@line-comment "<comment-line>")`
