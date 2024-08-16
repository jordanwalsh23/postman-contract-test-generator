const assert = require('chai').assert
const newman = require('newman')
const fs = require('fs')
const PostmanMockBuilder = require('@jordanwalsh23/postman-mock-builder')

describe('Postman Contract Test Suite - GET Requests', () => {
  let GET_SCHEMA = './test/v2/schemas/sample-product-GET-schema-v2.json'

  describe('TEST001 - GET Valid Response', () => {
    let test001MockServer = null
    before('setup mock server', done => {
      const PORT = 5555

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
              value: 'http://localhost:5555/schema'
            },
            {
              key: 'env-server',
              value: 'http://localhost:5555'
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

  describe('TEST002 - GET Missing Required Response Property', () => {
    let test002MockServer = null
    before('setup mock server', done => {
      const PORT = 5556

      let schema = JSON.parse(fs.readFileSync(GET_SCHEMA, 'utf-8').toString())
      schema.host = "localhost:" + PORT

      console.log('Setting up a new mock server')
      test002MockServer = PostmanMockBuilder.create({
        apiVersion: 'TEST002'
      })

      test002MockServer
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

      let test002Response = [
        {
          id: '1234',
          //name: 'Name', //Missing required property
          description: 'Description',
          model: 'Model',
          sku: 'SKU',
          cost: 445,
          imageUrl: 'image-url'
        }
      ]

      let state = test002MockServer.addState(
        'An invalid product exists in the database'
      )

      state
        .addRequest({
          method: 'GET',
          path: '/api/products'
        })
        .addResponse({
          status: 200,
          body: test002Response
        })

      test002MockServer.start(PORT)
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
              value: 'http://localhost:5556/schema'
            },
            {
              key: 'env-server',
              value: 'http://localhost:5556'
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

            assert(
              summary.run.failures.length == 1,
              'The failure count was not 1'
            )
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

    after('finish', done => {
      console.log('stopping server')
      test002MockServer.stop()
      done()
    })
  })

  describe('TEST003 - GET Undefined Required Response Property', () => {
    let test003MockServer = null
    before('setup mock server', done => {
      const PORT = 5557

      let schema = JSON.parse(fs.readFileSync(GET_SCHEMA, 'utf-8').toString())
      schema.host = "localhost:" + PORT

      console.log('Setting up a new mock server')
      test003MockServer = PostmanMockBuilder.create({
        apiVersion: 'TEST003'
      })

      test003MockServer
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

      let test003Response = [
        {
          id: '1234',
          name: null,
          description: 'Description',
          model: 'Model',
          sku: 'SKU',
          cost: 445,
          imageUrl: 'image-url'
        }
      ]

      let state = test003MockServer.addState(
        'An invalid product exists in the database'
      )

      state
        .addRequest({
          method: 'GET',
          path: '/api/products'
        })
        .addResponse({
          status: 200,
          body: test003Response
        })

      test003MockServer.start(PORT)
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
              value: 'http://localhost:5557/schema'
            },
            {
              key: 'env-server',
              value: 'http://localhost:5557'
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
            assert(
              summary.run.failures.length == 1,
              'The failure count was not 1'
            )

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

    after('finish', done => {
      console.log('stopping server')
      test003MockServer.stop()
      done()
    })
  })

  describe('TEST004 - GET Invalid Required Response Property', () => {
    let test004MockServer = null
    before('setup mock server', done => {
      const PORT = 5558

      let schema = JSON.parse(fs.readFileSync(GET_SCHEMA, 'utf-8').toString())
      schema.host = "localhost:" + PORT

      console.log('Setting up a new mock server')
      test004MockServer = PostmanMockBuilder.create({
        apiVersion: 'TEST004'
      })

      test004MockServer
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

      let test004Response = [
        {
          id: '1234',
          name: "ab",
          description: 'Description',
          model: 'Model',
          sku: 'SKU',
          cost: 445,
          imageUrl: 'image-url'
        }
      ]

      let state = test004MockServer.addState(
        'An invalid product exists in the database'
      )

      state
        .addRequest({
          method: 'GET',
          path: '/api/products'
        })
        .addResponse({
          status: 200,
          body: test004Response
        })

      test004MockServer.start(PORT)
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
              value: 'http://localhost:5558/schema'
            },
            {
              key: 'env-server',
              value: 'http://localhost:5558'
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
            assert(
              summary.run.failures.length == 1,
              'The failure count was not 1'
            )

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

    after('finish', done => {
      console.log('stopping server')
      test004MockServer.stop()
      done()
    })
  })

  describe('TEST005 - GET Missing Optional Response Property', () => {
    let test005MockServer = null
    before('setup mock server', done => {
      const PORT = 5559

      let schema = JSON.parse(fs.readFileSync(GET_SCHEMA, 'utf-8').toString())
      schema.host = "localhost:" + PORT

      console.log('Setting up a new mock server')
      test005MockServer = PostmanMockBuilder.create({
        apiVersion: 'TEST005'
      })

      test005MockServer
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

      let test005Response = [
        {
          id: '1234',
          name: 'Name',
          description: 'Description',
          model: 'Model',
          sku: 'SKU',
          cost: 445
        }
      ]

      let state = test005MockServer.addState(
        'An invalid product exists in the database'
      )

      state
        .addRequest({
          method: 'GET',
          path: '/api/products'
        })
        .addResponse({
          status: 200,
          body: test005Response
        })

      test005MockServer.start(PORT)
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
              value: 'http://localhost:5559/schema'
            },
            {
              key: 'env-server',
              value: 'http://localhost:5559'
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

            assert(
              summary.run.failures.length == 0,
              'The failure count was not 0'
            )
            if (
              summary.run &&
              summary.run.failures &&
              summary.run.failures.length > 0
            ) {
              done('This test should not have failed.')
            } else {
              done()
            }
          }
        })
    })

    after('finish', done => {
      console.log('stopping server')
      test005MockServer.stop()
      done()
    })
  })

  describe('TEST006 - GET Undefined Optional Response Property', () => {
    let test006MockServer = null
    before('setup mock server', done => {
      const PORT = 5560

      let schema = JSON.parse(fs.readFileSync(GET_SCHEMA, 'utf-8').toString())
      schema.host = "localhost:" + PORT

      console.log('Setting up a new mock server')
      test006MockServer = PostmanMockBuilder.create({
        apiVersion: 'TEST006'
      })

      test006MockServer
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

      let test006Response = [
        {
          id: '1234',
          name: "Test",
          description: 'Description',
          model: 'Model',
          sku: 'SKU',
          cost: 445,
          imageUrl: undefined
        }
      ]

      let state = test006MockServer.addState(
        'An invalid product exists in the database'
      )

      state
        .addRequest({
          method: 'GET',
          path: '/api/products'
        })
        .addResponse({
          status: 200,
          body: test006Response
        })

      test006MockServer.start(PORT)
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
              value: 'http://localhost:5560/schema'
            },
            {
              key: 'env-server',
              value: 'http://localhost:5560'
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
            assert(
              summary.run.failures.length == 0,
              'The failure count was not 0'
            )

            if (
              summary.run &&
              summary.run.failures &&
              summary.run.failures.length > 0
            ) {
              done('This test should not have failed.')
            } else {
              done()
            }
          }
        })
    })

    after('finish', done => {
      console.log('stopping server')
      test006MockServer.stop()
      done()
    })
  })

  describe('TEST007 - GET Invalid Optional Response Property', () => {
    let test007MockServer = null
    before('setup mock server', done => {
      const PORT = 5561
      let schema = JSON.parse(fs.readFileSync(GET_SCHEMA, 'utf-8').toString())
      schema.host = "localhost:" + PORT

      console.log('Setting up a new mock server')
      test007MockServer = PostmanMockBuilder.create({
        apiVersion: 'TEST007'
      })

      test007MockServer
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

      let test007Response = [
        {
          id: '1234',
          name: "abcd",
          description: 'Description',
          model: 'Model',
          sku: 'SKU',
          cost: 445,
          imageUrl: 'ht'
        }
      ]

      let state = test007MockServer.addState(
        'An invalid product exists in the database'
      )

      state
        .addRequest({
          method: 'GET',
          path: '/api/products'
        })
        .addResponse({
          status: 200,
          body: test007Response
        })

      test007MockServer.start(PORT)
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
              value: 'http://localhost:5561/schema'
            },
            {
              key: 'env-server',
              value: 'http://localhost:5561'
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
            assert(
              summary.run.failures.length == 1,
              'The failure count was not 1'
            )

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

    after('finish', done => {
      console.log('stopping server')
      test007MockServer.stop()
      done()
    })
  })

  describe('TEST008 - GET with injected schema', () => {
    let test008MockServer = null
    const PORT = 5562

    before('setup mock server', done => {  

      console.log('Setting up a new mock server')
      test008MockServer = PostmanMockBuilder.create({
        apiVersion: 'TEST008'
      })

      let test008Response = [
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

      let state = test008MockServer.addState(
        'An valid product exists in the database'
      )

      state
        .addRequest({
          method: 'GET',
          path: '/api/products'
        })
        .addResponse({
          status: 200,
          body: test008Response
        })

      test008MockServer.start(PORT)
      done()
    })

    it('runs a contract test', done => {
      let schema = JSON.parse(fs.readFileSync(GET_SCHEMA, 'utf-8').toString());
      schema.host = "localhost:" + PORT;

      newman
        .run({
          collection: require('../../src/v2/Contract Test Generator.postman_collection.json'),
          environment: require('../../src/v2/Contract Test Environment.postman_environment.json'),
          envVar: [
            {
              key: 'env-schema',
              value: JSON.stringify(schema)
            },
            {
              key: 'env-server',
              value: 'http://localhost:' + PORT
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
      test008MockServer.stop()
      done()
    })
  })

  
})
