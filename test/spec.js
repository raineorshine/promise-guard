var chai = require('chai')
var should = chai.should()
var chaiAsPromised = require('chai-as-promised')
var _ = require('lodash')
var Promise = require('bluebird')
var catchSome = require('../index')

chai.use(chaiAsPromised)

describe('catchSome', function() {

  it('should not affect promises that resolve', function() {
    return catchSome(
    	[Promise.resolve(1), Promise.resolve(2)],
    	_.partial(_.identity, null),
    	function(error) { return error.statusCode === 404 }
    ).should.eventually.eql([1, 2])
  })

  it('should not affect rejected promises that are not matched by the filter function', function() {
    return catchSome(
    	[Promise.reject(1)],
    	_.partial(_.identity, 2),
    	function(error) { return error === 404 }
    ).should.be.rejected;
  })

  it('should convert matched rejected promises to the result of the mapping function', function() {
  	return catchSome(
      [Promise.reject({ statusCode: 404 })],
      _.partial(_.identity, 2),
      function(error) { return error.statusCode === 404 }
    ).should.eventually.eql([2])
  })

  it('should use an always(true) function to resolve all rejections if a filter function is not provided', function() {
    return catchSome(
      [Promise.reject({ statusCode: 404, default: 'hi' })],
      function(error) { return error.default }
    )
    .should.eventually.eql(['hi'])
  })

  it('should use the identify function if a mapping function is not provided', function() {
    return catchSome([Promise.reject(1)])
    .should.eventually.eql([1])
  })

  it('should pass the key', function() {
  	return catchSome([Promise.resolve('a'), Promise.resolve('b'), Promise.reject('c')], function(error, key) { return key})
  	.should.eventually.eql(['a', 'b', 2])
  })

  it('should work on objects of promises', function() {
  	return catchSome({
  		one: Promise.resolve(1),
  		two: Promise.resolve(2),
  		three: Promise.reject(3)
  	})
  	.should.eventually.eql({
  		one: 1,
  		two: 2,
  		three: 3
  	})
  })

  it('should pass the key when called on objects', function() {
  	return catchSome({
  		one: Promise.resolve(1),
  		two: Promise.resolve(2),
  		three: Promise.reject(3)
  	}, function(error, key) { return key })
  	.should.eventually.eql({
  		one: 1,
  		two: 2,
  		three: 'three'
  	})
  })

})
