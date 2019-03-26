// const reconnecter = require('statecraft/dist/lib/stores/reconnectingclient').default
// const connect = require('statecraft/dist/lib/stores/wsclient').default
const choo = require('choo')
const html = require('choo/html')

const myComponent = (state) => {
  return html`<body>
    <h1>hi!</h1>
  </body>`
}

;(async () => {
  const wsurl = `ws${window.location.protocol.slice(4)}//${window.location.host}/ws/`
  console.log('connecting to ws', wsurl, '...')
  // const [statusStore, storeP] = reconnecter(() => connect(wsurl))

  // const store = await storeP
  // window.store = store

  const app = choo()
  app.route('/', myComponent)
  app.mount('body')
})()
