const express = require('express')
const http = require('http')
const statecraft = require('statecraft').default


process.on('unhandledRejection', err => {
  console.error(err.stack)
  process.exit(1)
})

;(async () => {
  const store = await statecraft.stores.kvmem()
  await statecraft.kv.setKV(store, 'x', 'hi')

  const app = express()
  app.use(express.static(`${__dirname}/public`))
  
  const server = http.createServer(app)
  statecraft.net.wsserver({server}, (ws, msg) => store)

  server.listen(2000)
  console.log('listening on port 2000')
})()
