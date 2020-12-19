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
        <button class="btn btn-secondary mr-2" @click="save">保存</button>
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
        meetingId: ''
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
        const filePath = await this.$store.dispatch('file/upload', params)
        console.log(filePath)
        this.$emit('file-saved', filePath)
        this.$emit('close-modal')
      }
    }
  }
</script>
