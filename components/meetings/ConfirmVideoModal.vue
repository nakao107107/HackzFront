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
      <span class="d-block mb-3">こちらの動画が繰り返されます</span>
      <video :src="blobUrl" class="mb-3" width="100%" autoplay loop muted></video>
      <div class="d-flex justify-content-end">
        <button class="btn btn-outline-light mr-2" @click="cancel">キャンセル</button>
        <button class="btn btn-secondary mr-2" @click="save" :disabled="status.isSaving">
          <i class="fas fa-spinner fa-spin mr-1" v-if="status.isSaving"></i>
          保存
        </button>
      </div>
    </div>
  </BModal>
</template>

<script>
  import firebase from "firebase";
  import { mapGetters } from 'vuex'

  export default {
    props: {
      isModalOpen: {
        type: Boolean,
        required: true
      },
      blob: {
        required: true
      },
      blobUrl: {
        required: true
      },
    },
    data(){
      return {
        meetingId: '',
        status: {
          isSaving: false
        }
      }
    },
    computed: {
      ...mapGetters('profile', ['profile'])
    },
    methods: {
      async cancel(){
        this.$emit('close-modal')
        this.$emit('canceled')
      },
      async save(){
        let reader = new FileReader()
        await reader.readAsArrayBuffer(this.blob)
        reader.onload = async (e) => {
          const params = {
            dir: 'meetings/',
            file: reader.result
          }
          await this.uploadFile(params)
        }
      },
      async uploadFile(params){
        this.status.isSaving = true
        const filePath = await this.$store.dispatch('file/upload', params)
        this.status.isSaving = false
        this.$emit('file-saved', filePath)
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
