import client from '@/store/api/client'
import {
  USER_LOGIN,
  TOGGLE_DARK_THEME,
  TOGGLE_SIDEBAR,
  TOGGLE_USER_MENU,
  SET_LAST_PRODUCTION_SCREEN,
  SET_CURRENT_PRODUCTION,
  SHOW_PREVIEW_FILE,
  HIDE_PREVIEW_FILE,
  RESET_ALL
} from '@/store/mutation-types'

const initialState = {
  currentProductionScreen: 'assets',
  isDarkTheme: window.electron.store.get('main.isDarkTheme'),
  isSidebarHidden: true,
  isUserMenuHidden: true,
  lastProductionScreen: 'assets',
  lastProductionViewed: null,
  previewFileIdToShow: ''
}

const state = { ...initialState }

const getters = {
  currentProductionScreen: (state) => state.currentProductionScreen,
  isDarkTheme: (state) => state.isDarkTheme,
  isSidebarHidden: (state) => state.isSidebarHidden,
  isUserMenuHidden: (state) => state.isUserMenuHidden,
  lastProductionScreen: (state) => state.lastProductionScreen,
  lastProductionViewed: (state) => state.lastProductionViewed,
  previewFileIdToShow: (state) => state.previewFileIdToShow
}

const actions = {
  toggleDarkTheme({ commit, state }) {
    commit(TOGGLE_DARK_THEME)
    window.electron.toggleDarkTheme().then()
  },

  toggleSidebar({ commit, state }) {
    commit(TOGGLE_SIDEBAR)
  },

  toggleUserMenu({ commit, state }) {
    commit(TOGGLE_USER_MENU)
  },

  setLastProductionScreen({ commit, state }, lastProductionScreen) {
    commit(SET_LAST_PRODUCTION_SCREEN, lastProductionScreen)
  },

  loadEvents({ commit, state }, { after, before }) {
    return client.getEvents(after, before)
  },

  searchData(_, { query }) {
    return client.searchData(query)
  }
}

const mutations = {
  [TOGGLE_DARK_THEME](state) {
    state.isDarkTheme = !state.isDarkTheme
    window.electron.store.set('main.isDarkTheme', state.isDarkTheme)
  },

  [TOGGLE_SIDEBAR](state) {
    state.isSidebarHidden = !state.isSidebarHidden
  },

  [TOGGLE_USER_MENU](state) {
    state.isUserMenuHidden = !state.isUserMenuHidden
  },

  [SET_LAST_PRODUCTION_SCREEN](state, lastProductionScreen) {
    state.lastProductionScreen = lastProductionScreen
  },

  [SET_CURRENT_PRODUCTION](state, productionId) {
    if (productionId) state.lastProductionViewed = productionId
  },

  [USER_LOGIN](state, user) {
    if (user && user.role === 'client') {
      state.lastProductionScreen = 'playlists'
    }
  },

  [SHOW_PREVIEW_FILE](state, previewFileId) {
    state.previewFileIdToShow = previewFileId
  },

  [HIDE_PREVIEW_FILE](state) {
    state.previewFileIdToShow = ''
  },

  [RESET_ALL](state) {
    const isDarkTheme = state.isDarkTheme
    Object.assign(state, { ...initialState })
    state.isDarkTheme = isDarkTheme
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
