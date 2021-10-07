import { createStore } from 'vuex'

import * as getters from './getters'

import tasks from '/src/store/modules/tasks'
import assets from '/src/store/modules/assets'
import login from '/src/store/modules/login'
import people from '/src/store/modules/people'
import productions from '/src/store/modules/productions'
import shots from '/src/store/modules/shots'
import taskstatus from '/src/store/modules/taskstatus'
import tasktypes from '/src/store/modules/tasktypes'
import user from '/src/store/modules/user'
import main from '/src/store/modules/main'

const modules = {
  assets,
  login,
  main,
  people,
  productions,
  shots,
  taskstatus,
  tasktypes,
  tasks,
  user
}

const store = createStore({
  getters,
  strict: process.env.NODE_ENV !== 'production',
  modules: modules
})

export default store
