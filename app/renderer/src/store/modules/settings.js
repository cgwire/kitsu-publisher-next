import {
  CHANGE_DCCS_EXPORTS_DIRECTORY,
  CHANGE_POST_EXPORTS_COMMAND,
  SAVE_SETTINGS_LOADING,
  SAVE_SETTINGS_SUCCESS
} from '@/store/mutation-types'

const initialState = {
  DCCsExportsDirectory: window.electron.config.get('dccs_exports_directory'),
  PostExportsCommand: window.electron.config.get('post_exports_command'),
  isSaveSettingsLoading: false
}

const state = {
  ...initialState
}

const getters = {
  DCCsExportsDirectory: (state) => state.DCCsExportsDirectory,
  PostExportsCommand: (state) => state.PostExportsCommand,
  isSaveSettingsLoading: (state) => state.isSaveSettingsLoading
}

const actions = {
  changeDCCsExportsDirectory({ commit, state }, DCCsExportsDirectory) {
    commit(CHANGE_DCCS_EXPORTS_DIRECTORY, DCCsExportsDirectory)
  },

  changePostExportsCommand({ commit, state }, PostExportsCommand) {
    commit(CHANGE_POST_EXPORTS_COMMAND, PostExportsCommand)
  },

  saveSettings({ commit, state }, states) {
    commit(SAVE_SETTINGS_LOADING)
    commit(CHANGE_DCCS_EXPORTS_DIRECTORY, states.DCCsExportsDirectory)
    commit(CHANGE_POST_EXPORTS_COMMAND, states.PostExportsCommand)
    commit(SAVE_SETTINGS_SUCCESS)
  }
}

const mutations = {
  [CHANGE_DCCS_EXPORTS_DIRECTORY](state, DCCsExportsDirectory) {
    window.electron.config.set('dccs_exports_directory', DCCsExportsDirectory)
    state.DCCsExportsDirectory = DCCsExportsDirectory
  },

  [CHANGE_POST_EXPORTS_COMMAND](state, PostExportsCommand) {
    window.electron.config.set('post_exports_command', PostExportsCommand)
    state.PostExportsCommand = PostExportsCommand
  },

  [SAVE_SETTINGS_LOADING](state) {
    state.isSaveSettingsLoading = true
  },

  [SAVE_SETTINGS_SUCCESS](state) {
    state.isSaveSettingsLoading = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
