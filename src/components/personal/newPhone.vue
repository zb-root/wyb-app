<template>
  <div>
    <i-header title="绑定新手机号" v-bind:leftNav="leftNav" rightNav="/" rightText="个人中心"></i-header>
    <div class="form" style="margin-top:2rem">
      <mt-field label="手机号" type="tel" value="phone" v-model="newMobile"  style="margin-left:-10px;"></mt-field>
      <mt-field label="验证码" v-model="code" state="statepa" style="margin-left:-10px;">
        <a v-on:click="rgsms" class="smsbtn" disabled>{{smstext}}</a>
      </mt-field>
      <mt-field></mt-field>
      <div style="text-align: center;margin-top:-1.7rem;">
        <mt-button type="primary" size="small" v-on:click="save"  style="width:100px;">保存</mt-button>
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
      	islogin:true,
        mobile:this.$route.params.mobile,
        code:'',
        smstext:'获取验证码',
        count:60,
        newMobile:'',
        leftNav:'/app/updatePhone/'+this.$route.params.mobile
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
      save:function () {   //验证验证码正确之后update mobile
        let self = this
        if(!this.newMobile || !this.code) return Toast({message: '请完善信息',position: 'bottom',duration: 1500});
        axios.get(global.verifycode+'/'+self.newMobile+'/check',{
          params: {code:self.code,mobile:self.newMobile}
        })
          .then(function (response) {
            if (response.data && response.data.err) {
              Indicator.close()
              return Toast({message: response.data.msg,position: 'bottom',duration: 1500});
            }
            let token = localStorage.getItem('token')
            let id = localStorage.getItem('id')
            axios.post(global.user+'/users/'+id,{       //更新手机号
              mobile:self.newMobile,
              token:token
            })
              .then(function (response) {
                if (response.data && response.data.err) {
                  Indicator.close()
                  return Toast({message: response.data.msg,position: 'bottom',duration: 1500});
                }
                Toast({message: '修改成功',position: 'bottom',duration: 1000});
                setTimeout(function () {
                  self.$router.push('/')
                },1000)
              })
              .catch(function (error) {
                Indicator.close()
                Toast({message: '修改失败',position: 'bottom',duration: 1000});
                console.log(error)
              })
          })
          .catch(function (error) {
            Indicator.close()
            Toast({message: '修改失败',position: 'bottom',duration: 1000});
            console.log(error)
          })
      },
      rgsms: function () {
        if(this.count != 60) return;
        let self = this
        let reg = /^1[3|4|5|7|8][0-9]{9}$/
        if(!reg.test(this.newMobile)) return Toast({message: '手机号码不正确',position: 'bottom',duration: 1500});
        let url = global.passport + '/sms/'
        axios.get(url + self.newMobile, {
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
