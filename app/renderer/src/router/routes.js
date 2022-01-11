import auth from '@/lib/auth'
import lang from '@/lib/lang'
import timezone from '@/lib/timezone'
import init from '@/lib/init'

import store from '@/store/'

import Main from '@/components/Main'
import Login from '@/components/pages/Login'
import TaskType from '@/components/pages/TaskType'
import Todos from '@/components/pages/Todos'

const Asset = () => import('@/components/pages/Asset')
const Person = () => import('@/components/pages/Person')
const Profile = () => import('@/components/pages/Profile')
const ResetPassword = () => import('@/components/pages/ResetPassword')
const ServerDown = () => import('@/components/pages/ServerDown')
const Task = () => import('@/components/pages/Task')

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
      },

      {
        path: 'productions/:production_id/assets/:asset_id',
        component: Asset,
        name: 'asset'
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/assets/:asset_id',
        component: Asset,
        name: 'episode-asset'
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/:type/task-types/:task_type_id',
        component: TaskType,
        name: 'episode-task-type',
        children: [
          {
            name: 'episode-task-type-schedule',
            path: 'schedule',
            component: TaskType
          },
          {
            name: 'episode-task-type-estimation',
            path: 'estimation',
            component: TaskType
          }
        ]
      },

      {
        name: 'task',
        path: 'productions/:production_id/:type/tasks/:task_id',
        component: Task,
        children: [
          {
            name: 'task-delete',
            path: 'delete',
            component: Task
          },
          {
            name: 'task-change-preview',
            path: 'comments/:comment_id/change-preview',
            component: Task
          },
          {
            name: 'task-preview',
            path: 'previews/:preview_id',
            component: Task
          },
          {
            name: 'task-edit-comment',
            path: 'comments/:comment_id/edit',
            component: Task
          },
          {
            name: 'task-delete-comment',
            path: 'comments/:comment_id/delete',
            component: Task
          }
        ]
      },

      {
        path: 'productions/:production_id/:type/task-types/:task_type_id',
        component: TaskType,
        name: 'task-type',
        children: [
          {
            name: 'task-type-schedule',
            path: 'schedule',
            component: TaskType
          },
          {
            name: 'task-type-estimation',
            path: 'estimation',
            component: TaskType
          }
        ]
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/:type/tasks/:task_id',
        name: 'episode-task',
        component: Task,
        children: [
          {
            name: 'episode-task-delete',
            path: 'delete',
            component: Task
          },
          {
            name: 'episode-task-change-preview',
            path: 'comments/:comment_id/change-preview',
            component: Task
          },
          {
            name: 'episode-task-preview',
            path: 'previews/:preview_id',
            component: Task
          },
          {
            name: 'episode-task-edit-comment',
            path: 'comments/:comment_id/edit',
            component: Task
          },
          {
            name: 'episode-task-delete-comment',
            path: 'comments/:comment_id/delete',
            component: Task
          }
        ]
      },

      {
        path: 'profile',
        component: Profile,
        name: 'profile',
        children: [
          {
            path: 'change-avatar',
            component: Profile,
            name: 'change-avatar'
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
