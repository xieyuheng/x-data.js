# x-data.js

A extension to [S-expression](https://en.wikipedia.org/wiki/S-expression)
to support list with attributes.

For example, we can represent the following JSON:

```json
{ "oranges": 2, "apples": 6, "pears": 5 }
```

as x-data:

```lisp
[:oranges 2 :apples 6 :pears 5]
```

Quoted list:

```lisp
'(lambda (x) x)
```

evaluates to array:

```lisp
['lambda ['x] 'x]
```

This is useful for writing interpreter in lisp
with good support for error reporting,
because `(lambda (x) x)` can be parsed into list with attributes:

```lisp
['lambda ['x] 'x :row 0 :colum 0]
```

## Development

```sh
npm install     # Install dependencies
npm run build   # Compile `src/` to `lib/`
npm run test    # Run test
```

## References

- [Some Thoughts on JSON vs S-expressions](https://eli.thegreenplace.net/2012/03/04/some-thoughts-on-json-vs-s-expressions), by Eli Bendersky, 2012.
- [with-meta in clojure.core](https://clojuredocs.org/clojure.core/with-meta)

## Contributions

To make a contribution, fork this project and create a pull request.

Please read the [STYLE-GUIDE.md](STYLE-GUIDE.md) before you change the code.

Remember to add yourself to [AUTHORS](AUTHORS).
Your line belongs to you, you can write a little
introduction to yourself but not too long.

## License

[GPLv3](LICENSE)
