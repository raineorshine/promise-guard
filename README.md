# guard-promise
[![npm version](https://img.shields.io/npm/v/guard-promise.svg)](https://npmjs.org/package/guard-promise) 
[![Build Status](https://travis-ci.org/metaraine/guard-promise.svg?branch=master)](https://travis-ci.org/metaraine/guard-promise)

> Guard a promise against rejections


## Install

```sh
$ npm install --save guard-promise
```


## Usage

`guardPromise(<promise>, <map>, <filter>)`

- returns a promise which resolves to the same value as a given resolved `<promise>`, or resolves to `map(error)` if `filter(error)` returns true for a given rejected `<promise>`
- <filter> defaults to `function() { return true }`
- <map> defaults to `function(x) { return x }`

```js
var guardPromise = require('guard-promise')

// resolves to 'hi'
guardPromise(
  Promise.reject({ statusCode: 404, default: 'hi' }),
  function(error) { return error.default },
  function(error) { return error.statusCode === 404 }
)

// resolve any rejected promise to null
guardPromise(
  Promise.reject('blah'}),
  function() { return null }
)
```

`guardPromise.all` is shorthand for:

```js
Promise.all(<promises>.map(function(p, i) { 
	return guardPromise(p, <map>, <filter>, i) 
})
```

```js
// resolves to [1,2,null]
guardPromise.all(
	[Promise.resolve(1), Promise.resolve(2), Promise.reject(3)]
	function(error, i) { return null }
)
```

`guardPromise.props` works similarly for objects of promises:

```js
// resolves to { a:1, b:2 }
guardPromise.all(
	{ a: Promise.resolve(1), b: Promise.reject(3) },
	function(error, key) { return null }
)
```


## License

ISC © [Raine Lourie](https://github.com/metaraine)
