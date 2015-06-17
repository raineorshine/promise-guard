# guard-promise
[![npm version](https://img.shields.io/npm/v/guard-promise.svg)](https://npmjs.org/package/guard-promise) 
[![waffle.io issues](https://badge.waffle.io/metaraine/guard-promise.png?label=ready&title=waffle.io)](https://waffle.io/metaraine/guard-promise) 
[![Build Status](https://travis-ci.org/metaraine/guard-promise.svg?branch=master)](https://travis-ci.org/metaraine/guard-promise)

> Convert a promise to one that guards against certain rejections


## Install

```sh
$ npm install --save guard-promise
```


## Usage

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


## License

ISC © [Raine Lourie](https://github.com/metaraine)
