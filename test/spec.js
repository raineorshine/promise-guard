var chai = require('chai');
var should = chai.should();
var chaiAsPromised = require('chai-as-promised');
var guardPromise = require('../index');
var _ = require('lodash')

chai.use(chaiAsPromised);

describe('guardPromise', function() {

  it('should not affect promises that resolve', function() {
    guardPromise(Promise.resolve(1), function(reason) {
      return reason.statusCode === 404
    }, _.partial(_.identity, null))
    .should.eventually.equal(1)
  })

  it('should not affect rejected promises that are not matched by the filter function', function() {
    guardPromise(Promise.reject(1), function(reason) {
      return reason.statusCode === 404
    }, _.partial(_.identity, 2))
    .should.be.rejected;
  })

  it('should convert matched rejected promises to the result of the processor function', function() {
    return guardPromise(
      Promise.reject({ statusCode: 404 }),
      function(reason) { return reason.statusCode === 404 },
      _.partial(_.identity, 2)
    )
    .should.eventually.equal(2)
  })

  it('should use the identify function if a processor function is not provided', function() {
    return guardPromise(
      Promise.reject({ statusCode: 404 }),
      function(reason) { return reason.statusCode === 404 }
    )
    .should.eventually.eql({ statusCode: 404 })
  })

  it('should use the identify function if a filter function is not provided', function() {
    return guardPromise(Promise.reject(1))
    .should.eventually.eql(1)
  })

})
