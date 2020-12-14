<template>
  <div class="bg-dark vh-100 vw-100">
    <audio id="audio"/>
    <div class="video-container d-flex">
      <div
        class="w-75 h-100"
        :class="status.isSharingOn ? 'd-block' : 'd-none'"
      >
        <video id="share" class="w-100 h-100" style="object-fit: contain"/>
      </div>
      <div
        class="h-100"
        :class="status.isSharingOn ? 'w-25' : 'row w-100'"
      >
        <div
          id="`video-container-1"
          class="justify-content-center align-items-center p-2"
          :class="[
            videoTileInfo.find(tile => tile.tileNum == 1 && tile.attendeeId != '') ? 'd-flex' : 'd-none',
            status.isSharingOn ? 'w-100 h-25' : `attendee-num-${attendeeNum}`
          ]"
        >
          <video
            id="video-preview-1"
            class="w-100"
          />
        </div>
        <div
          id="`video-container-2"
          class="justify-content-center align-items-center p-2"
          :class="[
            videoTileInfo.find(tile => tile.tileNum == 2 && tile.attendeeId != '') ? 'd-flex' : 'd-none',
            `attendee-num-${attendeeNum}`
          ]"
        >
          <video
            id="video-preview-2"
            class="w-100"
          />
        </div>
        <div
          id="`video-container-3"
          class="justify-content-center align-items-center p-2"
          :class="[
            videoTileInfo.find(tile => tile.tileNum == 3 && tile.attendeeId != '') ? 'd-flex' : 'd-none',
            `attendee-num-${attendeeNum}`
          ]"
        >
          <video
            id="video-preview-3"
            class="w-100"
          />
        </div>
        <div
          id="`video-container-4"
          class="justify-content-center align-items-center p-2"
          :class="[
            videoTileInfo.find(tile => tile.tileNum == 4 && tile.attendeeId != '') ? 'd-flex' : 'd-none',
            `attendee-num-${attendeeNum}`
          ]"
        >
          <video
            id="video-preview-4"
            class="w-100"
          />
        </div>
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
          isPaused: false,
        },
        videoTileInfo: [
          {tileNum: 1, tileId: '', attendeeId: '', isVideoOn: false},
          {tileNum: 2, tileId: '', attendeeId: '', isVideoOn: false},
          {tileNum: 3, tileId: '', attendeeId: '', isVideoOn: false},
          {tileNum: 4, tileId: '', attendeeId: '', isVideoOn: false}
        ]
      }
    },
    async mounted() {
      this.meetingSession = await this.$store.dispatch(
        'meetings/room/fetch',
        this.$route.params.id
      )

      //attendee専用のobserver
      const attendeeObserver = {
        videoTileDidUpdate: async (tileState) => {
          if (!tileState.boundExternalUserId) {
            return
          }
          if(tileState.isContent){
            return
          }

          let targetTile = this.videoTileInfo.find((tile) => tile.attendeeId == tileState.boundAttendeeId)
          if(! targetTile){
            //空いているタイルの検索
            targetTile = this.videoTileInfo.find((tile) => tile.attendeeId == '')
            if(! targetTile){
              console.log('このミーティングは満席です')
              return
            }
          }
          //空いているタイルにattendeeをbind
          targetTile.attendeeId = tileState.boundAttendeeId
          targetTile.tileId = tileState.tileId
          let videoElement = null
          videoElement = document.getElementById(`video-preview-${targetTile.tileNum}`)
          this.meetingSession.audioVideo.bindVideoElement(targetTile.tileId, videoElement)
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
          console.log("画面共有")
          this.status.isSharingOn = true
        },
        //自分の画面共有停止時
        contentShareDidStop: () => {
          console.log("画面共有停止")
          this.status.isSharingOn = false
        },
        //他人の画面共有停止時
        videoTileWasRemoved: (tileId) => {
          if (this.contentShareTileId == tileId) {
            this.status.isSharingOn = false
          }
        },
      }

      //入退出処理
      const callback = async (presentAttendeeId, present) => {
        let targetTile = this.videoTileInfo.find((tile) => tile.attendeeId == presentAttendeeId)
        if (present) {
          //contentの場合return
          if(presentAttendeeId.includes('#content')){
            return
          }
          console.log("新しいspeaker")
          if(! targetTile){
            //空いているタイルの検索
            targetTile = this.videoTileInfo.find((tile) => tile.attendeeId == '')
            if(! targetTile){
              console.log('このミーティングは満席です')
              return
            }
          }
          //空いているタイルにattendeeをbind
          targetTile.attendeeId = presentAttendeeId
          targetTile.tileId = 0
        } else {
          if(targetTile){
            targetTile.tileId = 0
            targetTile.attendeeId = ''
          }
        }
      }
      this.meetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence(
        callback
      )

      this.videoDevices = await this.meetingSession.audioVideo.listVideoInputDevices()
      this.selectedVideoDevice = this.videoDevices[0].deviceId
      await this.meetingSession.audioVideo.chooseVideoInputDevice(
        this.selectedVideoDevice
      )
      this.micDevices = await this.meetingSession.audioVideo.listAudioInputDevices()
      this.selectedMicDevice = this.micDevices[0].deviceId
      await this.meetingSession.audioVideo.chooseAudioInputDevice(
        this.selectedMicDevice
      )
      this.audioDevices = await this.meetingSession.audioVideo.listAudioOutputDevices()
      this.selectedAudioDevice = this.audioDevices[0].deviceId
      await this.meetingSession.audioVideo.chooseAudioOutputDevice(
        this.selectedAudioDevice
      )

      const audioElement = document.getElementById('audio')
      this.meetingSession.audioVideo.bindAudioElement(audioElement)
      this.meetingSession.audioVideo.addObserver(attendeeObserver)
      this.meetingSession.audioVideo.addObserver(shareObserver)
      this.meetingSession.audioVideo.addContentShareObserver(shareObserver)
      this.meetingSession.audioVideo.startLocalVideoTile()
      this.meetingSession.audioVideo.start()
    },

    computed: {
      attendeeNum(){
        return this.videoTileInfo.filter(tile => tile.attendeeId != '').length
      }
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .video-container {
    height: calc(100% - 40px);
  }
  .footer-menu {
    background: $dark;
    height: 40px;
  }
  .attendee-num {
    &-1 {
      width: 100%;
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
