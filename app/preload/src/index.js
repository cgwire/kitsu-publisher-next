import { contextBridge, ipcRenderer } from 'electron'
import { readFileSync } from 'fs'
const io = require('socket.io-client')

import { store, config } from './../../main/src/store'

let socketio = null

const apiKey = 'electron'
/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api = {
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
  },
  config: {
    get: (key) => {
      return config.get(key)
    },
    set: (key, value) => {
      return config.set(key, value)
    },
    delete: (key) => {
      return config.delete(key)
    }
  },
  file: {
    readFileSync: (filepath) => {
      return readFileSync(filepath)
    }
  },
  toggleDarkTheme: (darkTheme) =>
    ipcRenderer.invoke('dark-theme:toggle', darkTheme),
  socketio: {
    create: (address, opts) => {
      socketio = io(address, opts)
    },
    destroy: () => {
      if (socketio !== null) {
        socketio.disconnect()
      }
      socketio = null
    },
    on: (event, fun) => {
      if (socketio !== null) {
        socketio.on(event, fun)
      }
    },
    off: (event, fun) => {
      if (socketio !== null) {
        socketio.off(event, fun)
      }
    },
    connect: () => {
      if (socketio !== null) {
        socketio.connect()
      }
    },
    disconnect: () => {
      if (socketio !== null) {
        socketio.disconnect()
      }
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
