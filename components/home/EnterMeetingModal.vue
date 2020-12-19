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
        <input
          class="form-control"
          :class="{'error': status.isError}"
          placeholder="会議室ID"
          v-model="meetingId"
        />
        <span class="text-danger mb-2" v-if="status.isError">入室に失敗しました。MeetingIDを確認して下さい。</span>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-outline-light mr-3" @click="close">キャンセル</button>
        <button
          class="btn btn-secondary"
          @click="enter"
          :disabled="status.isEntering"
        >
          <i class="fas fa-spinner fa-spin mr-1" v-if="status.isEntering"></i>
          参加
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
        status: {
          isError: false,
          isEntering: false
        },
        meetingId: ''
      }
    },
    methods: {
      async enter(){
        this.status.isEntering = true
        try {
          await this.$store.dispatch('meetings/detail/attend', this.meetingId)
          this.$router.push(`/meetings/${this.meetingId}/view`)
        }catch(e){
          this.status.isError = true
        }
        this.status.isEntering = false
      },
      close(){
        this.meetingId = ''
        this.status.isError = false
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
