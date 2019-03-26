const reconnecter = require('statecraft/dist/lib/stores/reconnectingclient').default
const connect = require('statecraft/dist/lib/stores/wsclient').connect
const sel = require('statecraft/dist/lib/sel').default
const subValues = require('statecraft/dist/lib/subvalues').default
const choo = require('choo')
const html = require('choo/html')
const type = require('./type')

const waiting = (state) => {
  return html`<body>
    <h1>Waiting for players</h1>
    <h2>Client IDs in lobby:</h2>
    <div>
      ${state.root.clients.map(clientId => html`
        <div>${clientId}</div>
      `)}
    </div>
  </body>`
}

const cardSelect = (state, emit) => {
  return html`<body>
    <h1>Card select</h1>
    <button onclick=${() => emit('race')}>Race</button>
  </body>`
}

const race = (state) => {
  return html`<body>
    <h1>Racey race time</h1>
  </body>`
}

const root = (state, emit) => {
  return state.screen === 'waiting' ? waiting(state)
    : state.screen === 'cardselect' ? cardSelect(state, emit)
    : race(state, emit)
}

const trimPrefix = (k, prefix) => {
  return k.slice(prefix.length)
}

const alpha = 'abcdefghijklmnopqrstuvwxyz'
const alphabet = alpha + alpha.toUpperCase() + '0123456789'
const genId = () => {
  let out = ''
  for (let i = 0; i < 6; i++) out += alphabet[(Math.random() * alphabet.length)|0]
  return out
}

;(async () => {
  const wsurl = `ws${location.protocol.slice(4)}//${location.host}/ws/${location.pathname.slice(1)}`
  console.log('connecting to ws', wsurl, '...')
  const [statusStore, storeP] = reconnecter(() => connect(wsurl))

  const store = await storeP
  window.store = store

  const app = choo()

  const session = 'race'

  const applyOp = async op => {
    // op.turn = ...
    return store.mutate('single', {type: type.name, data: op})
  }

  app.use(async (state, emitter) => {
    // Subscribe to this race
    console.log(store.subscribe)

    // This is a bit awful; but its fine for now.
    const clientId = genId()
    await applyOp({type: 'connected', id: clientId})

    // could instead use singleval here.
    const sub = store.subscribe({type:'single', q: true})

    ;for await (const val of subValues('single', sub)) {
      state.root = val
      state.screen = state.root.state
      console.log('val', state.root)
      emitter.emit('render')
    }
  })


  // app.use((state, emitter) => {
  //   state.screen = 'cardselect'
    
  //   emitter.on('race', () => {
  //     state.screen = 'race'
  //     emitter.emit('render')
  //   })
  // })

  app.route('/:gameid', root)
  app.mount('body')
})()
