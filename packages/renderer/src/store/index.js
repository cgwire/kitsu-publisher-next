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
      paths: ['login.access_token', 'login.server'],
      storage: {
        getItem: (key) => window.electron.store.get(key),
        setItem: (key, value) => window.electron.store.set(key, value),
        removeItem: (key) => window.electron.store.delete(key)
      }
    })
  ],
  modules: modules
})

export default store
