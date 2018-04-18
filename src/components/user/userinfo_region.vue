<template>
  <div>
    <mt-header fixed>
      <router-link to="/app/user/userinfo" slot="left">
        <mt-button icon="back">地区</mt-button>
      </router-link>
      <mt-button slot="right" @click="save">保存</mt-button>
    </mt-header>
    <div class="head"></div>
    <mt-field label="地区" placeholder="请输入地区" v-model="region" v-bind:value="region" v-bind:state="stateregion"></mt-field>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  export default {
    data () {
      return {
        region: '',
        stateregion: ''
      }
    },
    mounted: function () {
      this.getinfo()
    },
    methods: {
      getinfo: function () {
        let self = this
        let id = localStorage.getItem('id')
        axios.get(global.users + '/' + id)
          .then(function (response) {
            self.region = response.data.region
            console.info(response.data)
          }).catch(function (error) {
            console.info(error)
          })
      },
      save: function () {
        let self = this
        let id = localStorage.getItem('id')
        axios.post(global.users + '/' + id, {
          id: id,
          region: self.region
        }).then(function (response) {
          self.$router.push('/app/user/userinfo')
          console.info(response.data)
        }).catch(function (error) {
          console.info(error)
        })
      }
    },
    watch: {
      region (val, oldVal) {
        let self = this
        if (val) {
          self.stateregion = 'success'
        } else {
          self.stateregion = 'error'
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .head
    height: 40px
</style>
