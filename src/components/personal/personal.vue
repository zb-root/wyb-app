<template>
  <div>
    <i-header title="个人中心" rightNav="/" ></i-header>
    <div style="clear:both;margin-top:0.5rem"></div>
    <div style="margin:20px 5px 20px 15px;padding:0;display: inline-block;vertical-align: top;">
      <div class="img" style="width:90px;height:100px;">
        <img src="../../assets/png/default_avatar.png" width="90px" alt="avatar"/>
      </div>
    </div>
    <div style="margin:30px 0px 0px;padding:0;display: inline-block;width:150px;height:100px;vertical-align: top;">
      <div v-if="!islogin">
        <router-link to="/app/login">立即登录</router-link>
      </div>
      <div v-if="islogin" style="font-size: 13px;">
        <div style="position:relative">
          <span>{{info.name}}</span>
          <img v-if="isInsider"  style="position: absolute; top:-3px;left:50px" src="../../assets/png/default_avatar.png" width="18px"/>
        </div>
        <div style="margin-top:15px;">
          <span>{{info.phone}}</span>
          <!--<router-link  to="/app/updatePhone/{{info.phone}}" slot="left" class="ptop"></router-link>-->
          <a style="text-decoration:underline;margin-left:12px" @click="toPath">修改</a>
        </div>
        <p v-if="isInsider"  style="margin-top:15px;">所属部门：{{info.department}}</p>
      </div>
    </div>

    <div @click="mySave">
      <mt-cell title="我的收藏" is-link >
        <img slot="icon" src="../../assets/png/default_avatar.png" width="24" height="24">
      </mt-cell>
    </div>

    <div @click="mySave">
      <mt-cell title="我的审核" is-link >
        <img slot="icon" src="../../assets/png/default_avatar.png" width="24" height="24">
      </mt-cell>
    </div>

    <div style="margin-top:1.5rem;text-align: center" v-if="islogin" >
      <mt-button type="primary" size="small" @click="signout"  style="width:100px;">退出登录</mt-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import header from '../header/header.vue'
  import {Cell,Toast,Indicator } from 'mint-ui'
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
        isInsider:false
      }
    },
    mounted: function () {
      this.isLogin()
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
