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

- filter defaults to function() { return true }`
- map defaults: `function(x) { return x }`

```js
var guardPromise = require('guard-promise')

// resolves to 'hi'
guardPromise(
  Promise.reject({ statusCode: 404, default: 'hi' }),
  function(reason) { return reason.default },
  function(reason) { return reason.statusCode === 404 }
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
	function(reason, i) { return null }
)
```

`guardPromise.props` works similarly for objects of promises:

```js
// resolves to { a:1, b:2 }
guardPromise.all(
	{ a: Promise.resolve(1), b: Promise.reject(3) },
	function(reason, key) { return null }
)
```


## License

ISC © [Raine Lourie](https://github.com/metaraine)
