<template>
  <div class="lg">
    <i-header title="登录" leftNav="/" rightNav="/" rightText="个人中心"></i-header>
    <div class="form">
      <img src="../../assets/png/default_avatar.png" width="45%" />
      <mt-field label="手机号" type="tel" value="phone" v-model="phone" state="statemo" style="margin-left:-10px;"></mt-field>
      <mt-field label="验证码" v-model="code" state="statepa" style="margin-left:-10px;">
        <a v-on:click="rgsms" class="smsbtn" disabled>{{smstext}}</a>
      </mt-field>
      <mt-field></mt-field>
      <div style="text-align: center;margin-top:-1.7rem;">
        <mt-button type="primary" size="small" v-on:click="login"  style="width:100px;">登录</mt-button>
        <mt-button type="primary" size="small" v-on:click="register" style="width:100px;">注册</mt-button>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import { MessageBox, Indicator, Toast } from 'mint-ui'
  import header from '../header/header.vue'
  export default {
    data () {
      return {
        phone: '',
        code:'',
        smstext:'发送验证码',
        count: 60
      }
    },
    methods: {
      type: function () {
        if (this.lgtype === true) {
          this.lgtype = false
        } else {
          this.lgtype = true
        }
      },
      login: function () {
        if(!this.phone || !this.code) return Toast({message: '请完善登录信息',position: 'bottom',duration: 1500});
        Indicator.open()
        let self = this
        axios.post(global.passport + '/login/mobile', {
          mobile: self.phone,
          code: self.code
        }).then(function (response) {
          Indicator.close()
          if (response.data.token) {
            console.info(response.data)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('id', response.data.id)
            self.$router.back(-1)
          } else {
            MessageBox('提示', response.data.msg || '用户名或验证码有误！')
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      register:function () {
      	this.$router.push('/app/register')
      },

      rgsms: function () {
      	if(this.count != 60) return;
        let self = this
        let reg = /^1[3|4|5|7|8][0-9]{9}$/
        if(!reg.test(this.phone)) return Toast({message: '请输入正确的手机号码',position: 'bottom',duration: 1500});
        let url = global.passport + '/sms/'
        axios.get(url + self.phone, {
          params: {}
        }).then(function (response) {
          console.log(response.data)
          if (response.data.Code === 'OK') {
            Toast('发送成功')
            self.settime()
          } else {
            Toast('发送失败')
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      settime: function () {
        let self = this
        if (self.count === 0) {
          self.smstext = '重新发送'
          self.count = 60
          return
        } else {
          self.smstext = '重发(' + self.count + ')'
          self.count--
        }
        setTimeout(function () {
          self.settime()
        }, 1000)
      }
    },
    watch: {
//      phone (val, oldVal) {
//        let reg = /^1[3|4|5|7|8][0-9]{9}$/
//        if (reg.test(val)) {
//          this.statemo = 'success'
//        } else {
//          this.statemo = 'error'
//        }
//        this.validate()
//      }
    },
    components:{
      'i-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .lg
    height: 100%
    line-height:100%
    .form
      margin-right: 0.3rem
      text-align: center
      .form_inp
        border:1px solid #E64E04
        border-radius: 8px
        display: block
        font-size: 18px
        height: 41px
        line-height: 41px
        margin-bottom:1rem
        input
          border:none
          outline:none
          width:90%
          color:#555555
          background: none
      img
        font-size:30px
        padding-top: 4rem
        padding-bottom: 2rem
      .fg
        padding-top:1rem
        font-size:14px
      .smsbtn
        border-left: 1px solid #555555
        padding-left: 6px
        color: #555555
        font-size: 14px
</style>
