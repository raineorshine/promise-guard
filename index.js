var Promise = require('bluebird')
var id = function(x) { return x }

function guardPromise(promise, map, filter) {

  if(!promise) {
    throw new Error('No promise provided')
  }
  else if(!promise.then) {
    throw new Error('Received non-thenable')
  }

  filter = filter || id.bind(null, true)
  map = map || id

  return Promise.resolve(promise).reflect()
  .then(function(inspection) {
    if(inspection.isRejected()) {
      var reason = inspection.reason()
      if(filter(reason)) {
        return map(reason)
      }
      else {
        throw reason
      }
    }
    else {
      return inspection.value()
    }
  });
}

function all(promises, map, filter) {
	return Promise.all(promises.map(function(promise) {
		return guardPromise(promise, map, filter)
	}))
}

module.exports = guardPromise
module.exports.all = all
