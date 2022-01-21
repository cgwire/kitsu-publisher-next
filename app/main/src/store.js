import Store from 'electron-store'
const os = require('os')

const store_schema = {
  login: {
    type: 'object',
    default: {
      access_token: '',
      server: '',
      email: ''
    },
    properties: {
      access_token: {
        type: 'string'
      },
      server: {
        type: 'string'
      },
      email: {
        type: 'string'
      }
    }
  },
  main: {
    type: 'object',
    default: {
      isDarkTheme: true
    },
    properties: {
      isDarkTheme: {
        type: 'boolean'
      }
    }
  }
}

const config_schema = {
  dccs_exports_directory: {
    type: 'string',
    default: os.tmpdir()
  },
  post_exports_command: {
    type: 'string',
    default: ''
  }
}

const store = new Store({ name: 'store', schema: store_schema })
const config = new Store({ name: 'config', schema: config_schema })

export { store, config }
