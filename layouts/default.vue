<template>
  <div>
    <TheHeader class="header"/>
    <Nuxt/>
  </div>
</template>

<script>
  import TheHeader from '~/components/common/TheHeader.vue'
  export default {
    components: {
      TheHeader
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    height: 50px;
    width: 100%;
    position: fixed;
  }
  .content {
    height: calc(100vh - 80px);
  }
</style>
