import superagent from 'superagent'
import errors from '@/lib/errors'
import store from '@/store'

const client = {
  get(path, callback) {
    superagent.get(`${store.state.login.server}${path}`).end((err, res) => {
      // if (res.statusCode === 401) return errors.backToLogin()
      callback(err, res.body)
    })
  },

  post(path, data, callback) {
    superagent
      .post(`${store.state.login.server}${path}`)
      .send(data)
      .end((err, res) => {
        if (res.statusCode === 401) return errors.backToLogin()
        callback(err, res.body)
      })
  },

  put(path, data, callback) {
    superagent
      .put(`${store.state.login.server}${path}`)
      .send(data)
      .end((err, res) => {
        if (res.statusCode === 401) return errors.backToLogin()
        callback(err, res.body)
      })
  },

  del(path, callback) {
    superagent.del(`${store.state.login.server}${path}`).end((err, res) => {
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

  ppostFile(path, data, callback) {
    const request = superagent
      .post(`${store.state.login.server}${path}`)
      .send(data)
      .on('progress', (e) => e)
    return {
      request,
      promise: new Promise((resolve, reject) => {
        request.end((err, res) => {
          if (res.statusCode === 401) {
            errors.backToLogin()
            return reject(err)
          } else {
            if (err) return reject(err)
            else return resolve(res.body)
          }
        })
      })
    }
  },

  pput(path, data, callback) {
    return new Promise((resolve, reject) => {
      superagent
        .put(`${store.state.login.server}${path}`)
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
      superagent.del(`${store.state.login.server}${path}`).end((err, res) => {
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

  getModel(modelName, modelId, relations = false) {
    let path = `/api/data/${modelName}/${modelId}`
    if (relations) path += '?relations=true'
    return client.pget(path)
  },

  getEvents(after, before) {
    const path = `/api/data/events/last?after=${after}&before=${before}&page_size=100000`
    return client.pget(path)
  },

  searchData(query) {
    const path = '/api/data/search'
    return client.ppost(path, { query })
  }
}

export default client
