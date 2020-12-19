<template>
  <div class="header d-flex justify-content-between align-items-center p-4">
    <img
      src="https://hackz.s3-ap-northeast-1.amazonaws.com/system/logo.png"
      height="25px"
      style="object-fit: contain"
      alt="ooom">
    <el-popover
      width="300px"
    >
      <div>
        <div class="p-3 profile-box">
          <span class="text-white font-weight-bold">{{profile.name}}</span>
          <br>
          <span class="text-white font-weight-bold">{{profile.email}}</span>
        </div>
        <div class="signout p-2" @click="signout">
          サインアウト
        </div>
      </div>
      <button
        class="btn icon"
        slot="reference"
      >{{profile.name.slice(0, 2)}}</button>
    </el-popover>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters('profile', ['profile'])
    },
    methods: {
      signout(){
        this.$store.dispatch('auth/logout')
        this.$router.push('/auth/login')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    background: #2E2E2E;
    border: 1px solid #1A1A1A;
  }

  .icon {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    font-weight: bold;
    color: $white;
    border-radius: 7px;
    background: $primary;
    cursor: pointer;
  }

  .profile-box {
    border-bottom: 1px solid $default;
  }

  .signout {
    cursor: pointer;
    transition: .3s;
    color: $white;
    &:hover {
      color: $white;
      background: lighten($dark, 10%);
    }
  }
</style>
