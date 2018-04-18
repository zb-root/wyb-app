<template>
  <div>
    <mt-header fixed class="sub_top">
      <!--<router-link to="/products/order" slot="left">-->
        <mt-button icon="back" class="sub_btn" slot="left" @click="back">返回</mt-button>
      <!--</router-link>-->
    </mt-header>
    <div class="head"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    methods: {
      back: function () {
        this.$router.back(-1)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .sub_top
    background: #fff
    border-bottom: 1px solid #f0f0f0
  .sub_top .sub_btn
    color: #666
  .head
    height: 38px
</style>
