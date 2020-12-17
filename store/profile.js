export const state = () => ({
  profile: {}
})

export const getters = {
  profile: (state) => state.profile
}

export const mutations = {
  setProfile(state, payload) {
    state.profile = payload
  }
}

export const actions = {
  /*
  プロフィールを取得する
  */
  async fetch({ commit }) {

    const { data, error } = await this.$http().get(
      '/users/profile'
    )

    if (error) {
      throw new Error('プロフィールの取得に失敗しました')
    }

    commit('setProfile', data)
  },
}
