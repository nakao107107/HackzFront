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
      <video :src="blobUrl" width="100%" autoplay loop muted></video>
      <button class="btn btn-secondary" @click="close">参加</button>
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
      async close(){
        let reader = new FileReader()
        console.log(this.blob)
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
        //データ送信
        this.sendMovie(filePath)
        this.$emit('close-modal')
      },
      sendMovie(filePath){
        firebase
          .database()
          .ref('repeat')
          .push(
            {
              session_id: this.$route.params.id,
              mode: true,
              user_id: this.profile.id,
              url: `https://hackz.s3-ap-northeast-1.amazonaws.com/${filePath}`
            },
            () => {}
          )
      }
    }
  }
</script>
