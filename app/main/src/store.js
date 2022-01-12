import Store from 'electron-store'

const store = new Store({'name': 'store'})
const config = new Store({'name': 'config'})

export {store, config}