<template>
  <div class="bg-dark vh-100 vw-100">
    <audio id="audio"/>
    <div class="video-container d-flex">
      <div
        class="w-75 h-100 container"
        :class="status.isSharingOn ? 'd-block' : 'd-none'"
      >
        <video id="share" width="w-100 h-100" />
      </div>
      <div
        :class="status.isSharingOn ? 'w-25' : 'w-100'"
      >
        <video id="video" class="w-100"/>
      </div>
    </div>
    <div class="footer-menu d-flex justify-content-between">
      <div class="d-flex">
        <button class="btn" @click="switchMicStatus">
          <i class="fas fa-microphone text-white" v-if="status.isMicOn"></i>
          <i class="fas fa-microphone-slash text-white" v-else></i>
        </button>
        <button class="btn" @click="switchVideoStatus">
          <i class="fas fa-video text-white" v-if="status.isVideoOn"></i>
          <i class="fas fa-video-slash text-white" v-else></i>
        </button>
      </div>
      <button class="btn" @click="switchSharingStatus">
        <i class="fas fa-desktop text-success"></i>
      </button>
      <button class="btn btn-sm btn-danger">終了</button>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        meetingSession: null,
        videoDevices: [],
        selectedVideoDevice: '',
        micDevices: [],
        selectedMicDevice: '',
        audioDevices: [],
        selectedAudioDevice: '',
        status: {
          isMicOn: true,
          isVideoOn: true,
          isSharingOn: false,
        }
      }
    },
    async mounted() {
      this.meetingSession = await this.$store.dispatch(
        'meetings/room/fetch',
        this.$route.params.id
      )

      //localTile専用のobserver
      const localObserver = {
        videoTileDidUpdate: (tileState) => {
          if (!tileState.boundExternalUserId) {
            return
          }
          if (!tileState.localTile) {
            return
          }
          let videoElement = null
          const tileId = tileState.tileId
          videoElement = document.getElementById('video')
          this.meetingSession.audioVideo.bindVideoElement(tileId, videoElement)
        },
      }

      const shareObserver = {
        videoTileDidUpdate: (tileState) => {
          //content share用のスクリーンでなければreturn
          if (!tileState.boundAttendeeId || !tileState.isContent) {
            return
          }
          const videoElement = document.getElementById('share')
          this.meetingSession.audioVideo.bindVideoElement(
            tileState.tileId,
            videoElement
          )
          if (!tileState.localTile) {
            this.contentShareTileId = tileState.tileId
            this.status.isSharingOn = true
          }
        },
        //自分の画面共有開始時
        contentShareDidStart: () => {
          this.status.isSharingOn = true
        },
        //自分の画面共有停止時
        contentShareDidStop: () => {
          this.status.isSharingOn = false
        },
        //他人の画面共有停止時
        videoTileWasRemoved: (tileId) => {
          if (this.contentShareTileId == tileId) {
            this.status.isSharingOn = false
          }
        },
      }

      this.videoDevices = await this.meetingSession.audioVideo.listVideoInputDevices()
      this.selectedVideoDevice = this.videoDevices[0].deviceId
      await this.meetingSession.audioVideo.chooseVideoInputDevice(
        this.selectedVideoDevice
      )
      this.micDevices = await this.meetingSession.audioVideo.listAudioInputDevices()
      this.selectedMicDevice = this.micDevices[0].deviceId
      this.audioDevices = await this.meetingSession.audioVideo.listAudioOutputDevices()
      this.selectedAudioDevice = this.audioDevices[0].deviceId

      const audioElement = document.getElementById('audio')
      this.meetingSession.audioVideo.bindAudioElement(audioElement)
      this.meetingSession.audioVideo.addObserver(localObserver)
      this.meetingSession.audioVideo.addObserver(shareObserver)
      this.meetingSession.audioVideo.addContentShareObserver(shareObserver)
      this.meetingSession.audioVideo.startLocalVideoTile()
      this.meetingSession.audioVideo.start()
    },

    methods: {
      async switchVideoStatus(){
        await this.meetingSession.audioVideo.chooseVideoInputDevice(
          this.selectedVideoDevice
        )
        if (this.status.isVideoOn) {
          //videoがオンの時
          this.meetingSession.audioVideo.stopLocalVideoTile()
          this.status.isVideoOn = false
        } else {
          //videoがオフの時
          this.meetingSession.audioVideo.startLocalVideoTile()
          this.status.isVideoOn = true
        }
      },
      switchMicStatus(){
        if (this.status.isMicOn) {
          //マイクがオンの時
          this.meetingSession.audioVideo.realtimeMuteLocalAudio()
          this.status.isMicOn = false
        } else {
          //マイクがオフの時
          this.meetingSession.audioVideo.realtimeUnmuteLocalAudio()
          this.status.isMicOn = true
        }
      },
      switchSharingStatus() {
        this.status.screenShare = !this.status.screenShare
        if (this.status.isSharingOn) {
          //画面シェア状態のとき
          this.meetingSession.audioVideo.stopContentShare()
        } else {
          //画面シェアがオフの時
          this.meetingSession.audioVideo.startContentShareFromScreenCapture()
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .video-container {
    height: calc(100% - 40px);
  }
  .footer-menu {
    height: 40px;
  }
  .attendee-num {
    &-1 {
      width: 75%;
      height: 100%;
    }
    &-2 {
      width: 50%;
      height: 100%;
    }
    &-3 {
      width: 50%;
      height: 50%;
    }
    &-4 {
      width: 50%;
      height: 50%;
    }
  }
</style>
