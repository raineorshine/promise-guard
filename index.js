var Promise = require('bluebird')
var id = function(x) { return x }

function guardPromise(promise, filter, map) {

  if(!promise) {
    throw new Error('No promise provided')
  }
  else if(!promise.then) {
    throw new Error('Received non-thenable')
  }

  filter = filter || id
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

module.exports = guardPromise