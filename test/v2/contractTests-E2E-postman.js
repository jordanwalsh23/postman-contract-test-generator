const assert = require('chai').assert
const newman = require('newman')
const fs = require('fs')
const PostmanMockBuilder = require('@jordanwalsh23/postman-mock-builder')

describe('Postman Contract Test Suite - GET Requests', () => {

  describe('TEST001 - E2E test using Postman', () => {

    it('runs a contract test', done => {
      newman
        .run({
          collection: require('../../src/v2/Contract Test Generator.postman_collection.json'),
          environment: require('../../src/v2/OASv2.postman_environment.json')
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

  describe('TEST002 - E2E test using Postman with API IDs specified', () => {

    it('runs a contract test specifying a valid apiId', done => {
      newman
        .run({
          collection: require('../../src/v2/Contract Test Generator.postman_collection.json'),
          environment: require('../../src/v2/OASv2.postman_environment.json'),
          envVar: [
            {
              key: 'env-apiIds',
              value: 'ac49b26e-12be-48c4-bf9d-fd7f6ec965b4'
            }
          ]
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

    it('runs a contract test specifying an invalid apiId', done => {
      newman
        .run({
          collection: require('../../src/v2/Contract Test Generator.postman_collection.json'),
          environment: require('../../src/v2/OASv2.postman_environment.json'),
          envVar: [
            {
              key: 'env-apiIds',
              value: 'invalid'
            }
          ]
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
              done()
            } else {
              done('This test should have failed.')
            }
          }
        })
    })
  })
  
})
