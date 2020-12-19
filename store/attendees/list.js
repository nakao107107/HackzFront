export const state = () => ({
  attendees: []
})

export const getters = {
  attendees: (state) => state.attendees
}

export const mutations = {
  setAttendees(state, payload) {
    state.attendees = []
    state.attendees.push(...payload)
  }
}

export const actions = {
  /*
  参加者一覧を取得する
  */
  async fetch({ commit }, meetingId) {

    const { data, error } = await this.$http().get(
      `/meetings/${meetingId}/attendees`
    )

    if (error) {
      throw new Error('参加者一覧の取得に失敗しました')
    }

    commit('setAttendees', data)
  },
}
