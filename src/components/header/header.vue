<template>
  <div>
    <mt-header v-bind:title='title' fixed>
      <router-link v-bind:to="leftNav" slot="left" v-if="isLeftNav">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <router-link v-bind:to="rightNav" slot="right" v-if="isRightTo">
        <mt-button>{{rightText}}</mt-button>
      </router-link>
    </mt-header>
    <div class="head"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  export default {
  	name:'header',
    props:['leftNav','rightNav','rightText','title'],
    data () {
      return {
      	isLeftNav:this.leftNav ? true : false,
        isRightTo: this.rightNav ? true :false
      }
    },
    mounted: function () {
      this.isLogin()
    },
    methods: {
      isLogin: function () {
      	console.log(123)
        console.log(this.rightText)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .head
    height: 30px
</style>
