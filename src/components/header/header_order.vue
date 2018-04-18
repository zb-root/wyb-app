<template>
  <div>
    <mt-header class="order_top" fixed>
      <router-link to="/" slot="left">
        <mt-button icon="back" class="sub_btn">我的订单</mt-button>
      </router-link>
      <!--<router-link to="/" slot="right">-->
        <!--<mt-button icon="more" class="sub_btn"></mt-button>-->
      <!--</router-link>-->
    </mt-header>
    <div class="head"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .order_top
    background: #fff
    border-bottom: 1px solid #f0f0f0
  .order_top .sub_btn
    color: #666
  .head
    height: 38px
</style>
