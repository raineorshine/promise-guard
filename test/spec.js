var chai = require('chai');
var should = chai.should();
var chaiAsPromised = require('chai-as-promised');
var guardPromise = require('../index');
var _ = require('lodash')

chai.use(chaiAsPromised);

describe('guardPromise', function() {

  it('should not affect promises that resolve', function() {
    guardPromise(Promise.resolve(1), _.partial(_.identity, null), function(reason) {
      return reason.statusCode === 404
    })
    .should.eventually.equal(1)
  })

  it('should not affect rejected promises that are not matched by the filter function', function() {
    guardPromise(
    	Promise.reject(1),
    	_.partial(_.identity, 2),
    	function(reason) { return reason === 404 }
    ).should.be.rejected;
  })

  it('should convert matched rejected promises to the result of the processor function', function() {
  	return guardPromise(
      Promise.reject({ statusCode: 404 }),
      _.partial(_.identity, 2),
      function(reason) { return reason.statusCode === 404 }
    ).should.eventually.equal(2)
  })

  it('should use an always(true) function if a filter function is not provided', function() {
    return guardPromise(
      Promise.reject({ statusCode: 404, default: 'hi' }),
      function(reason) { return reason.default }
    )
    .should.eventually.eql('hi')
  })

  it('should use the identify function if a mapping function is not provided', function() {
    return guardPromise(Promise.reject(1))
    .should.eventually.eql(1)
  })

  it('can be used to settle multiple promises', function() {
  	return guardPromise.all([Promise.resolve(1), Promise.resolve(2), Promise.reject(3)])
  	.should.eventually.eql([1,2,3])
  })

})
