import { createStore } from 'vuex'

import * as getters from '@/store/getters'

import assetTypes from '@/store/modules/assettypes'
import assets from '@/store/modules/assets'
import breakdown from '@/store/modules/breakdown'
import customActions from '@/store/modules/customactions'
import departments from '@/store/modules/departments'
import login from '@/store/modules/login'
import main from '@/store/modules/main'
import news from '@/store/modules/news'
import notifications from '@/store/modules/notifications'
import people from '@/store/modules/people'
import user from '@/store/modules/user'
import playlists from '@/store/modules/playlists'
import productions from '@/store/modules/productions'
import schedule from '@/store/modules/schedule'
import settings from '@/store/modules/settings'
import shots from '@/store/modules/shots'
import taskTypes from '@/store/modules/tasktypes'
import taskStatus from '@/store/modules/taskstatus'
import tasks from '@/store/modules/tasks'

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
  settings,
  shots,
  tasks,
  taskTypes,
  taskStatus,
  user
}

const store = createStore({
  getters,
  strict: process.env.NODE_ENV !== 'production',
  plugins: [],
  modules: modules
})

export default store
