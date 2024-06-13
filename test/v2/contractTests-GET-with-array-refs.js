const assert = require('chai').assert
const newman = require('newman')
const fs = require('fs')
const PostmanMockBuilder = require('@jordanwalsh23/postman-mock-builder')

describe('Postman Contract Test Suite - GET Requests', () => {
  let GET_SCHEMA = './test/v2/schemas/sample-product-GET-schema-v2-with-array-refs.json'

  describe('TEST001 - GET Valid Response', () => {
    let test001MockServer = null
    before('setup mock server', done => {
      const PORT = 6000

      let schema = JSON.parse(fs.readFileSync(GET_SCHEMA, 'utf-8').toString())
      schema.host = "localhost:" + PORT

      test001MockServer = PostmanMockBuilder.create({
        apiVersion: 'TEST001'
      })

      test001MockServer
        .addState('API Schema')
        .addRequest({
          method: 'GET',
          path: '/schema'
        })
        .addResponse({
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: schema
        })

      let test001response = [
        {
          id: '1234',
          name: 'Name',
          description: 'Description',
          model: 'Model',
          sku: 'SKU',
          cost: 445,
          imageUrl: 'image-url'
        }
      ]

      let state = test001MockServer.addState('A product exists in the database')

      state
        .addRequest({
          method: 'GET',
          path: '/api/products'
        })
        .addResponse({
          status: 200,
          body: test001response
        })

      test001MockServer.start(PORT)
      done()
    })

    it('runs a contract test', done => {
      newman
        .run({
          collection: require('../../src/v2/Contract Test Generator.postman_collection.json'),
          environment: require('../../src/v2/Contract Test Environment.postman_environment.json'),
          envVar: [
            {
              key: 'env-schemaUrl',
              value: 'http://localhost:6000/schema'
            },
            {
              key: 'env-server',
              value: 'http://localhost:6000'
            }
          ]
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

    after('finish', done => {
      console.log('stopping server')
      test001MockServer.stop()
      done()
    })
  })
});