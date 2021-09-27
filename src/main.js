import { configureCompat, createApp } from 'vue'
import { sync } from 'vuex-router-sync'

import 'bulma/css/bulma.css'
import router from './router'
import store from './store'
import i18n from './lib/i18n'
import VueFeather from 'vue-feather'

import App from './App.vue'

configureCompat({
  MODE: 3,
  INSTANCE_EVENT_HOOKS: true,
  INSTANCE_EVENT_EMITTER: true,
  INSTANCE_CHILDREN: true,
  INSTANCE_SCOPED_SLOTS: true
})

const app = createApp(App)
app.use(i18n)
app.use(router)
app.use(store)

app.component(VueFeather.name, VueFeather)

// Make the current route part of the main state.
sync(store, router)

app.config.globalProperties.$locale = {
  change(locale) {
    i18n.locale = locale
  },
  current() {
    return i18n.locale
  }
}

app.mount('#app')
