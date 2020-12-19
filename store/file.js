export const actions = {
  /*
  ファイルのアップロードを行い、アップロード後のパスを返す
  */
  async upload({ dispatch }, params) {
    const presignedUrl = await dispatch('getPresignedUrl', params)

    //動画のアップロード
    let { error } = await this.$http(presignedUrl, {
      'Content-Type': 'video/webm',
    }).put('', params.file)

    if (error) {
      throw new Error('ファイルのアップロードに失敗しました')
    }

    const filePath = decodeURI(new URL(presignedUrl).pathname.slice(1))

    return filePath
  },

  //s3 upload用のpresigned_urlを取得
  async getPresignedUrl(ctx, params) {
    const input = {
      dir: params.dir,
      file_name: 'test.webm',
    }
    //presigned urlを取得
    let { data, error } = await this.$http().get(
      '/files/presigned-url',
      input
    )

    if (error) {
      throw new Error('動画のアップロードに失敗しました')
    }

    return data.presigned_url
  },
}
