<template>
  <div>
    <mt-header fixed>
      <router-link to="/app/user/userinfo" slot="left">
        <mt-button icon="back">设置个人头像</mt-button>
      </router-link>
    </mt-header>
    <div class="head"></div>
    <div class="content_avatar">
      <v-avatar></v-avatar>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import avatar from './avatar.vue'
  export default {
    components: {
      'v-avatar': avatar
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.head
  height: 38px
.content_avatar
  text-align:center
  margin: 2rem 1rem 1rem 1rem
</style>
