#!/bin/bash
# for f in `find ../dist | grep [.]js$`; do npx babel --plugins @babel/plugin-transform-nullish-coalescing-operator ${f} > ${f}; done;
npx babel \
  --plugins "@babel/plugin-transform-nullish-coalescing-operator,@babel/plugin-transform-optional-chaining,@babel/plugin-proposal-optional-catch-binding" \
  "${1}" > "${1}.new"

npx terser -o "${1}.new" "${1}.new"
