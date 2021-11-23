import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import routes from '/src/router/routes'

const loadSavedScrollPosition = (to, from, savedPosition) => {
  if (savedPosition) {
    return { left: savedPosition.x, top: savedPosition.y }
  } else {
    return { left: 0, top: 0 }
  }
}

const router = createRouter({
  history: import.meta.env.PROD ? createWebHashHistory() : createWebHistory(),
  scrollBehavior: loadSavedScrollPosition,
  routes
})

export default router
