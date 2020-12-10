export const actions = {
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
  クラウド上で部屋を作成
   */
  async createRoom(ctx, meetingId) {
    const { error } = await this.$http().post(
      `/meetings/${meetingId}/room`,
    )
    if (error) {
      throw new Error('ミーティングルーム作成に失敗しました')
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
