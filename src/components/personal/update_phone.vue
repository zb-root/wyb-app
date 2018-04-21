<template>
  <div>
    <i-header title="修改手机号" leftNav="/"></i-header>
    <div style="margin-top:3rem;font-size:14px;position: relative;padding:0 0 0 10px;">
      <label>已验证手机号：</label>{{mobile}}
      <mt-button style="position: absolute;right:20px;top:-10px;" size="small" @click="rgsms">{{smstext}}</mt-button>
    </div>
    <mt-field label="验证码" style="margin-top:20px; font-size:14px !important;padding:0px;" placeholder="请输入验证码" type="text" v-model="code"></mt-field>
    <mt-field></mt-field>
    <div style="text-align: center;margin-top:-20px">
      <mt-button size="small" style="width:80%;margin:0 20px;" @click="toPath">下一步</mt-button>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import header from '../header/header.vue'
  import {Cell,Toast,Indicator } from 'mint-ui'
  export default {
    data () {
      return {
        mobile:this.$route.params.mobile,
        code:'',
        smstext:'获取验证码',
        count:60
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
      },
      toPath:function () {
      	let self = this
        if(!self.code) return Toast({message: '请输入验证码',position: 'bottom',duration: 1500});
        axios.get(global.verifycode+'/'+self.mobile+'/check',{
          params: {code:self.code,mobile:self.mobile}
        })
          .then(function (response) {
            if (response.data && response.data.err) {
              Indicator.close()
              return Toast({message: response.data.msg,position: 'bottom',duration: 1500});
            }
            self.$router.push('/app/updatePhone/'+self.mobile+'/update')
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      preTo:function () {
        alert(456)
      },
      rgsms: function () {
        if(this.count != 60) return;
        let self = this
        let reg = /^1[3|4|5|7|8][0-9]{9}$/
        if(!reg.test(this.mobile)) return Toast({message: '手机号码不正确',position: 'bottom',duration: 1500});
        let url = global.passport + '/sms/'
        axios.get(url + self.mobile, {
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
    components:{
      'i-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .head
    height: 30px
</style>
