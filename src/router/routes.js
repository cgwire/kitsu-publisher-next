import auth from '../lib/auth'
import lang from '../lib/lang'
import timezone from '../lib/timezone'
import init from '../lib/init'

import store from '../store/'

import Todos from '../components/pages/Todos'
import Login from '../components/pages/Login'

const ServerDown = () => import('../components/pages/ServerDown')

const routes = [
  {
    path: '',
    alias: '/',
    component: Todos,
    name: 'todos',
    beforeEnter: (to, from, next) => {
      auth.requireAuth(to, from, (nextPath) => {
        timezone.setTimezone()
        lang.setLocale()
        init((err) => {
          store.commit('DATA_LOADING_END')
          if (err) {
            next({ name: 'server-down' })
          } else {
            next({ name: 'todos' })
          }
        })
      })
    },
    children: [{ path: ':tab', component: Todos, name: 'todos-tab' }]
  },
  {
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/server-down',
    component: ServerDown,
    name: 'server-down'
  }
]

export default routes
