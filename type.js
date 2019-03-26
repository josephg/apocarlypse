const register = require('statecraft/dist/lib/typeregistry').register

const type = module.exports = {
  name: 'apocarlypse',
  create() {
    return {
      state: 'waiting',
      clients: [],
      cars: [],
    }
  },

  apply(state, op) {
    if (state == null) state = type.create()
    state = {...state}
    console.log('apply', op)

    switch (op.type) {
      case 'connected':
        state.clients = state.clients.concat(op.id)
        if (state.clients.length >= 2 && state.state === 'waiting') {
          state.state = 'cardselect'
        }
        break

      case 'add card': {
        // state.clients[op.id].cards.push()
        break
      }
    }
    return state
  }
}

register(type)