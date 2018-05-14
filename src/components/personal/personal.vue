<template>
  <div v-bind:style="{height:height}" style="background-color:#FAFAFA">
    <i-header title="个人中心" rightNav="/" ></i-header>
    <!--<div v-if="!islogin" style="width:100%;height:12rem;background-size:100% 100%;text-align: center;" v-bind:style="{'backgroundImage':'url('+bgImg+')'}">-->
      <!--<img style="width:4.5rem;margin-top:1.5rem;" src="../../assets/personal/default_avatar.png"/>-->
      <!--<router-link to="/app/login" style="display:block;font-size:1.1em;color:white;margin-top:0.5rem">请登录</router-link>-->
    <!--</div>-->

    <div style="width:100%;height:12rem;background-size:100% 100%;text-align: center;" v-bind:style="{'backgroundImage':'url('+bgImg+')'}">
      <img style="width:4.5rem;margin-top:1.5rem;border-radius: 50%" :src="avatarImage" @error="imageLoadOnError" @click="changeavatar"/>
      <div style="text-align: center;color:white;">
        <p v-if="isValidate" style="margin-top:0.3rem;font-size:1.1em;">{{info.name}}</p>
        <p v-if="!isValidate" style="margin-top:0.3rem;font-size:1.1em;">{{info.nick}}</p>
        <p v-if="isValidate" style="margin-top:0.4rem;font-size:1.2em;">
          <span>{{info.phone}}</span>&nbsp;
          <router-link v-bind:to="'/app/updatePhone/'+info.phone" style="display: inline-block;width:0.9rem;height:0.9rem;background-size:100% 100%" v-bind:style="{backgroundImage:'url('+modImg+')'}"></router-link>
        </p>
        <!--<span @click="toValidate" v-if="!isValidate" style="display:inline-block;margin-top:0.7rem;font-size:0.85em;background-color:#50A1DE;width:4.5rem;height:1.2rem;line-height: 1.2rem;border:0.15em solid white;font-weight:600;border-radius: .1em">-->
          <!--实名认证-->
        <!--</span>-->
        <img v-if="!isValidate" src="../../assets/personal/validate.png" height="18" style="margin-top:0.4rem;" @click="toValidate">
        <p v-if="isInsider" style="margin-top:0.4rem;font-size:1em;">所属部门：{{info.department}}</p>
      </div>
    </div>

    <div style="margin-top:0.5rem;" @click.stop>
      <mt-cell title="我的收藏" is-link >
        <span>（建设中）</span>
        <img slot="icon" src="../../assets/personal/collection.jpg" width="24" height="24">
      </mt-cell>
    </div>

    <div style="margin-top:0.5rem;" @click.stop>
      <mt-cell title="我的审核" is-link >
        <span>（建设中）</span>
        <img slot="icon" src="../../assets/personal/auditing.png" width="24" height="24">
      </mt-cell>
    </div>

    <div style="margin-top:0.5rem;" @click="openConfirm"  >
      <mt-cell title="        退出登录" is-link >
        <img slot="icon" src="../../assets/personal/signout.png" width="24" height="24">
      </mt-cell>
    </div>

    <!--<div style="margin-top:1.5rem;text-align: center;" v-if="islogin" >-->
      <!--<mt-button style="background-color:#1A4B9C;color:white;width:40%;border-radius:0.3rem;" size="normal" @click="openConfirm">退出登录</mt-button>-->
    <!--</div>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import header from '../header/header.vue'
  import {Cell,Toast,Indicator,MessageBox} from 'mint-ui'
  import 'vue-router'
  export default {
    data () {
      return {
        isValidate: false,
        info:{
        	name:'',
          phone:'',
          department:'',
          nick:' '
        },
        isInsider:false,
        bgImg:require('../../assets/personal/not_login.jpg'),
        modImg:require('../../assets/personal/modImg.png'),         //修改手机号图标
        height:(window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight) + 'px',
        avatarImage: '../../assets/personal/default_avatar.png'
      }
    },
    mounted: function () {
      this.isLogin()
    },
    methods: {
      imageLoadOnError: function() {
        this.avatarImage = global.avatarsrc + '/avatar/default_avatar.png'
      },
    	mySave:function () {
        Toast({
          message: '该功能尚未开放，请耐心等待',
          position: 'middle',
          duration: 1000
        });
      },
      toPath:function () {
        this.$router.push('/app/updatePhone/'+this.info.phone)
      },
      toValidate:function () {
        this.$router.push('/app/register')
      },
      isLogin: function () {
        let self = this
        let id = localStorage.getItem('id')
        let token = localStorage.getItem('token')
        axios.get(global.sso + '/user?token=' + token)
          .then(function (res) {
            if (res.data.err) {
              localStorage.removeItem('id')
              localStorage.removeItem('token')
              self.login()
            } else {
              self.avatarImage = global.avatarsrc + '/avatar/' + id + '.img?' + Date.parse(new Date()) / 1000
              self.getUserInfo()
              self.getInsiderData()
            }
          }).catch(function (error) {
          console.info(error)
        })
      },
      login:function () {
      	let self = this
        let code = this.getArgs()['code']
        let openid = localStorage.getItem('openid')
        let data = {}         //传递的参数
      	if(openid){                //有openid先取openid
        	data.openid = openid
        }
        if(code){                 //有code的话必定是重定向过来的，这时候优先code,
      		data.code = code
        }
        let uri = global.redirect_uri + encodeURIComponent(global.staticHost+'/#/app/personal') + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        if(!data.openid && !data.code){                    //如果没有openid和code，则直接重新授权
          window.location.href = uri
        }else if(data.code || data.openid) {                //localStorage有openid的话直接登录，登录失败则重新授权，有code的话必定是重定向过来的直接登录
          axios.get(global.passport_wechat + '/login', {
            params: data
          })
            .then(function (res) {
              let result = res.data || {}
              if (result.err) {                //如果是登录失败，应该是openid失效，所以重新授权
                window.location.href = uri
              } else {           //登录成功保存id,token,openid等
                self.getUserInfo()
                localStorage.setItem('id',result.userId)
                localStorage.setItem('token',result.token)
                localStorage.setItem('openid',result.openid)
              }
            })
        }
      },
      getArgs:function () {
        var args = {} // 声明一个空对象
        var query = window.location.search.substring(1) // 取查询字符串，如从 http://www.snowpeak.org/testjs.htm?a1=v1&a2=&a3=v3#anchor 中截出 a1=v1&a2=&a3=v3。
        var pairs = query.split('&') // 以 & 符分开成数组
        for (var i = 0; i < pairs.length; i++) {
          var pos = pairs[i].indexOf('=') // 查找 "name=value" 对
          if (pos === -1) continue // 若不成对，则跳出循环继续下一对
          var argname = pairs[i].substring(0, pos) // 取参数名
          var value = pairs[i].substring(pos + 1) // 取参数值
          value = decodeURIComponent(value) // 若需要，则解码
          args[argname] = value // 存成对象的一个属性
        }
        return args // 返回此对象
      },
      getUserInfo:function () {
        let self = this
        var id = localStorage.getItem('id')
        var token = localStorage.getItem('token')
        if(id){
          axios.get(global.user + '/users/'+id,{
            params:{
              token:token
            }
          })
            .then(function (response) {
            	if(response.data.err)
            		return Toast({
                  message: '获取用户信息失败',
                  position: 'bottom',
                  duration: 1000
                });
              let data = response.data || {}
              if(data.idcard){
              	self.isValidate = true
                self.info.name = data.name
                self.info.phone = data.mobile
              }else{
                self.isValidate = false
                self.info.nick = data.nick || 'Quokka'
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        }else{
          self.login()
        }
      },
      getInsiderData:function () {
        let self = this
        let id = localStorage.getItem('id')
        let token = localStorage.getItem('token')
        axios.get(global.insider + '/info?token=' + token+'&uid='+id)
          .then(function (res) {
            if (res.data.err) {
              console.log(res.data.err)
            } else {
            	self.isInsider = true
              self.info.department = res.data.department
            }
          }).catch(function (error) {
          console.info(error)
        })
      },
      openConfirm:function () {
    		let self = this;
        MessageBox.confirm('确定要退出吗？').then(action => {
          self.signout()
        });
      },
      signout:function () {
    		console.log(234)
        let self = this
        Indicator.open()
    		let token = localStorage.getItem('token')
        axios.get(global.sso + '/signout?token='+token)
          .then(function (response) {
            Indicator.close()
            if (response.data.id) {
              localStorage.removeItem('token')
              localStorage.removeItem('id')
              localStorage.removeItem('openid')
              Toast({
                message: '退出登录成功',
                position: 'bottom',
                duration: 1000
              });
              self.$router.push('/app/login')
            } else {
              Toast({
                message: '退出登录失败',
                position: 'bottom',
                duration: 1000
              });
            }
        }).catch(function (error) {
          console.log(error)
        })
      },
      changeavatar: function () {
        this.$router.push('/app/personal/avatar')
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
