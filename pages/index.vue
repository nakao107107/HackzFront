<template>
  <div class="bg-dark vh-100 vw-100 d-flex justify-content-center align-items-center">
    <div class="d-flex">
      <!--        menu-->
      <div class="d-flex">
        <div class="d-flex flex-column align-items-center">
          <button class="btn btn-primary menu-btn">
            <i class="fas fa-video"></i>
          </button>
          <span>新規ミーティング</span>
        </div>
        <div class="d-flex flex-column align-items-center">
          <button class="btn btn-secondary menu-btn">
            <i class="fas fa-plus-square"></i>
          </button>
          <span>参加</span>
        </div>
      </div>
      <!--        予定されているミーティング一覧-->
      <div class="card">
        <div></div>
        <div>
          <span>今日予定されているミーティングはありません</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
  .menu-btn {
    width: 90px;
    height: 90px;
    font-size: 45px;
    border-radius: 30px;
    line-height: 70px;
    padding: 10px;
  }
</style>
