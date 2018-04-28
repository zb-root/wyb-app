<template>
  <div>
    <mt-header fixed>
      <router-link to="/app/personal" slot="left">
        <mt-button icon="back">设置头像</mt-button>
      </router-link>
      <mt-button icon="more" slot="right" @click="option"></mt-button>
    </mt-header>
    <div class="head"></div>
    <div class="content_avatar">
      <mt-actionsheet :actions="actions" v-model="sheetVisible">
      </mt-actionsheet>

      <v-avatar></v-avatar>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import avatar from './avatar.vue'
  import { Toast, Actionsheet, Popup } from 'mint-ui'
  export default {
    data (){
      return {
        sheetVisible: false,
        actions: [
          {
            name: '从手机相册选择',
            method: this.trigger
          }
        ]
      }
    },
    mounted: function () {

    },
    methods: {
      option: function () {
        this.sheetVisible = true
      },
      trigger: function () {
        document.getElementById('change').click()
      }
    },
    components: {
      'v-avatar': avatar,
      'mt-actionsheet': Actionsheet
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.head
  height: 38px
.content_avatar
  text-align:center
  margin: 2rem 1rem 1rem 1rem
</style>
