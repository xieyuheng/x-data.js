# x-data.js

An extension to [S-expression](https://en.wikipedia.org/wiki/S-expression)
to support list with attributes.

For example, we can represent the following JSON:

```json
{ "oranges": 2, "apples": 6, "pears": 5 }
```

as:

```scheme
[:oranges 2 :apples 6 :pears 5]
```

Quoted list:

```scheme
'(lambda (x) x)
```

evaluates to:

```scheme
['lambda ['x] 'x]
```

## Install

```sh
npm install @xieyuheng/x-data.js
```

## Examples

- [src/examples/lambda.test.ts](src/examples/lambda.test.ts):
- [src/examples/tau.test.ts](src/examples/tau.test.ts):

## Development

```sh
npm install
npm run build
npm run test
```

## References

- [Some Thoughts on JSON vs S-expressions](https://eli.thegreenplace.net/2012/03/04/some-thoughts-on-json-vs-s-expressions), by Eli Bendersky, 2012.
- [with-meta in clojure.core](https://clojuredocs.org/clojure.core/with-meta)

## License

[GPLv3](LICENSE)
