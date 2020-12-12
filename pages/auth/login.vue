<template>
  <div class="vw-100 vh-100 bg-dark d-flex justify-content-center align-items-center">
    <div v-if="status.isSubmitting" class="text-center">
      <span class="d-block mb-1">接続しています</span>
      <h2 class="fas fa-spinner fa-spin"></h2>
    </div>
    <div class="login-form" v-else>
      <h5 class="font-weight-bold text-white">サイン イン</h5>
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
        <button class="btn btn-secondary font-weight-bold" @click="login">サイン イン</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
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
      async login() {
        this.status.isSubmitting = true
        try {
          await this.$store.dispatch('auth/login', this.input)
          this.$router.push('/')
        } catch (e) {
          console.log(e)
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
