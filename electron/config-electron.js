const Config = require('electron-store')

const schema = {
  server: {
    type: 'string'
    //format: 'url'
  },
  email: {
    type: 'string'
    //format: 'email'
  },
  token: {
    type: 'string'
  }
}
module.exports = new Config({
  schema: schema
})
