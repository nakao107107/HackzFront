import axios from 'axios'

class Http {
  constructor(axios, responseBuilder, ctx) {
    this._axios = axios
    this._responseBuilder = responseBuilder
    this._ctx = ctx
  }

  get(url, params, options = {}) {
    return this.request(
      Object.assign(
        {
          method: 'GET',
          url,
          params,
        },
        options
      )
    )
  }

  post(url, data, options = {}) {
    return this.request(
      Object.assign(
        {
          method: 'POST',
          url,
          data,
        },
        options
      )
    )
  }

  put(url, data, options = {}) {
    return this.request(
      Object.assign(
        {
          method: 'PUT',
          url,
          data,
        },
        options
      )
    )
  }

  delete(url, data, options = {}) {
    return this.request(
      Object.assign(
        {
          method: 'DELETE',
          url,
          data,
        },
        options
      )
    )
  }

  async request(options) {
    const token = await this._ctx.store.dispatch('auth/getToken')
    const headers = {
      Authorization: token,
    }
    options.baseURL = process.env.API_URL
    options.headers = headers
    const response = await this._axios(options).catch((err) => err.response)
    return this._responseBuilder(response)
  }
}

class Response {
  constructor(response) {
    this._rawResponse = response
    this._expectStatus = [200, 201, 202, 203, 204]
    this._buildResponse()
    return this
  }

  _buildResponse() {
    const { status, headers, data } = this._rawResponse || {} // network_errorとかの場合responseはundefinedになる
    this.status = status
    this.headers = headers
    this.data = data
  }

  get error() {
    return !this._expectStatus.includes(this.status)
  }
}

export default (ctx, inject) => {
  inject('http', () => {
    const client = axios.create()
    return new Http(client, (res) => new Response(res), ctx)
  })
}
