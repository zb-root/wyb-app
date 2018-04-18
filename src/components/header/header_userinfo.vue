<template>
  <div>
    <mt-header title="个人信息" fixed>
      <router-link to="/app/user" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="head"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .head
    height: 40px
</style>
