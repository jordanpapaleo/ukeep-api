'use strict'

import Hapi from 'hapi'
import routes from './routes'
import options from './options'

const server = new Hapi.Server()

server.connection({ port: process.env.PORT || 8989 })

routes.forEach((route) => {
  server.route(route)
})

server.register({
  options,
  register: require('good')
}, (err) => {
  if (err) throw err

  server.start(() => {
    process.stdout.write(`Server started at: ${server.info.uri}`)
  })
})
