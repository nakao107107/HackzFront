<template>
  <div>
    <template v-if="error.statusCode === 404">
      <div class="position-relative">
        <div
          class="position-absolute vw-100 vh-100 bg-secondary bg-opacity-70"
        />
        <div
          class="position-absolute vw-100 vh-100 d-flex justify-content-center align-items-center"
        >
          <div class="text-center text-white">
            <h1 class="font-weight-bold mb-4">
              Oops!
              <br />
              ご指定のページが見つかりませんでした
            </h1>
            <h5 class="mb-5">
              リンクに問題があるか、ページが削除された可能性があります
            </h5>
            <nuxt-link to="/" class="btn btn-light">
              トップページに戻る
            </nuxt-link>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="position-relative">
        <img
          src="https://bizibl-production.s3-ap-northeast-1.amazonaws.com/systems/500_background.png"
          alt="404_background"
          class="position-absolute vw-100 vh-100"
        />
        <div
          class="position-absolute vw-100 vh-100 bg-secondary bg-opacity-70"
        />
        <div
          class="position-absolute vw-100 vh-100 d-flex justify-content-center align-items-center"
        >
          <div class="text-center text-white">
            <h1 class="font-weight-bold mb-4">
              Oops!
              <br />
              サーバーがエラーを検出したため、実行することが出来ませんでした
            </h1>
            <h5 class="mb-5">
              しばらく時間をおいてからもう一度アクセスして頂くか、管理者にお問い合わせください。
            </h5>
            <nuxt-link to="/" class="btn btn-light">
              トップページに戻る
            </nuxt-link>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      error: {
        type: Object,
        isRequired: true,
        default: () => {},
      },
    },
    layout: 'error_layout',
  }
</script>
