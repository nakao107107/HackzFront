export const state = () => ({
  meeting: {}
})

export const getters = {
  meeting: (state) => state.meeting
}

export const mutations = {
  setMeeting(state, payload) {
    state.meeting = {}
    state.meeting = payload
  }
}

export const actions = {
  /*
  meeting詳細を取得する
  */
  async fetch({ commit }, meetingId) {

    const { data, error } = await this.$http().get(
      `/meetings/${meetingId}`
    )
    if (error) {
      throw new Error('ミーティングの取得に失敗しました')
    }

    commit('setMeeting', data)
  },
  /*
  meetingを作成する
  */
  async register(ctx, input) {
    const { error } = await this.$http().post(
      '/meetings',
      input
    )

    if (error) {
      throw new Error('ミーティング作成に失敗しました')
    }
  },

  /*
  meetingに参加
   */
  async attend(ctx, meetingId) {
    const { error } = await this.$http().post(
      `/meetings/${meetingId}/attend`
    )

    if (error) {
      throw new Error('ミーティング参加に失敗しました')
    }
  },

}
