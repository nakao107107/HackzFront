<template>
  <div class="bg-dark vh-100 vw-100 d-flex justify-content-center align-items-center">
    <div class="d-flex">
      <!--        menu-->
      <div
        class="d-flex justify-content-center align-items-center"
        style="margin-right: 100px"
      >
        <div class="d-flex">
          <div class="d-flex flex-column align-items-center mr-5">
            <button class="btn btn-primary menu-btn mb-3" @click="openCreateMeetingModal">
              <i class="fas fa-video"></i>
            </button>
            <span class="btn-label">新規ミーティング</span>
          </div>
          <div class="d-flex flex-column align-items-center">
            <button class="btn btn-secondary menu-btn mb-3" @click="openEnterMeetingModal">
              <i class="fas fa-plus-square"></i>
            </button>
            <span class="btn-label">参加</span>
          </div>
        </div>
      </div>
      <!--        予定されているミーティング一覧-->
      <div class="menu-card">
        <div class="clock">
          <div class="text-center">
            <span class="time">{{time}}</span>
            <span class="date">{{date}}</span>
          </div>
        </div>
        <div class="meeting-list py-3">
          <div v-if="meetings.length == 0" class="h-100 w-100 d-flex justify-content-center align-items-center">
            <span>予定されているミーティングはありません</span>
          </div>
          <div
            v-else
            v-for="meeting in meetings"
            :key="meeting.id"
            class="d-flex justify-content-between align-items-start mb-3"
          >
            <div>
              <h6 class="font-weight-bold text-white">{{meeting.topic}}</h6>
              <small>ミーティングID: {{meeting.id}}</small>
            </div>
            <button
              class="btn btn-sm btn-outline-light"
              @click="start(meeting.id)"
              :disabled="status.isStarting"
            >
              開始
            </button>
          </div>
        </div>
      </div>
      <CreateMeetingModal
        :is-modal-open="status.isCreateMeetingModalOpen"
        @close-modal="closeCreateMeetingModal"
      />
      <EnterMeetingModal
        :is-modal-open="status.isEnterMeetingModalOpen"
        @close-modal="closeEnterMeetingModal"
      />
    </div>
  </div>
</template>

<script>
import CreateMeetingModal from "~/components/home/CreateMeetingModal";
import EnterMeetingModal from "~/components/home/EnterMeetingModal";
import {mapGetters} from 'vuex';
export default {
  async fetch({store}){
    await store.dispatch('meetings/list/fetch')
  },
  components: {
    CreateMeetingModal,
    EnterMeetingModal
  },
  data(){
    return {
      status: {
        isCreateMeetingModalOpen: false,
        isEnterMeetingModalOpen: false,
        isStarting: false
      }
    }
  },
  computed: {
    ...mapGetters('meetings/list', ['meetings']),
    time(){
      return this.$moment().format('HH:mm')
    },
    date(){
      return this.$moment().format('YYYY年MM月DD日 ddd曜日')
    }
  },
  methods: {
    openCreateMeetingModal(){
      this.status.isCreateMeetingModalOpen = true
    },
    openEnterMeetingModal(){
      this.status.isEnterMeetingModalOpen = true
    },
    closeCreateMeetingModal(){
      this.status.isCreateMeetingModalOpen = false
    },
    closeEnterMeetingModal(){
      this.status.isEnterMeetingModalOpen = false
    },
    async start(meetingId){
      this.status.isStarting = true
      await this.$store.dispatch('meetings/room/create', meetingId)
      await this.$store.dispatch('meetings/detail/attend', meetingId)
      this.$router.push(`/meetings/${meetingId}/view`)
    }
  }
}
</script>

<style lang="scss" scoped>

  .menu-btn {
    color: $white;
    width: 90px;
    height: 90px;
    font-size: 45px;
    border-radius: 30px;
    line-height: 70px;
    padding: 10px;
    transition: .3s;
    &:hover {
      transform: translateY(-5%);
    }
  }

  .menu-card {
    width: 350px;
    border: 1px solid $default;
    border-radius: 10px;
    height: 400px;
  }

  .clock {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-image: url('https://hackz.s3-ap-northeast-1.amazonaws.com/system/back_time.jpeg');
    color: $white;

    .time {
      display: block;
      font-size: 40px;
    }

    .date {
      display: block;
      font-size: 12px;
    }
  }

  .meeting-list {
    padding: 10px;
    height: 300px;
    overflow-y: auto;
  }

  .btn-label {
    font-size: 13px;
  }
</style>
