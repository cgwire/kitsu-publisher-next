import { contextBridge } from 'electron'

import Store from 'electron-store'
const store = new Store()

const apiKey = 'electron'
/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api = {
  versions: process.versions,
  //appVersion: app.getVersion(),
  store: {
    get: (key) => {
      return store.get(key)
    },
    set: (key, value) => {
      return store.set(key, value)
    },
    delete: (key) => {
      return store.delete(key)
    }
  }
}

/**
 * The "Main World" is the JavaScript context that your main renderer code runs in.
 * By default, the page you load in your renderer executes code in this world.
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */
contextBridge.exposeInMainWorld(apiKey, api)
