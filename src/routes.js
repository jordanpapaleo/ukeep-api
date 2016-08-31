import fs from 'fs'
import path from 'path'
import Boom from 'boom'

const filePath = path.join(__dirname, 'db.json')
const encoding = 'utf8'

// Hapi API Endpoints
export default [
  {
    method: 'PUT',
    path: '/records/{id}/service',
    config: {
      description: 'Add service',
      notes: 'Used to add a service entry to a record',
      tags: ['api']
    },
    handler (request, reply) {
      const { id } = request.params
      const { payload } = request

      // console.info('')
      // console.info(payload)
      // console.info(`${JSON.parse(payload)}`)

      // TODO pass the id and use an individual record once a real db is being used
      getRecord()
        .then(
          (records) => {
            updateRecord(records, id, payload)
              .then(
                (record) => {
                  reply({ body: record })
                },
                (err) => {
                  throw err
                }
              )
          },
          (err) => {
            throw err
          }
        )
        .catch((err) => {
          reply(Boom.create(500, 'Something is not working', { err }))
        })
    }
  },
  {
    method: 'GET',
    path: '/records/{id?}',
    handler (request, reply) {
      const { id } = request.params

      getRecord(id)
        .then(
          (record) => {
            reply({ body: record })
          },
          (err) => {
            throw err
          }
        )
        .catch((err) => {
          reply(Boom.create(500, 'Cannot read DB', { err }))
        })
    }
  },
  {
    method: 'POST',
    path: '/records',
    handler (request, reply) {
      const { payload } = request

      getRecord()
        .then(
          (records) => {
            newRecord(records, payload)
              .then(
                (record) => {
                  reply({ body: record })
                },
                (err) => {
                  throw err
                }
              )
          },
          (err) => {
            throw err
          }
        )
        .catch((err) => {
          reply(Boom.create(500, 'Cannot add a new vehicle', { err }))
        })
    }
  }
]

function getRecord (id) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        reject(err)
      } else {
        const records = JSON.parse(data)
        let returnData = [...records]

        if (id) {
          records.forEach((record) => {
            if (record.id === id) {
              returnData = Object.assign({}, record)
            }
          })
        }

        resolve(returnData)
      }
    })
  })
}

function newRecord (records, payload) {
  const record = {
    id: Date.now(),
    vehicle: Object.assign({}, JSON.parse(payload)),
    service: []
  }

  records.push(record)

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(records, null, 2), (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(record)
      }
    })
  })
}

function updateRecord (records, id, payload) {
  return new Promise((resolve, reject) => {
    let updatedRecord = {}

    records.forEach((record) => {
      if (record.id === id) {
        record.service.push(JSON.parse(payload))
        updatedRecord = Object.assign({}, record)
      }
    })

    fs.writeFile(filePath, JSON.stringify(records, null, 2), (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(updatedRecord)
      }
    })
  })
}

function deleteRecord (records, id) {

}
