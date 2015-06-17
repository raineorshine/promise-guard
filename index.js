var Promise = require('bluebird')
var id = function(x) { return x }

function guardPromise(promise, map, filter, passThrough) {

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

function catchSome(promises, map, filter) {

	if(Array.isArray(promises)) {
		return Promise.all(promises.map(function(promise, i) {
			return guardPromise(promise, map, filter, i)
		}))
	}
	else {
		var guarded = {}
		for(var key in promises) {
			guarded[key] = guardPromise(promises[key], map, filter, key);
		}

		return Promise.props(guarded)
	}
}

module.exports = catchSome
