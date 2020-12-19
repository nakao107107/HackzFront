export const state = () => ({
  isLoggedIn: false,
})

export const mutations = {
  setLoginStatus(state, payload) {
    state.isLoggedIn = payload
  },
  setToken(state, payload) {
    this.$cookies.set('token', payload, { path: '/' })
  }
}

export const actions = {
  async login({ commit }, payload) {
    const { data, error } = await this.$http().post('/users/login', payload)

    if (error) {
      throw new Error('ログインに失敗しました')
    }

    commit('setToken', data.access_token)
    commit('setLoginStatus', true)
  },

  async signup({ commit }, payload) {
    const { data, error } = await this.$http().post('/users/signup', payload)

    if (error) {
      throw new Error('新規登録に失敗しました')
    }

    commit('setToken', data.access_token)
    commit('setLoginStatus', true)
  },

  getToken(){
    return this.$cookies.get('token')
  }
}
