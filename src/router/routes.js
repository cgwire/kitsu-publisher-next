import auth from '../lib/auth'
import lang from '../lib/lang'
import timezone from '../lib/timezone'
import init from '../lib/init'

import store from '../store/'

import Main from '../components/Main'
import Todos from '../components/pages/Todos'
import Login from '../components/pages/Login'

const Person = () => import('../components/pages/Person')
const ServerDown = () => import('../components/pages/ServerDown')
const ResetPassword = () => import('../components/pages/ResetPassword')

const routes = [
  {
    path: '',
    component: Main,
    beforeEnter: (to, from, next) => {
      auth.requireAuth(to, from, (nextPath) => {
        if (nextPath) {
          next(nextPath)
        } else {
          timezone.setTimezone()
          lang.setLocale()
          init((err) => {
            if (err) {
              next({ name: 'server-down' })
            } else {
              next({ name: 'todos' })
            }
          })
        }
      })
    }
  },
  {
    path: '/',
    component: Main,
    beforeEnter: (to, from, next) => {
      auth.requireAuth(to, from, (nextPath) => {
        if (nextPath) {
          next(nextPath)
        } else {
          timezone.setTimezone()
          lang.setLocale()
          init(() => {
            store.commit('DATA_LOADING_END')
            next()
          })
        }
      })
    },
    children: [
      {
        path: '',
        name: 'home'
      },
      {
        path: 'todos',
        component: Todos,
        name: 'todos',
        children: [{ path: ':tab', component: Todos, name: 'todos-tab' }]
      },
      {
        path: 'people/:person_id',
        component: Person,
        name: 'person',
        children: [
          {
            path: ':tab',
            component: Person,
            name: 'person-tab'
          }
        ]
      }
    ]
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
  },
  {
    path: '/reset-password',
    component: ResetPassword,
    name: 'reset-password'
  }
]

export default routes
