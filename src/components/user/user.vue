<template>
  <div>
    <router-link v-bind:to="'/app/user/userinfo'">
      <div class="self_user">
        <div class="avatar">
          <img v-bind:src="avatar + '?' + Math.random()" onerror="this.src = 'http://www.mx.jamma.cn/avatar/avatar.img'" />
        </div>
        <div class="info">
          <span>{{nick}}</span><br/>
          <span>{{mobile}}</span>
        </div>
        <div class="detail">
          <img src="../../assets/svg/right.svg" width="15px" v-on:click="getdetail" />
        </div>
      </div>
    </router-link>
    <div class="btngroup1">
      <div class="btngroup1_title" style="display: none">
        <div class="btngroup1_title_1" >
          <img src="../../assets/svg/user.svg">
          <span>我的美夏</span>
        </div>
        <div class="btngroup1_title_2" style="display: none">
          <img src="../../assets/svg/integral.svg">
          <span>签到</span>
        </div>
      </div>
      <div class="btngroup1_con1">
        <div class="btngroup1_item1">
          <router-link v-bind:to="'/app/integral/detail'">
            <img src="../../assets/svg/icon/integral_detail.svg">
            <p>惠通宝明细</p>
          </router-link>
        </div>
        <div class="btngroup1_item1">
          <router-link v-bind:to="'/app/integral/donation'">
            <img src="../../assets/svg/icon/integral_give.svg">
            <p>惠通宝转赠</p>
          </router-link>
        </div>
        <div class="btngroup1_item2">
          <router-link v-bind:to="'/app/home/share'">
            <img src="../../assets/svg/icon/user_share.svg">
            <p>推荐有奖</p>
          </router-link>
        </div>
      </div>
      <div class="btngroup1_con2" style="display: none">
        <div class="btngroup1_item2">
          <router-link v-bind:to="'/app/user/userconfig'">
          <img src="../../assets/svg/icon/user_config.svg">
          <p>设置</p>
          </router-link>
        </div>
        <div class="btngroup1_item2" style="opacity: 0">
          <img src="../../assets/svg/home.svg">
          <p>我的钱包</p>
        </div>
        <div class="btngroup1_item2" style="opacity: 0">
          <img src="../../assets/svg/home.svg">
          <p>账户安全</p>
        </div>
      </div>
    </div>
    <div class="btngroup2" style="display:none">
      <div class="btngroup2_title">
        <p>每天签到，轻松得积分，换礼品</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from '../header/header_user.vue'
  import axios from 'axios'
  export default {
    data () {
      return {
        nick: '未登录',
        mobile: '*******',
        avatar: '',
        avatarerr: global.avatarsrc
      }
    },
    mounted: function () {
      this.getinfo()
      this.getavatar()
    },
    methods: {
      isLogin: function () {
        let token = localStorage.getItem('token')
        axios.get(global.sso + '/user?token=' + token)
          .then(function (res) {
            if (res.data.err) {
              localStorage.removeItem('token')
            }
          }).catch(function (error) {
            console.info(error)
          })
      },
      getinfo: function () {
        let self = this
        let url = global.users + '/'
        let token = localStorage.getItem('token')
        if (token) {
          let id = localStorage.getItem('id')
          axios.get(url + id, {
            params: {
              token: token
            }
          }).then(function (response) {
            if (response.data._id) {
              self.nick = response.data.nick
              self.mobile = response.data.mobile
            } else {
              self.nick = '未登录'
              self.mobile = '***********'
            }
          })
        } else {
          self.nick = '未登录'
          self.mobile = '***********'
        }
      },
      getdetail: function () {
        let id = localStorage.getItem('id')
        if (id) {
          this.$router.push('/app/userinfo')
        } else {
          this.$router.push('/login')
        }
      },
      getavatar: function () {
        let self = this
        let id = localStorage.getItem('id')
        let token = localStorage.getItem('token')
        if (token) {
          axios.get(global.users + '/' + id + '/avatar?' + Date.parse(new Date()) / 1000, {
            params: {
              token: token
            }
          }).then(function (response) {
            self.avatar = global.avatarsrc + response.data.ret
          }).catch(function (error) {
            console.info(error)
          })
        }
      }
    },
    components: {
      'v-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .self_user
    height:100px
    background-color: rgba(255,78,136,0.7)
    padding: 1rem 1rem 0.5rem 1rem
    .avatar
      float:left
      width:71px
      height:71px
      border-radius: 5px
      margin-top: 5px
      img
        width:70px
        height:70px
        border:2px solid rgb(255,78,136,1)
        border-radius: 50%
    .info
      float:left
      margin: 1rem 0 0 0.5rem
      span
        height:1.5rem
        line-height: 1.5rem
        color: #ffffff
    .detail
      float: right
      margin-top: 2.5rem

  .btngroup1
    font-size: 12px
    .btngroup1_title
      height: 20px
      color: #888888
      padding: 4px 10px
      border-bottom: 1px solid #eeeeee
      .btngroup1_title_1
        float: left
        img
          width: 15px
      .btngroup1_title_2
        float: right
        img
          width: 15px
    .btngroup1_con1, .btngroup1_con2
       display:flex
       border-bottom: 1px solid #eeeeee
      .btngroup1_item1, .btngroup1_item2
        flex:1
        text-align:center
        border-right: 1px solid #eeeeee
        padding: 10px 0 15px 0
        img
          width:40px

  .btngroup2
    font-size: 12px
    .btngroup2_title
      text-align:center
      color: #888888
      background-color: #eeeeee
      padding: 6px 0
      border-bottom: 1px solid #eeeeee
</style>
