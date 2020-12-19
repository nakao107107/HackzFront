<template>
  <div class="bg-dark vh-100 vw-100">
    <ConfirmVideoModal
      :blob="blob"
      :blob-url="blobUrl"
      :is-modal-open="status.isModalOpen"
      @file-saved="saveFile"
      @close-modal="status.isModalOpen = false"
      @canceled="resetBlob"
    />
    <canvas id="canvas" class="d-none" width="960px" height="540px"/>
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
        :class="status.isSharingOn ? 'w-25 d-flex flex-column justify-content-center' : 'row m-0 p-0 w-100'"
      >
        <div
          id="video-container-1"
          class="justify-content-center align-items-center p-2"
          :class="[
            videoTileInfo.find(tile => tile.tileNum == 1 && tile.attendeeId != '') ? 'd-flex' : 'd-none',
            status.isSharingOn ? 'w-100 h-25' : `attendee-num-${attendeeNum}`
          ]"
        >
          <video
            id="video-preview-1"
            class="w-100"
            :class="[
              videoTileInfo.find(tile => tile.tileNum == 1).isLoading || videoTileInfo.find(tile => tile.tileNum == 1).isRepeating ? 'd-none' : 'd-block',
            ]"
          />
          <div
            :class="videoTileInfo.find(tile => tile.tileNum == 1).isLoading ? 'd-block' : 'd-none'"
            class="position-relative"
          >
            <img
              id="video-preview-1-loading"
              class="w-100"
              style="object-fit: contain"
            >
            <div class="position-absolute top-0 left-0 w-100 h-100 bg-dark d-flex justify-content-center align-items-center" style="opacity: .7">
              <div class="text-white text-center">
                <h5>接続中....</h5>
                <h1 class="fas fa-spinner fa-spin"></h1>
              </div>
            </div>
          </div>
          <div
            :class="videoTileInfo.find(tile => tile.tileNum == 1).isRepeating ? 'd-block' : 'd-none'"
          >
            <video id="video-1-repeating" class="w-100" loop autoplay muted></video>
          </div>
        </div>
        <div
          id="video-container-2"
          class="justify-content-center align-items-center p-2"
          :class="[
            videoTileInfo.find(tile => tile.tileNum == 2 && tile.attendeeId != '') ? 'd-flex' : 'd-none',
            status.isSharingOn ? 'w-100 h-25' : `attendee-num-${attendeeNum}`
          ]"
        >
          <video
            id="video-preview-2"
            class="w-100"
            :class="videoTileInfo.find(tile => tile.tileNum == 2).isLoading ? 'd-none' : 'd-block'"
          />
          <div
            :class="videoTileInfo.find(tile => tile.tileNum == 2).isLoading ? 'd-block' : 'd-none'"
            class="position-relative"
          >
            <img
              id="video-preview-2-loading"
              class="w-100"
              style="object-fit: contain"
            >
            <div class="position-absolute top-0 left-0 w-100 h-100 bg-dark d-flex justify-content-center align-items-center" style="opacity: .7">
              <div class="text-white text-center">
                <h5>接続中....</h5>
                <h1 class="fas fa-spinner fa-spin"></h1>
              </div>
            </div>
          </div>
        </div>
        <div
          id="video-container-3"
          class="justify-content-center align-items-center p-2"
          :class="[
            videoTileInfo.find(tile => tile.tileNum == 3 && tile.attendeeId != '') ? 'd-flex' : 'd-none',
            status.isSharingOn ? 'w-100 h-25' : `attendee-num-${attendeeNum}`
          ]"
        >
          <video
            id="video-preview-3"
            class="w-100"
            :class="videoTileInfo.find(tile => tile.tileNum == 3).isLoading ? 'd-none' : 'd-block'"
          />
          <div
            :class="videoTileInfo.find(tile => tile.tileNum == 3).isLoading ? 'd-block' : 'd-none'"
            class="position-relative"
          >
            <img
              id="video-preview-3-loading"
              class="w-100"
              style="object-fit: contain"
            >
            <div class="position-absolute top-0 left-0 w-100 h-100 bg-dark d-flex justify-content-center align-items-center" style="opacity: .7">
              <div class="text-white text-center">
                <h5>接続中....</h5>
                <h1 class="fas fa-spinner fa-spin"></h1>
              </div>
            </div>
          </div>
        </div>
        <div
          id="`video-container-4"
          class="justify-content-center align-items-center p-2"
          :class="[
            videoTileInfo.find(tile => tile.tileNum == 4 && tile.attendeeId != '') ? 'd-flex' : 'd-none',
            status.isSharingOn ? 'w-100 h-25' : `attendee-num-${attendeeNum}`
          ]"
        >
          <video
            id="video-preview-4"
            class="w-100"
            :class="videoTileInfo.find(tile => tile.tileNum == 4).isLoading ? 'd-none' : 'd-block'"
          />
          <div
            :class="videoTileInfo.find(tile => tile.tileNum == 4).isLoading ? 'd-block' : 'd-none'"
            class="position-relative"
          >
            <img
              id="video-preview-4-loading"
              class="w-100"
              style="object-fit: contain"
            >
            <div class="position-absolute top-0 left-0 w-100 h-100 bg-dark d-flex justify-content-center align-items-center" style="opacity: .7">
              <div class="text-white text-center">
                <h5>接続中....</h5>
                <h1 class="fas fa-spinner fa-spin"></h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-menu d-flex justify-content-between align-items-center">
      <div class="d-flex">
        <button class="footer-btn" @click="switchMicStatus">
          <i class="fas fa-microphone text-white" v-if="status.isMicOn"></i>
          <i class="fas fa-microphone-slash text-white" v-else></i>
          <span>マイク</span>
        </button>
        <button class="footer-btn" @click="switchVideoStatus">
          <i class="fas fa-video text-white" v-if="status.isVideoOn"></i>
          <i class="fas fa-video-slash text-white" v-else></i>
          <span>ビデオ</span>
        </button>
        <button class="footer-btn" @click="switchLoadingStatus">
          <i class="fas fa-spinner text-white" :class="{'fa-spin': status.isLoading}"></i>
          <span>通信不良</span>
        </button>
        <button class="footer-btn" @click="switchRecordingStatus">
          <i class="fas fa-pause text-white"v-if="status.isRecording"></i>
          <i class="fas fa-play text-white" v-else></i>
          <span>リピート動画</span>
        </button>
        <button class="footer-btn" @click="switchRepeatingStatus" v-if="filePath">
          <i class="fas fa-redo-alt text-white" :class="{'fa-spin': status.isRepeating}"></i>
          <span>リピート</span>
        </button>
      </div>
      <button class="footer-btn" @click="switchSharingStatus">
        <i class="fas fa-desktop text-success"></i>
        <span class="text-success">画面共有</span>
      </button>
      <button class="btn btn-sm btn-danger">終了</button>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import { mapGetters } from 'vuex'
  import ConfirmVideoModal from "../../../components/meetings/ConfirmVideoModal";
  export default {
    components: {ConfirmVideoModal},
    async fetch({store, route}){
      await store.dispatch('attendees/list/fetch', route.params.id)
    },
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
          isLoading: false,
          isRecording: false,
          isModalOpen: false
        },
        videoTileInfo: [
          {tileNum: 1, tileId: '', attendeeId: '', userId: '', isVideoOn: false, isLoading: false, isRepeating: false},
          {tileNum: 2, tileId: '', attendeeId: '', userId: '', isVideoOn: false, isLoading: false, isRepeating: false},
          {tileNum: 3, tileId: '', attendeeId: '', userId: '', isVideoOn: false, isLoading: false, isRepeating: false},
          {tileNum: 4, tileId: '', attendeeId: '', userId: '', isVideoOn: false, isLoading: false, isRepeating: false}
        ],
        recorder: null,
        blob: null,
        blobUrl: '',
        filePath: ''
      }
    },
    async mounted() {
      //firebase系
      const refLoadingStatus = firebase
        .database()
        .ref('loading')
        .orderByChild('session_id')
        .startAt(this.$route.params.id)
        .endAt(this.$route.params.id)
      const refRepeatStatus = firebase
        .database()
        .ref('repeat')
        .orderByChild('session_id')
        .startAt(this.$route.params.id)
        .endAt(this.$route.params.id)
      // データベースにレコードが追加されたときに発火させるメソッドを定義
      refLoadingStatus.limitToLast(100).on('child_added', this.fetchLoadingStatus)
      refRepeatStatus.limitToLast(100).on('child_added', this.fetchRepeatStatus)

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
          targetTile.userId = tileState.boundExternalUserId
          let videoElement = null
          videoElement = document.getElementById(`video-preview-${targetTile.tileNum}`)
          this.meetingSession.audioVideo.bindVideoElement(targetTile.tileId, videoElement)
        },
      }

      const shareObserver = {
        videoTileDidUpdate: (tileState) => {
          if (!tileState.boundAttendeeId) {
            return
          }
          //content share用のスクリーンでなければreturn
          if(!tileState.isContent){
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

      //入退出処理
      const callback = async (presentAttendeeId, present) => {
        let targetTile = this.videoTileInfo.find((tile) => tile.attendeeId == presentAttendeeId)
        if (present) {
          //contentの場合return
          if(presentAttendeeId.includes('#content')){
            return
          }
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
          targetTile.userId = this.attendees.find(attendee => attendee.chime_attendee_id == presentAttendeeId).user_id
        } else {
          //退出処理
          if(targetTile){
            targetTile.tileId = 0
            targetTile.attendeeId = ''
            targetTile.userId = ''
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
      },
      mediaRecorder: {
        get: function(){
          return this.recorder
        },
        set: function(recorder) {
          this.recorder = recorder
        }
      },
      ...mapGetters('profile', ['profile']),
      ...mapGetters('attendees/list', ['attendees'])
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
      switchLoadingStatus(){
        this.status.isLoading = !this.status.isLoading
        //他の参加者に対してLoading statusを送信
        firebase
          .database()
          .ref('loading')
          .push(
            {
              session_id: this.$route.params.id,
              mode: this.status.isLoading,
              user_id: this.profile.id,
            },
            () => {}
          )
      },
      fetchLoadingStatus(snap){
        const status = snap.val()
        const canvas = document.getElementById( "canvas" )
        const targetTile = this.videoTileInfo.find((tile)=> tile.userId == status.user_id)
        if(!targetTile){
          return
        }
        targetTile.isLoading = status.mode
        const videoPreview = document.getElementById(`video-preview-${targetTile.tileNum}`)
        canvas.width = videoPreview.videoWidth
        canvas.height = videoPreview.videoHeight
        canvas.getContext('2d').drawImage(videoPreview, 0, 0)
        const image = document.getElementById(`video-preview-${targetTile.tileNum}-loading`)
        image.src = canvas.toDataURL()
      },
      fetchRepeatStatus(snap){
        const status = snap.val()
        console.log(status)
        const targetTile = this.videoTileInfo.find((tile)=> tile.userId == status.user_id)
        if(!targetTile){
          return
        }
        targetTile.isRepeating = status.mode
        const videoRepeating = document.getElementById(`video-${targetTile.tileNum}-repeating`)
        videoRepeating.src = status.url
      },
      switchRecordingStatus(){
        if(this.status.isRecording){
          this.stopRecording()
        }else{
          this.startRecording()
        }
        this.status.isRecording = !this.status.isRecording
      },
      async startRecording(){
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" })
        this.mediaRecorder.ondataavailable = (e) => {
          const blob = new Blob([e.data], {type:e.data.type})
          this.saveMovie(blob)
        }
        this.mediaRecorder.start()

      },
      stopRecording(){
        this.mediaRecorder.stop()
      },
      switchRepeatingStatus(){
        if(this.status.isRepeating){
          this.stopRepeating()
        }else{
          this.startRepeating()
        }
        this.status.isRepeating = !this.status.isRecording
      },
      startRepeating(){
        firebase
          .database()
          .ref('repeat')
          .push(
            {
              session_id: this.$route.params.id,
              mode: true,
              user_id: this.profile.id,
              url: `https://hackz.s3-ap-northeast-1.amazonaws.com/${this.filePath}`
            },
            () => {}
          )
      },
      stopRepeating(){
        firebase
          .database()
          .ref('repeat')
          .push(
            {
              session_id: this.$route.params.id,
              mode: false,
              user_id: this.profile.id,
              url: ''
            },
            () => {}
          )
      },
      saveMovie(blob){
        this.blob = blob
        this.blobUrl = window.URL.createObjectURL(this.blob)
        this.status.isModalOpen = true
      },
      resetBlob(){
        this.blob = null
        this.blobUrl = ''
        this.filePath = ''
      },
      saveFile(filePath){
        console.log('savefile', filePath)
        this.filePath = filePath
      }
    }
  }
</script>

<style lang="scss" scoped>
  .video-container {
    height: calc(100% - 40px);
  }
  .footer-menu {
    padding-left: 10px;
    padding-right: 10px;
    position: fixed;
    bottom: 0;
    background: $dark;
    height: 55px;
    width: 100%;
    .footer-btn {
      border:none;
      background: $dark;
      padding: 8px;
      width: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 5px;
      &:hover {
        background: lighten($dark, 10%);
        transition: .3s;
      }
      span {
        color: $white;
        font-size: 10px;
      }
      i {
        font-size: 20px;
        margin-bottom: 4px;
      }
    }
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

  .top-0 {
    top: 0;
  }

  .left-0 {
    left: 0;
  }


</style>
