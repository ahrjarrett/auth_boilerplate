const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')

app.use(morgan('combined'))
// TODO: fix `type` here, so we don't blow up trying to parse other data
app.use(bodyParser.json({ type: '*/*' }))

const router = require('./router')(app)
mongoose.connect('mongodb://localhost:auth/auth')


const PORT = process.env.PORT || 4004
const server = http.createServer(app)
server.listen(PORT)
console.log('server listening on port', PORT)

