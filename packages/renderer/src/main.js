import { /*configureCompat,*/ createApp } from 'vue'
import { sync } from 'vuex-router-sync'

import Lazyload from 'vue3-lazyload'
import VueFeather from 'vue-feather'
//import VueWebsocket from 'vue-websocket-next'
//import IO from 'socket.io-client'

import App from './App'
import i18n from './lib/i18n'
import router from './router'
import store from './store'

const app = createApp(App)

app.use(i18n)
app.use(router)
app.use(store)
//app.use(VueWebsocket, IO, '/events')
app.use(Lazyload)

app.component(VueFeather.name, VueFeather)

// Make the current route part of the main state.
sync(store, router)

// Global custom directive to enable automatic focus on field after page
// loading.
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// Allow access to i18n object from vue instance.
app.config.globalProperties.$locale = {
  change(locale) {
    i18n.locale = locale
  },
  current() {
    return i18n.locale
  }
}

app.mount('#app')
