// const reconnecter = require('statecraft/dist/lib/stores/reconnectingclient').default
// const connect = require('statecraft/dist/lib/stores/wsclient').default
const choo = require('choo')
const html = require('choo/html')

const cardSelect = (state, emit) => {
  return html`<body>
    <h1>Card select</h1>
    <button onclick=${() => emit('race')}>Race</button>
  </body>`}

const race = (state) => {
  return html`<body>
    <h1>Racey race time</h1>
  </body>`
}

const root = (state, emit) => {
  return state.screen === 'cardselect' ? cardSelect(state, emit) : race(state, emit)
}

;(async () => {
  const wsurl = `ws${window.location.protocol.slice(4)}//${window.location.host}/ws/`
  console.log('connecting to ws', wsurl, '...')
  // const [statusStore, storeP] = reconnecter(() => connect(wsurl))

  // const store = await storeP
  // window.store = store

  const app = choo()

  app.use((state, emitter) => {
    state.screen = 'cardselect'
    
    emitter.on('race', () => {
      state.screen = 'race'
      emitter.emit('render')
    })
  })

  app.route('/', root)
  app.mount('body')
})()
