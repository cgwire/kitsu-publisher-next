import { /*configureCompat,*/ createApp } from 'vue'
import { sync } from 'vuex-router-sync'

import Lazyload from 'vue3-lazyload'
import VueFeather from 'vue-feather'
import VueWebsocket from 'vue-websocket-next'

import App from './App'
import i18n from './lib/i18n'
import router from './router'
import store from './store'

const app = createApp(App)

app.use(i18n)
app.use(router)
app.use(store)
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

if (store.state.login.server) {
  window.electron.socketio.create(`${store.state.login.server}/events`, {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${store.state.login.access_token}`,
          'User-Agent': `Kitsu publisher ${window.electron.store.get('appVersion')}`
        }
      }
    }
  })
}

app.use(VueWebsocket, null, window.electron.socketio)

app.mount('#app')
