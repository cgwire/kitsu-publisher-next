import { createStore } from 'vuex'

import * as getters from './getters'

import assetTypes from './modules/assettypes'
import assets from './modules/assets'
import breakdown from './modules/breakdown'
import customActions from './modules/customactions'
import departments from './modules/departments'
import login from './modules/login'
import main from './modules/main'
import news from './modules/news'
import notifications from './modules/notifications'
import people from './modules/people'
import user from './modules/user'
import playlists from './modules/playlists'
import productions from './modules/productions'
import schedule from './modules/schedule'
import shots from './modules/shots'
import taskTypes from './modules/tasktypes'
import taskStatus from './modules/taskstatus'
import tasks from './modules/tasks'

import createPersistedState from 'vuex-persistedstate'
import SecureLS from 'secure-ls'

var localstorage = new SecureLS({ isCompression: false })

const modules = {
  assetTypes,
  assets,
  breakdown,
  customActions,
  departments,
  login,
  main,
  people,
  playlists,
  productions,
  news,
  notifications,
  schedule,
  shots,
  tasks,
  taskTypes,
  taskStatus,
  user
}

const store = createStore({
  getters,
  strict: process.env.NODE_ENV !== 'production',
  plugins: [
    createPersistedState({
      paths: ['login.email', 'login.access_token', 'login.server'],
      storage: {
        getItem: (key) => localstorage.get(key),
        setItem: (key, value) => localstorage.set(key, value),
        removeItem: (key) => localstorage.remove(key)
      }
    })
  ],
  modules: modules
})

export default store
