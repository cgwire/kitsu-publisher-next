import { /*configureCompat,*/ createApp } from 'vue'
import { sync } from 'vuex-router-sync'

// import Autocomplete from 'v-autocomplete'
// import Chartkick from 'vue-chartkick'
// import 'chartkick/chart.js'
import DragDrop from 'vue-drag-drop'
import Lazyload from 'vue3-lazyload'
// import Meta from 'vue-meta/dist/vue-meta.esm-bundler.js'
import TextareaAutosize from 'vue-textarea-autosize'
import VueFeather from 'vue-feather'
import VueWebsocket from 'vue-websocket-next'
// import 'v-autocomplete/dist/v-autocomplete.css'

import App from '@/App'
import i18n from '@/lib/i18n'
import resizableColumn from '@/directives/resizable-column'
import router from '@/router'
import store from '@/store'
// import VueScroll from '@/directives/scroll'

const app = createApp(App)

app.use(i18n)
app.use(router)
app.use(store)
// app.use(Autocomplete)
// app.use(Meta)
app.use(resizableColumn)
// app.use(Chartkick)
app.use(Lazyload)
app.use(DragDrop)
// app.use(VueScroll)
app.use(TextareaAutosize)

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
          'User-Agent': `Kitsu publisher ${window.electron.store.get(
            'appVersion'
          )}`
        }
      }
    }
  })
}

app.use(VueWebsocket, null, window.electron.socketio)

app.mount('#app')
