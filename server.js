const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const config = require('./config')
const tools = require('./tools')
const helpers = require('./helpers')

const app = express()

app.use(express.static('public'))
app.use(cors())

app.get('/', (req, res) => {
  const help = `
  <pre>
  Welcome to the Ping Stream Server!

    The following endpoints are available:

    GET /ping
    GET /pingStream
  </pre>
  `

  res.send(help)
})

app.listen(config.port, () => {
  console.log('Server listening on port %s, Ctrl+C to stop', config.port)
})

app.get('/ping', async (req, res) => {

  const { host } = req.query
  let { count } = req.query

  if (!host) {
    res.status(400)
       .send('Parameter "host" is required')
    return
  }

  if (count) {
    if (count > 60) {
      res.status(400)
         .send('Parameter "count" needs to be less than 60 if specified')
      return
    }
  }
  else {
    count = 5
  }

  try {
    const result = await tools.pingHost(host, {
      timeout: 5,
      extra: ['-c', count.toString()],
    })
    res.send(result)
  } catch (error) {
    console.log(error)
    res.send(500)
      .send('Internal server error')
  }
})

app.get('/pingStream', async (req, res) => {
  const { host } = req.query
  let { count } = req.query

  if (!host) {
    res.status(400)
       .send('Parameter "host" is required')
    return
  }

  if (count) {
    if (count > 60) {
      res.status(400)
         .send('Parameter "count" needs to be less than 60 if specified')
    }
    return
  }
  else {
    count = 5
  }

  let data = []
  let times = []
  let success = 0
  let failure = 0

  res.writeHead(200, {'Content-type': 'text/plain'})

  while(true) {
    try {
      let result = await tools.pingHost(host)
      res.write(JSON.stringify(result), 'utf8')
      data.push(result)
      times.push(result.time)
      result.alive ? success++ : failure++
      count--
      if (count === 0) {
        res.end(JSON.stringify({
          "host": host,
          "pings": data,
          "times": [],
          "packetLoss": success / (success + failure)
        }), 'utf8')
        break
      }
      await helpers.delay(1000)
    } catch (error) {
      console.error(error)
      res.status(500)
         .end('Internal server error')
    }
  }
})