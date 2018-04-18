<template>
  <div>
    <mt-header fixed>
      <router-link to="/app/user/userinfo" slot="left">
        <mt-button icon="back">邮箱</mt-button>
      </router-link>
      <mt-button slot="right" @click="save">保存</mt-button>
    </mt-header>
    <div class="head"></div>
    <mt-field label="邮箱" type="email" placeholder="请输入邮箱" v-model="email" v-bind:value="email" v-bind:state="stateemail" autofocus="autofocus"></mt-field>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  export default {
    data () {
      return {
        email: '',
        stateemail: ''
      }
    },
    mounted: function () {
      this.getinfo()
    },
    methods: {
      getinfo: function () {
        let self = this
        let id = localStorage.getItem('id')
        let token = localStorage.getItem('token')
        axios.get(global.users + '/' + id, {
          params: {
            token: token
          }
        }).then(function (response) {
          self.email = response.data.email
          console.info(response.data)
        }).catch(function (error) {
          console.info(error)
        })
      },
      save: function () {
        let self = this
        let id = localStorage.getItem('id')
        let token = localStorage.getItem('token')
        axios.post(global.users + '/' + id, {
          token: token,
          id: id,
          email: self.email
        }).then(function (response) {
          self.$router.push('/app/user/userinfo')
          console.info(response.data)
        }).catch(function (error) {
          console.info(error)
        })
      }
    },
    watch: {
      email (val, oldVal) {
        let self = this
        let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (reg.test(val)) {
          self.stateemail = 'success'
        } else {
          self.stateemail = 'error'
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .head
    height: 40px
</style>
