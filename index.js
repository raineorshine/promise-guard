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

  return Promise.resolve(promise).reflect()
  .then(function(inspection) {
    if(inspection.isRejected()) {
      var reason = inspection.reason()
      if(filter(reason, passThrough)) {
        return map(reason, passThrough)
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

function all(promiseArray, map, filter) {
	return Promise.all(promiseArray.map(function(promise, i) {
		return guardPromise(promise, map, filter, i)
	}))
}

function props(promiseObj, map, filter) {

	var guarded = {}
	for(var key in promiseObj) {
		guarded[key] = guardPromise(promiseObj[key], map, filter, key);
	}

	return Promise.props(guarded)
}

module.exports = guardPromise
module.exports.all = all
module.exports.props = props
