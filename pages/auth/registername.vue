<template>
  <div class="vw-100 vh-100 bg-dark d-flex justify-content-center align-items-center">
    <div v-if="status.isSubmitting" class="text-center">
      <span class="d-block mb-1">名前の登録中</span>
      <h2 class="fas fa-spinner fa-spin"></h2>
    </div>
    <div class="login-form" v-else>
      <h5 class="font-weight-bold text-white mb-3">基本情報登録</h5>
      <div class="form-group">
        <label for="">氏名</label>
        <input
          type="text"
          class="form-control text-white"
          v-model="input.name"
          placeholder="使用する名前を入力して下さい"
        >
      </div>
      <div class="form-group">
        <label for="">プラン</label>
        <select
          class="form-control text-white"
          v-model="input.plan"
        >
          <option value="student">学生</option>
          <option value="teacher">教師</option>
        </select>
      </div>
      <div class="form-group text-right">
        <button class="btn btn-secondary font-weight-bold" @click="registerName">登録</button>
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
          name: '',
          plan: 'teacher'
        }
      }
    },
    methods: {
      async registerName() {
        if(!this.input.name || !this.input.plan){
          status.isError = true
          return
        }
        this.status.isSubmitting = true
        try {
          await this.$store.dispatch('auth/registerName', this.input)
          this.$router.push('/')
        } catch (e) {
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
