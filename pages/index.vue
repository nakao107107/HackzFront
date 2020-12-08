<template>
  <div class="bg-dark vh-100 vw-100 d-flex justify-content-center align-items-center">
    <div class="d-flex">
      <!--        menu-->
      <div class="d-flex justify-content-center align-items-center mr-5">
        <div class="d-flex">
          <div class="d-flex flex-column align-items-center mr-5">
            <button class="btn btn-primary menu-btn" @click="openCreateMeetingModal">
              <i class="fas fa-video"></i>
            </button>
            <span>新規ミーティング</span>
          </div>
          <div class="d-flex flex-column align-items-center">
            <button class="btn btn-secondary menu-btn" @click="openEnterMeetingModal">
              <i class="fas fa-plus-square"></i>
            </button>
            <span>参加</span>
          </div>
        </div>
      </div>
      <!--        予定されているミーティング一覧-->
      <div class="menu-card">
        <div class="clock">
          <span class="time">{{time}}</span>
          <span class="date">{{date}}</span>
        </div>
        <div>
          <span>今日予定されているミーティングはありません</span>
        </div>
      </div>
      <BModal
        v-model="status.isCreateMeetingModalOpen"
        size="md"
        hide-footer
        hide-header
        centered
        no-close-on-backdrop
      >
        <div class="p-4">
          <h5 class="font-weight-bold">ミーティングをスケジューリング</h5>
          <div class="form-group">
            <label class="font-weight-bold">トピック</label>
            <input class="form-control">
          </div>
          <div class="form-group">
            <label class="font-weight-bold">日時</label>
            <div class="d-flex align-items-center">
              <input class="form-control" type="date">
              <span class="mx-2">~</span>
              <input class="form-control" type="date">
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <button class="btn btn-outline-light mr-3" @click="closeCreateMeetingModal">キャンセル</button>
            <button class="btn btn-secondary" @click="createMeeting">保存</button>
          </div>
        </div>
      </BModal>
      <BModal
        v-model="status.isEnterMeetingModalOpen"
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
            <button class="btn btn-outline-light mr-3" @click="closeEnterMeetingModal">キャンセル</button>
            <button class="btn btn-secondary" @click="enterMeeting">参加</button>
          </div>
        </div>
      </BModal>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      status: {
        isCreateMeetingModalOpen: false,
        isEnterMeetingModalOpen: false
      }
    }
  },
  computed: {
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
    createMeeting(){
      this.status.isCreateMeetingModalOpen = false
    },
    enterMeeting(){
      this.status.isEnterMeetingModalOpen = false
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
  }

  .menu-card {
    border: 1px solid $default;
    border-radius: 10px;
    height: 50vh;
  }

  .clock {
    padding: 20px;
    text-align: center;
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
</style>
