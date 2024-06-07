const assert = require('chai').assert
const newman = require('newman')
const fs = require('fs')
const PostmanMockBuilder = require('@jordanwalsh23/postman-mock-builder')

describe('Postman Contract Test Suite - GET Requests', () => {

  describe('TEST001 - GET Valid Response', () => {

    it('runs a contract test', done => {
      newman
        .run({
          collection: require('../../src/v3/Contract Test Generator.postman_collection.json'),
          environment: require('../../src/v3/OASv3.postman_environment.json')
        })
        .on('request', (err, args) => {
          console.log(args.response && args.response.stream ? args.response.stream.toString() : false)
        })
        .on('start', function (err, args) {
          // on start of run, log to console
          console.log('running a collection...')
        })
        .on('done', function (err, summary) {
          if (err || summary.error) {
            console.error('collection run encountered an error.')
            done(err)
          } else {
            console.log('collection run completed.')
            if (
              summary.run &&
              summary.run.failures &&
              summary.run.failures.length > 0
            ) {
              summary.run.failures.forEach(failure => {
                console.log(
                  'Test: ' +
                    failure.error.test +
                    ' - result: ' +
                    failure.error.message
                )
              })

              done('Tests Failed')
            } else {
              done()
            }
          }
        })
    })
  })
  
})
