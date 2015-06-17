# catch-some
[![npm version](https://img.shields.io/npm/v/catch-some.svg)](https://npmjs.org/package/catch-some)
[![Build Status](https://travis-ci.org/metaraine/catch-some.svg?branch=master)](https://travis-ci.org/metaraine/catch-some)

> Catch *some* Promise rejections


## Install

```sh
$ npm install --save catch-some
```


## Usage

`catchSome(<promises>, <map>, <filter>)`

Given an array or object of promises, attemps to resolve them to an array or object of the resolved values. Converts rejected promises for which `filter(error)` is true, to resolved values of `map(error)`. Returns a rejected promise if any rejection does not pass the filter.

- `<map>` defaults to `function(x) { return x }`
- `<filter>` defaults to `function() { return true }`

```js
var catchSome = require('catch-some')

// resolves to ['a', 'z']
catchSome(
  [Promise.resolve('a'), Promise.reject('b')],
  function(error, i) { return 'z' },
  function(error, i) { return error === 'b' }
)

// rejects to 'c'
catchSome(
  [Promise.resolve('a'), Promise.reject('b'), Promise.reject('c')],
  function(error, i) { return 'z' },
  function(error, i) { return error === 'b' }
)

// resolves to [1,2,3]
catchSome([Promise.resolve(1), Promise.resolve(2), Promise.reject(3)])

// resolves to { a:1, b:null }
catchSome(
	{ a: Promise.resolve(1), b: Promise.reject('error') },
	function(error, key) { return null }
)
```


## License

ISC © [Raine Lourie](https://github.com/metaraine)
