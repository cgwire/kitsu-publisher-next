import { createRouter, createWebHashHistory } from 'vue-router'
import routes from '/src/router/routes'

const loadSavedScrollPosition = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: loadSavedScrollPosition,
  routes
})

export default router
