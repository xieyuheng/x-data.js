#!/usr/bin/env sh

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js format --debug=true"

find examples -name "*.lisp" | $parallel $bin {} ">" {}.fmt
