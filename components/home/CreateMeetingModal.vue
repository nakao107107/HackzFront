<template>
  <BModal
    v-model="isModalOpen"
    size="md"
    hide-footer
    hide-header
    centered
    no-close-on-backdrop
  >
    <div class="p-4">
      <h5 class="font-weight-bold">ミーティングをスケジューリング</h5>
      <div class="form-group">
        <label class="font-weight-bold">トピック</label>
        <input
          class="form-control"
          :class="{'error': status.isError}"
          v-model="input.topic"
          placeholder="トピックを入力してください"
        >
        <span class="text-danger mb-2" v-if="status.isError">トピックは必須です</span>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-outline-light mr-3" @click="close">キャンセル</button>
        <button class="btn btn-secondary" @click="register" :disabled="status.isSaving">
          <i class="fas fa-spinner fa-spin" v-if="status.isSaving"></i>
          保存
        </button>
      </div>
    </div>
  </BModal>
</template>

<script>
  export default {
    props: {
      isModalOpen: {
        type: Boolean,
        required: true
      }
    },
    data(){
      return {
        input: {
          topic: ''
        },
        status: {
          isError: false,
          isSaving: false
        }
      }
    },
    methods: {
      async register(){
        //トピックがからの時はreturn
        if(!this.input.topic){
          this.status.isError = true
          return
        }
        this.status.isSaving = true
        await this.$store.dispatch('meetings/detail/register', this.input)
        await this.$store.dispatch('meetings/list/fetch')
        this.status.isSaving = false
        this.$emit('close-modal')
      },
      close(){
        this.status.isError = false
        this.topic = ''
        this.$emit('close-modal')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .error {
    border: 1px solid $danger;
  }
</style>
