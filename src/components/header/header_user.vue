<template>
  <div>
    <mt-header title="我的" fixed>
      <router-link to="/app/user/userconfig" slot="right">
        <mt-button>设置</mt-button>
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
    height: 38px
</style>
