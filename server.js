const express = require('express')
const http = require('http')
const statecraft = require('statecraft').default
const kvmem = require('statecraft/dist/lib/stores/kvmem')
const onekey = require('statecraft/dist/lib/stores/onekey').default
// const wrapWebSocket = require('statecraft/dist/lib/net/wsserver').wrapWebSocket
const optype = require('./type')
const ws = require('ws')
const assert = require('assert')

const changePrefix = (k, fromPrefix, toPrefix = '') => {
  assert(k.startsWith(fromPrefix), `'${k}' does not start with ${fromPrefix}`)
  return toPrefix + k.slice(fromPrefix.length)
}

process.on('unhandledRejection', err => {
  console.error(err.stack)
  process.exit(1)
})

;(async () => {
  const store = await kvmem.kvMem()

  // The root object has the game state.
  // await statecraft.kv.setKV(store, 'race', optype.create())

  const app = express()
  app.use(express.static(`${__dirname}/public`))
  app.get('/:gameid', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
  })
  
  const server = http.createServer(app)
  // const wss = new ws.Server({server})

  // wss.on('connection', (socket, req) => {
  //   const [reader, writer] = wrapWebSocket(socket)
  //   serve(reader, writer, store)
  // })


  statecraft.net.wsserver({server}, (client, req) => {
    if (!req.url.startsWith('/ws/')) {
      console.warn('client connected at invalid url', req.url)
      client.close()
    } else {
      const key = changePrefix(req.url, '/ws/')
      console.log('onekey', key)
      return onekey(store, key)
    }
  })
  // statecraft.net.wsserver({server}, store)

  server.listen(2000)
  console.log('listening on port 2000')
})()
