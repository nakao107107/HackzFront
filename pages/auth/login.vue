<template>
  <div>
    <div class="form-group">
      <label>email</label>
      <input type="text" class="form-control" v-model="input.email">
    </div>
    <div class="form-group">
      <label>password</label>
      <input type="password" class="form-control" v-model="input.password">
    </div>
    <div class="form-group">
      <button class="btn btn-secondary" @click="login">ログイン</button>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        input: {
          email: '',
          password: ''
        }
      }
    },
    methods: {
      async login() {
        try {
          await this.$store.dispatch('auth/login', this.input)
          this.$router.push('/')
        } catch (e) {
          throw new Error(e)
        }
      },
    }
  }
</script>
