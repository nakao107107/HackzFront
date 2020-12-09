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
}
