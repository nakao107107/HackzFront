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
          v-for="attendee in attendees"
          :id="`video-container-${attendee}`"
          :key="attendee"
          class="justify-content-center align-items-center p-2"
          :class="status.isSharingOn ? 'w-100 h-25' : `attendee-num-${attendees.length}`"
        >
          <video
            :id="`video-preview-${attendee}`"
            class="w-100 h-100"
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
        },
        attendees: []
      }
    },
    async mounted() {
      this.meetingSession = await this.$store.dispatch(
        'meetings/room/fetch',
        this.$route.params.id
      )

      //attendee専用のobserver
      const attendeeObserver = {
        videoTileDidUpdate: (tileState) => {
          if (!tileState.boundExternalUserId) {
            return
          }
          if(tileState.isContent){
            return
          }

          let videoElement = null
          const tileId = tileState.tileId
          videoElement = document.getElementById(`video-preview-${tileState.boundAttendeeId}`)
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
        if (present) {
          this.attendees.push(presentAttendeeId)
        } else {
          //退出処理
          this.attendees = this.attendees.filter(
            (attendee) => attendee != presentAttendeeId
          )
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
      this.audioDevices = await this.meetingSession.audioVideo.listAudioOutputDevices()
      this.selectedAudioDevice = this.audioDevices[0].deviceId

      const audioElement = document.getElementById('audio')
      this.meetingSession.audioVideo.bindAudioElement(audioElement)
      this.meetingSession.audioVideo.addObserver(attendeeObserver)
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
