<template>
  <div v-bind:style="{height:height}" style="background-color:#FAFAFA">
    <i-header title="个人中心" rightNav="/" ></i-header>
    <div v-if="!islogin" style="width:100%;height:12rem;background-size:100% 100%;text-align: center;" v-bind:style="{'backgroundImage':'url('+bgImg+')'}">
      <img style="width:4.5rem;margin-top:1.5rem;" src="../../assets/personal/default_avatar.png"/>
      <router-link to="/app/login" style="display:block;font-size:1.1em;color:white;margin-top:0.5rem">请登录</router-link>
    </div>

    <div v-if="islogin" style="width:100%;height:12rem;background-size:100% 100%;text-align: center;" v-bind:style="{'backgroundImage':'url('+bgImg+')'}">
      <img style="width:4.5rem;margin-top:1.5rem;border-radius: 50%" :src="avatarImage" @error="imageLoadOnError" @click="changeavatar"/>
      <div style="text-align: center;color:white;">
        <p style="margin-top:0.3rem;font-size:1.1em;">{{info.name}}</p>
        <p style="margin-top:0.8rem;font-size:1.2em;">
          <span>{{info.phone}}</span>&nbsp;
          <router-link v-bind:to="'/app/updatePhone/'+info.phone" style="display: inline-block;width:0.9rem;height:0.9rem;background-size:100% 100%" v-bind:style="{backgroundImage:'url('+modImg+')'}"></router-link>
        </p>
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

    <div style="margin-top:1.5rem;text-align: center;" v-if="islogin" >
      <mt-button style="background-color:#1A4B9C;color:white;width:40%;border-radius:0.3rem;" size="normal" @click="openConfirm">退出登录</mt-button>
    </div>
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
        islogin: false,
        info:{
        	name:'',
          phone:'',
          department:''
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
      this.getInsiderData()
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
            let data = response.data || {}
            self.info.name = data.name
            self.info.phone = data.mobile
          })
          .catch(function (error) {
            console.log(error)
          })
      }
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
      isLogin: function () {
        let self = this
        let id = localStorage.getItem('id')
        let token = localStorage.getItem('token')
        axios.get(global.sso + '/user?token=' + token)
          .then(function (res) {
            if (res.data.err) {
              self.islogin = false
              localStorage.removeItem('token')
            } else {
              self.islogin = true
              self.avatarImage = global.avatarsrc + '/avatar/' + id + '.img?' + Date.parse(new Date()) / 1000
            }
          }).catch(function (error) {
          console.info(error)
        })
      },
      getInsiderData:function () {
    		console.log(123)
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
      preTo:function () {
        alert(456)
      },
      signout:function () {
    		console.log(234)
        let self = this
        Indicator.open()
    		let token = localStorage.getItem('token')
        axios.get(global.sso + '/signout?token='+token)
          .then(function (response) {
            Indicator.close()
            if (response.data.ret && response.data.ret == 1) {
              localStorage.removeItem('token')
              localStorage.removeItem('id')
              self.islogin = false
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
