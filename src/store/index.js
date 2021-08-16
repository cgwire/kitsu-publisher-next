import { createStore } from 'vuex'

import tasks from '/src/store/modules/tasks'

const modules = {
  tasks
}

const store = createStore({
  strict: process.env.NODE_ENV !== 'production',
  modules
})

export default store
