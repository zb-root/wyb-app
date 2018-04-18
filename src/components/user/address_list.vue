<template>
<div>
  <mt-header fixed>
    <router-link to="/app/user/userinfo" slot="left">
      <mt-button icon="back">收货地址管理</mt-button>
    </router-link>
    <router-link to="/app/user/userinfo/addressedit" slot="right">
      <mt-button>新增</mt-button>
    </router-link>
  </mt-header>
  <div class="head"></div>

  <div v-if="addresss.length > 0">
    <mt-cell :title="val.name + ' ' + val.mobile" :label="val.province + val.city + val.area + val.address + ''"
             style="padding-bottom: 0.8rem" v-for="(val, index) in addresss" :key="val._id"
             :to="{path: '/app/user/userinfo/addressedit/' + val._id}" is-link>
    </mt-cell>
  </div>
  <div v-if="addresss.length === 0">
    <router-link to="/app/user/userinfo/addressedit">
      <p style="text-align: center;"><img src="../../assets/svg/add.svg" style="width: 30%;margin: 10%"/></p>
      <p style="text-align: center; color: #eeeeee">请添加新地址</p>
    </router-link>
  </div>

</div>
</template>

<script type="text/ecmascript-6">
import axios from 'axios'
export default {
  data () {
    return {
      addresss: []
    }
  },
  mounted: function () {
    this.getinfo()
  },
  methods: {
    getinfo: function () {
      let self = this
      let token = localStorage.getItem('token')
      axios.get(global.shop + '/addresses', {
        params: {
          token: token
        }
      }).then(function (res) {
        self.addresss = res.data.rows
      }).catch(function (error) {
        console.info(error)
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .head
    height: 38px
</style>
