<template>
  <div>
    <mt-header v-bind:title='title' fixed style="height:3rem; font-size:1.2em;background-color:#1E1E1E">/*background-color:#1A4B9C*/
      <router-link v-bind:to="leftNav" slot="left" v-if="isLeftNav">
        <!--<mt-button icon="back" style="font-size:0.8em">返回</mt-button>-->
        <mt-button style="font-size:0.8em;background-size:100% 100%;width:1.5rem;height:1rem;" v-bind:style="{backgroundImage:'url('+backImg+')'}"></mt-button>
      </router-link>
      <router-link v-bind:to="rightNav" slot="right" v-if="isRightTo">
        <mt-button style="font-size:0.8em">{{rightText}}</mt-button>
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
        isRightTo: this.rightNav ? true :false,
        backImg:require('../../assets/png/back.png')
      }
    },
    mounted: function () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .head
    height: 40px
</style>
