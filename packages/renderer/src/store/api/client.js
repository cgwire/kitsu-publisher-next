import superagent from 'superagent'
import errors from '../../lib/errors'
import store from '../../store'

const client = {
  get(path, callback) {
    superagent
      .get(`${store.state.login.server}${path}`)
      .auth(store.state.login.access_token, { type: 'bearer' })
      .end((err, res) => {
        // if (res.statusCode === 401) return errors.backToLogin()
        callback(err, res.body)
      })
  },

  post(path, data, callback) {
    superagent
      .post(`${store.state.login.server}${path}`)
      .auth(store.state.login.access_token, { type: 'bearer' })
      .send(data)
      .end((err, res) => {
        if (res.statusCode === 401) return errors.backToLogin()
        callback(err, res.body)
      })
  },

  put(path, data, callback) {
    superagent
      .put(`${store.state.login.server}${path}`)
      .auth(store.state.login.access_token, { type: 'bearer' })
      .send(data)
      .end((err, res) => {
        if (res.statusCode === 401) return errors.backToLogin()
        callback(err, res.body)
      })
  },

  del(path, callback) {
    superagent
      .del(`${store.state.login.server}${path}`)
      .auth(store.state.login.access_token, { type: 'bearer' })
      .end((err, res) => {
        if (res.statusCode === 401) return errors.backToLogin()
        callback(err, res.body)
      })
  },

  pget(path) {
    return new Promise((resolve, reject) => {
      client.get(path, (err, model) => {
        if (err) reject(err)
        else resolve(model)
      })
    })
  },

  ppost(path, data, callback) {
    return new Promise((resolve, reject) => {
      superagent
        .post(`${store.state.login.server}${path}`)
        .auth(store.state.login.access_token, { type: 'bearer' })
        .send(data)
        .end((err, res) => {
          if (res.statusCode === 401) {
            errors.backToLogin()
            reject(err)
          } else {
            if (err) reject(err)
            else resolve(res.body)
          }
        })
    })
  },

  pput(path, data, callback) {
    return new Promise((resolve, reject) => {
      superagent
        .put(`${store.state.login.server}${path}`)
        .auth(store.state.login.access_token, { type: 'bearer' })
        .send(data)
        .end((err, res) => {
          if (res.statusCode === 401) {
            errors.backToLogin()
            reject(err)
          } else {
            if (err) reject(err)
            else resolve(res.body)
          }
        })
    })
  },

  pdel(path, callback) {
    return new Promise((resolve, reject) => {
      superagent
        .del(`${store.state.login.server}${path}`)
        .auth(store.state.login.access_token, { type: 'bearer' })
        .end((err, res) => {
          if (res.statusCode === 401) {
            errors.backToLogin()
            reject(err)
          } else {
            if (err) reject(err)
            else resolve(res.body)
          }
        })
    })
  },

  getModel(modelName, modelId) {
    const path = `/api/data/${modelName}/${modelId}`
    return client.pget(path)
  },

  getEvents(after, before) {
    const path = `/api/data/events/last?after=${after}&before=${before}&page_size=100000`
    return client.pget(path)
  },

  getBlob(path, callback) {
    superagent
      .get(`${store.state.login.server}${path}`)
      .auth(store.state.login.access_token, { type: 'bearer' })
      .responseType('blob')
      .end((err, res) => {
        // if (res.statusCode === 401) return errors.backToLogin()
        callback(err, res.body)
      })
  }
}

export default client
