import axios from 'axios'

class Http {
  constructor(axios, responseBuilder, ctx, url, headers) {
    this._axios = axios
    this._responseBuilder = responseBuilder
    this._ctx = ctx
    this._url = url
    this._headers = headers
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
    //urlが指定されていた場合そちらを採用, なければAPIのBASE_URLを採用
    if (this._url) {
      options.baseURL = this._url
    } else {
      options.baseURL = process.env.API_URL
    }

    //headerが指定されていた場合そちらを採用, なければAuthorizationを添付
    if (_.isEmpty(this._headers)) {
      const token = await this._ctx.store.dispatch('auth/getToken')
      const headers = {
        Authorization: token,
      }
      options.headers = headers
    } else {
      options.headers = this._headers
    }
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
  inject('http', (url = null, headers = {}) => {
    const client = axios.create()
    return new Http(client, (res) => new Response(res), ctx, url, headers)
  })
}
