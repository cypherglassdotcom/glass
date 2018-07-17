require("babel-polyfill");
import http from 'http';
import express from 'express';
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import middleware from './middleware'
import api from './api'
import config from './config.json'

const initializeDb = require('./db')

let app = express()
app.server = http.createServer(app)

// logger
app.use(morgan('dev'))

// 3rd party middleware
app.use(cors({
  exposedHeaders: config.corsHeaders
}))

app.use(bodyParser.json({
  limit : config.bodyLimit
}))

// connect to db
initializeDb().then(db => {
  // internal middleware
  app.use(middleware({ config, db }))

  // api router
  app.use('/api', api({ config, db }))

  app.server.listen(process.env.PORT || config.port, () => {
    console.log(`Started on port ${app.server.address().port}`)
  })
})

export default app;
