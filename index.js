var Promise = require('bluebird')
var id = function(x) { return x }

// guard a single promise
function guard(promise, map, filter, passThrough) {

  if(!promise) {
    throw new Error('No promise provided')
  }
  else if(!promise.then) {
    throw new Error('Received non-thenable')
  }

  filter = filter || id.bind(null, true)
  map = map || id

  return Promise.resolve(promise)
	  .catch(function(e) {
	  	if(filter(e, passThrough)) {
	  		return map(e, passThrough)
	  	}
	  	else {
	  		throw e
	  	}
	  })
}

// guard an array or object of promises
function promiseGuard(promises, map, filter) {

	if(Array.isArray(promises)) {
		return Promise.all(promises.map(function(promise, i) {
			return guard(promise, map, filter, i)
		}))
	}
	else {
		var guarded = {}
		for(var key in promises) {
			guarded[key] = guard(promises[key], map, filter, key);
		}

		return Promise.props(guarded)
	}
}

module.exports = promiseGuard
