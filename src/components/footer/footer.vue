<template>
  <div>
    <div class="foot"></div>
    <mt-tabbar v-model="selected" fixed>
      <mt-tab-item id="share">
        <img slot="icon" src="../../assets/png/btn/share_b.png" v-if="share">
        <img slot="icon" src="../../assets/png/btn/share_d.png" v-if="!share">
        分享
      </mt-tab-item>
      <mt-tab-item id="home" >
        <img slot="icon" src="../../assets/png/btn/home_b.png" v-if="home">
        <img slot="icon" src="../../assets/png/btn/home_d.png" v-if="!home">
        大厅
      </mt-tab-item>
      <mt-tab-item id="user">
        <img slot="icon" src="../../assets/png/btn/user_b.png" v-if="user">
        <img slot="icon" src="../../assets/png/btn/user_d.png" v-if="!user">
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        selected: '',
        share: '',
        home: false,
        user: false
      }
    },
    watch: {
      selected: function (val, oldVal) {
        this.$router.push('/app/' + val)
        if (val === 'home') {
          this.home = true
        } else {
          this.home = false
        }
        if (val === 'share') {
          this.share = true
        } else {
          this.share = false
        }
        if (val === 'user') {
          this.user = true
        } else {
          this.user = false
        }
      },
      $route: function (to, from) {
        if (to.path === '/app/home') {
          this.selected = 'home'
        } else if (to.path === '/app/share') {
          this.selected = 'share'
        } else {
          this.selected = 'user'
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .foot
    height: 70px
</style>
