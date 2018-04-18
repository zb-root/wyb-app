<template>
  <div>
    <mt-header fixed>
      <router-link to="/app/user/userinfo" slot="left">
        <mt-button icon="back">昵称</mt-button>
      </router-link>
      <mt-button slot="right" @click="save">保存</mt-button>
    </mt-header>
    <div class="head"></div>
    <mt-field label="昵称" type="text" placeholder="请输入昵称" v-model="nick" v-bind:value="nick" v-bind:state="statenick" autofocus="autofocus"></mt-field>
  </div>
</template>

<script type="text/ecmascript-6">
import axios from 'axios'
export default {
  data () {
    return {
      nick: this.$route.params.nick,
      statenick: ''
    }
  },
  methods: {
    save: function () {
      let self = this
      let id = localStorage.getItem('id')
      let token = localStorage.getItem('token')
      axios.post(global.users + '/' + id, {
        token: token,
        id: id,
        nick: self.nick
      }).then(function (response) {
        self.$router.push('/app/user/userinfo')
        console.info(response.data)
      }).catch(function (error) {
        console.info(error)
      })
    }
  },
  watch: {
    nick (val, oldVal) {
      let self = this
      if (val) {
        self.statenick = 'success'
      } else {
        self.statenick = 'error'
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .head
    height: 40px
</style>
