<template>
  <div>
    <i-header title="修改手机号" leftNav="/"></i-header>
    <div style="margin-top:2.2rem;position: relative;padding:0 1rem;">
      <p style="font-size:1.2em;">已验证手机号：{{mobile}}</p>
      <div style="margin-top:0.7rem;box-sizing:border-box;position: relative;">
        <img style="position: absolute;top:1rem;left:0.8rem;width:1rem;"  src="../../assets/personal/vericate_code.png" />
        <input type="text" placeholder="请输入验证码"  v-model="code" style="box-sizing:border-box;padding:1rem 0 1rem 2.5rem;height:3.1rem;background-color:#EAEAEA;border-radius:0.2rem;width:61%;"/>
        <mt-button style="width:35%;background-color:#1A4B9C;margin-left:2%;color:white;font-size:1em;height:3.1rem;border-radius:0.3rem;" size="normal"  @click="rgsms">{{smstext}}</mt-button>
      </div>

      <!--<mt-field label="验证码" style="margin-top:20px; font-size:14px !important;padding:0px;" placeholder="请输入验证码" type="text" v-model="code"></mt-field>-->
      <!--<mt-field></mt-field>-->
      <div style="text-align: center;margin-top:1.5rem;">
        <mt-button style="background-color:#1A4B9C;color:white;width:100%;border-radius:0.3rem;" @click="toPath">下一步</mt-button>
        <!--<mt-button style="background-color:#1A4B9C;color:white;width:40%;border-radius:0.3rem;" size="normal" @click="signout">退出登录</mt-button>-->
      </div>
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
        smstext:'发送验证码',
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
