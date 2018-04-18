<template>
  <div>
    <v-header></v-header>
    <div>
      <mt-cell title="头像" to="/app/user/userinfo/avatarconfig" is-link >
        <img class="avatar" v-bind:src="avatar + '?' + Math.random()" onerror="this.src = 'http://www.mx.jamma.cn/avatar/avatar.img'"/>
      </mt-cell>
      <mt-cell title="手机号" >{{mobile}}</mt-cell>
      <mt-cell title="昵称" :to="{path: '/app/user/userinfo/nick/' + nick}" is-link >{{nick}}</mt-cell>
      <mt-cell title="收货地址" to="/app/user/userinfo/addresslist" is-link >{{region}}</mt-cell>
      <mt-cell title="我的二维码" to="/app/home/share" is-link></mt-cell>
        <!--<img class="codeimg" src="../../assets/png/qrcode/share.png" />-->
      <!--</mt-cell>-->
      <!--<mt-cell title="地区" to="/app/user/userinfo/region" is-link >{{region}}</mt-cell>-->
      <!--<mt-cell title="邮箱" to="/app/user/userinfo/email" is-link >{{email}}</mt-cell>-->
      <!--<mt-cell title="个性签名"  ></mt-cell>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import header from '../header/header_userinfo.vue'
import '../../../static/css/reset.css'
import axios from 'axios'
export default {
  data () {
    return {
      mobile: '',
      nick: '',
      avatar: '',
      email: '',
      region: '',
      avatarerr: global.avatarsrc
    }
  },
  mounted: function () {
    this.isLogin()
    this.getinfo()
    this.getavatar()
  },
  methods: {
    isLogin () {
      let self = this
      let token = localStorage.getItem('token')
      axios.get(global.sso + '/user?token=' + token)
        .then(function (res) {
          if (res.data.err) {
            localStorage.removeItem('token')
            self.$router.push('/login')
          }
        }).catch(function (error) {
          console.info(error)
        })
    },
    getinfo: function () {
      let self = this
      let id = localStorage.getItem('id')
      let token = localStorage.getItem('token')
      let url = global.users + '/'
      axios.get(url + id, {
        params: {
          token: token
        }
      }).then(function (response) {
        if (response.data.mobile) {
          self.replace(response.data.mobile)
        }
        self.nick = response.data.nick
        self.email = response.data.email
      })
    },
    replace: function (mobile) {
      let mobile1 = mobile.substring(0, 3)
      let mobile2 = mobile.substring(9, mobile.length)
      this.mobile = mobile1 + '******' + mobile2
    },
    getavatar: function () {
      let self = this
      let id = localStorage.getItem('id')
      let token = localStorage.getItem('token')
      let key = Date.parse(new Date()) / 1000
      axios.get(global.users + '/' + id + '/avatar?' + key, {
        params: {
          token: token
        }
      }).then(function (response) {
        self.avatar = global.avatarsrc + response.data.ret
      }).catch(function (error) {
        console.info(error)
      })
    }
  },
  components: {
    'v-header': header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.avatar
  width: 50px
  height: 50px
  margin:0.5rem
  border-radius: 50%
.codeimg
  width: 30px
  height: 30px
  margin:0.5rem
</style>
