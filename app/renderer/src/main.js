import { createApp } from 'vue'
import { sync } from 'vuex-router-sync'
import App from '@/App'
import i18n from '@/lib/i18n'
import resizableColumn from '@/directives/resizable-column'
import router from '@/router'
import store from '@/store'
import VueFeather from 'vue-feather'
import VueWebsocket from 'vue-websocket-next'
import DragDrop from 'vue-drag-drop'
import Lazyload from 'vue3-lazyload'

const app = createApp(App)

app.use(i18n)
app.use(router)
app.use(store)
app.use(resizableColumn)
app.use(Lazyload)
app.use(DragDrop)
app.component(VueFeather.name, VueFeather)
app.use(VueWebsocket, null, window.electron.socketio)
app.config.productionTip = false

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
  window.electron.socketio.create()
}

app.mount('#app')
