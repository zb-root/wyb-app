<template>
  <div>
    <mt-header fixed>
      <router-link to="/app/user" slot="left">
        <mt-button icon="back">设置</mt-button>
      </router-link>
    </mt-header>
    <div class="head"></div>
    <div class="content_userconfig">
      <div class="list">
        <mt-cell title="帮助" to="/app/user/userconfig/assist" is-link >
          <span></span>
        </mt-cell>
        <mt-cell title="关于我们" to="/app/user/userconfig/aboutus" is-link >
          <span></span>
        </mt-cell>
      </div>
      <div class="break"></div>
      <div class="content_userconfig_foot" @click="quit">
        <p>退出登录</p>
      </div>
    </div>

    <mt-actionsheet :actions="actions" v-model="sheetVisible">
    </mt-actionsheet>

  </div>
</template>

<script type="text/ecmascript-6">
  import { Actionsheet } from 'mint-ui'
  import axios from 'axios'
  export default {
    data () {
      return {
        sheetVisible: false,
        actions: [
          {
            name: '换个账号登录',
            method: this.signon
          },
          {
            name: '退出登录',
            method: this.signout
          }
        ]
      }
    },
    methods: {
      quit: function () {
        this.sheetVisible = true
      },
      signon: function () {
        this.$router.push('/login')
        localStorage.clear()
      },
      signout: function () {
        let self = this
        let token = localStorage.getItem('token')
        axios.get(global.sso + '/signout?token=' + token)
          .then(function (res) {
            localStorage.removeItem('token')
            self.$router.push('/app/home')
          }).catch(function (error) {
            console.info(error)
          })
      }
    },
    components: {
      'mt-actionsheet': Actionsheet
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.head
  height: 38px
.content_userconfig
  .content_userconfig_foot
    width:100%
    border-top: 1px solid #dddddd
    border-bottom: 1px solid #dddddd
    p
      text-align: center
      height: 40px
      line-height: 40px
  .break
    background: #eeeeee
    padding: 10px 0
</style>
