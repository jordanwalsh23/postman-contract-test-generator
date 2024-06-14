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

  describe('TEST002 - GET Valid Response with apiIds parameter', () => {

    it('runs a contract test with a valid parameter', done => {
      newman
        .run({
          collection: require('../../src/v3/Contract Test Generator.postman_collection.json'),
          environment: require('../../src/v3/OASv3.postman_environment.json'),
          envVar: [
            {
              key: 'env-apiId',
              value: '437ec72a-4d70-4a07-bd2f-83608cf95112'
            },
            {
              key: "env-apiDefinitionId",
              value: "c836684b-227a-4796-a9ef-8ec3e12d498d"
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

    it('runs a contract test with an invalid parameter', done => {
      newman
        .run({
          collection: require('../../src/v3/Contract Test Generator.postman_collection.json'),
          environment: require('../../src/v3/OASv3.postman_environment.json'),
          envVar: [
            {
              key: 'env-apiId',
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
