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
        <input class="form-control">
      </div>
      <div class="form-group">
        <label class="font-weight-bold">日時</label>
        <div class="d-flex align-items-center">
          <input class="form-control" type="date">
          <span class="mx-2">~</span>
          <input class="form-control" type="date">
        </div>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-outline-light mr-3" @click="close">キャンセル</button>
        <button class="btn btn-secondary" @click="register">保存</button>
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
    methods: {
      register(){
        this.$emit('close-modal')
      },
      close(){
        this.$emit('close-modal')
      }
    }
  }
</script>
