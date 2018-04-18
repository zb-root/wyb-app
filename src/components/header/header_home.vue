<template>
  <div>
    <mt-header title="iwawa" fixed>
      <router-link to="" slot="left">
        <mt-button></mt-button>
      </router-link>
      <router-link to="/login" slot="right" v-if="!islogin">
        <mt-button>登录</mt-button>
      </router-link>
    </mt-header>
    <div class="head"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  export default {
    data () {
      return {
        islogin: true
      }
    },
    mounted: function () {
      this.isLogin()
    },
    methods: {
      isLogin: function () {
        let self = this
        let token = localStorage.getItem('token')
        axios.get(global.sso + '/user?token=' + token)
          .then(function (res) {
            if (res.data.err) {
              self.islogin = false
              localStorage.removeItem('token')
            } else {
              self.islogin = true
            }
          }).catch(function (error) {
            console.info(error)
          })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.head
  height: 30px
</style>
