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
      <h5 class="font-weight-bold">ミーティングに参加</h5>
      <div class="form-group">
        <input class="form-control" placeholder="会議室ID" />
      </div>
      <div class="form-group">
        <input class="form-control" placeholder="名前" />
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-outline-light mr-3" @click="close">キャンセル</button>
        <button class="btn btn-secondary" @click="enter">参加</button>
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
      enter(){
        this.$emit('close-modal')
      },
      close(){
        this.$emit('close-modal')
      }
    }
  }
</script>
