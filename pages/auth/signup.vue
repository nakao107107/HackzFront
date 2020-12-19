<template>
  <div class="vw-100 vh-100 bg-dark d-flex justify-content-center align-items-center">
    <div v-if="status.isSubmitting" class="text-center">
      <span class="d-block mb-1">接続しています</span>
      <h2 class="fas fa-spinner fa-spin"></h2>
    </div>
    <div class="login-form" v-else>
      <div class="d-flex justify-content-between">
        <h5 class="font-weight-bold text-white">サイン アップ</h5>
        <nuxt-link to="/auth/login" class="text-secondary font-weight-bold">すでにアカウントをお持ちですか？</nuxt-link>
      </div>
      <div class="form-group">
        <label>email</label>
        <input
          type="text"
          class="form-control text-white"
          :class="{'error': status.isError}"
          v-model="input.email"
          placeholder="メール"
        >
      </div>
      <div class="form-group">
        <label>password</label>
        <input
          type="password"
          class="form-control text-white"
          :class="{'error': status.isError}"
          v-model="input.password"
          placeholder="パスワード"
        >
      </div>
      <span class="text-danger mb-2" v-if="status.isError">電子メールまたはパスワードが正しくありません</span>
      <div class="form-group text-right">
        <button class="btn btn-secondary font-weight-bold" @click="signup">サイン アップ</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    layout: 'login',
    data(){
      return {
        status: {
          isSubmitting: false,
          isError: false
        },
        input: {
          email: '',
          password: ''
        }
      }
    },
    methods: {
      async signup() {
        this.status.isSubmitting = true
        try {
          await this.$store.dispatch('auth/signup', this.input)
          this.$router.push('/auth/registername')
        } catch (e) {
          this.status.isError = true
          this.status.isSubmitting = false
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .login-form {
    width: 500px;
  }

  .error {
    border: 1px solid $danger;
  }
</style>
