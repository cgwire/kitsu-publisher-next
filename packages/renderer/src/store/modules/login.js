import {
  CHANGE_EMAIL,
  CHANGE_PASSWORD,
  CHANGE_SERVER,
  CHANGE_ACCESS_TOKEN,
  LOGIN_RUN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SERVER_FAILURE,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  DATA_LOADING_START,
  DATA_LOADING_END,
  TOGGLE_USER_MENU,
  RESET_ALL
} from '../mutation-types'
import auth from '../../lib/auth'

const initialState = {
  server: '',
  access_token: '',
  email: '',
  password: '',
  isLdap: false,
  isLoginLoading: false,
  isLoginError: false,
  isServerError: false,
  isDataLoading: false
}

const state = {
  ...initialState
}

const getters = {
  server: (state) => state.server,
  access_token: (state) => state.access_token,
  email: (state) => state.email,
  password: (state) => state.password,
  isLdap: (state) => state.isLdap,
  isLoginLoading: (state) => state.isLoginLoading,
  isLoginError: (state) => state.isLoginError,
  isServerError: (state) => state.isServerError,
  isDataLoading: (state) => state.isDataLoading
}

const actions = {
  changeEmail({ commit, state }, email) {
    commit(CHANGE_EMAIL, email)
  },

  changePassword({ commit, state }, password) {
    commit(CHANGE_PASSWORD, password)
  },

  changeServer({ commit, state }, server) {
    commit(CHANGE_SERVER, server)
  },

  changeAccessToken({ commit, state }, server) {
    commit(CHANGE_ACCESS_TOKEN, server)
  },

  logIn({ commit, state }, callback) {
    commit(LOGIN_RUN)
    auth.logIn(state.email, state.password, (err) => {
      if (err) {
        if (err.status == 400) {
          commit(LOGIN_FAILURE)
        } else {
          commit(SERVER_FAILURE)
        }
        callback(err, false)
      } else {
        commit(LOGIN_SUCCESS)
        callback(null, true)
      }
    })
  },

  logout({ commit, state }, callback) {
    auth.logout((err) => {
      if (err) {
        commit(LOGOUT_FAILURE)
        callback(null, false)
      } else {
        commit(RESET_ALL)
        commit(LOGOUT_SUCCESS)
        commit(TOGGLE_USER_MENU)
        callback(null, true)
      }
    })
  },

  resetPassword({ commit }, email) {
    return new Promise((resolve, reject) => {
      auth.resetPassword(email).then(resolve).catch(reject)
    })
  },

  resetChangePassword({ commit }, { token, password, password2 }) {
    return new Promise((resolve, reject) => {
      auth
        .resetChangePassword(token, password, password2)
        .then(() => {
          commit(LOGIN_SUCCESS)
          resolve()
        })
        .catch(reject)
    })
  }
}

const mutations = {
  [CHANGE_EMAIL](state, email) {
    state.email = email
  },

  [CHANGE_PASSWORD](state, password) {
    state.password = password
  },

  [CHANGE_SERVER](state, server) {
    state.server = server
  },

  [CHANGE_ACCESS_TOKEN](state, access_token) {
    state.access_token = access_token
  },

  [LOGIN_RUN](state) {
    state.isLoginLoading = true
    state.isLoginError = false
    state.isServerError = false
  },

  [LOGIN_SUCCESS](state, email) {
    state.isLoginLoading = false
    state.isLoginError = false
    state.isServerError = false
  },

  [LOGIN_FAILURE](state, email) {
    state.isLoginLoading = false
    state.isLoginError = true
  },

  [SERVER_FAILURE](state, server) {
    state.isLoginLoading = false
    state.isServerError = true
  },

  [LOGOUT_SUCCESS](state, email) {
    state.isLoginLoading = false
    state.isLoginError = false
    state.isServerError = false
  },

  [DATA_LOADING_START](state, payload) {
    state.isDataLoading = true
    if (payload && payload.isLdap !== undefined) state.isLdap = payload.isLdap
  },

  [DATA_LOADING_END](state) {
    state.isDataLoading = false
  },

  [RESET_ALL](state, email) {
    const server_state = state.server
    Object.assign(state, { ...initialState })
    state.server = server_state
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
