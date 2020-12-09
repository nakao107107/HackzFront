export const state = () => ({
  meetings: []
})

export const getters = {
  meetings: (state) => state.meetings
}

export const mutations = {
  setMeetings(state, payload) {
    state.meetings = []
    state.meetings.push(...payload)
  }
}

export const actions = {
  /*
  meeting一覧を取得する
  */
  async fetch({ commit }) {

    const { data, error } = await this.$http().get(
      '/meetings'
    )

    if (error) {
      throw new Error('ミーティング一覧の取得に失敗しました')
    }

    commit('setMeetings', data)
  },
}
