<template>
  <div>
    <mt-header title="客服中心" fixed >
      <router-link to="/app/home" slot="left">
        <mt-button icon="back" >返回</mt-button>
      </router-link>
    </mt-header>
    <div class="head"></div>
    <div class="self_customer">
      <p class="p1">服务时间：</p>
      <p class="p2">周一至周日  09:00—18:00</p>
    </div>
    <div class="content_customer">
      <p class="p1" style="display: none">
        <label>客服 QQ：</label>
        <span>开始交谈</span>
      </p>
      <p class="p2">
        <label>客服电话：</label>
        <span>020-8888888</span>
      </p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .head
    height: 38px
  .self_customer
    height:80px
    background-color: rgba(134,215,130,0.2)
    padding:20px 0 0
    color: #555555
    .p1
      padding:6px 0 6px 20px
      font-weight:bold
      font-size:18px
    .p2
      padding:6px 0 6px 20px
      font-size:16px
  .content_customer
    padding: 1rem
    .p1
      margin:2rem 0 3rem 1rem
      span
        margin-left: 2rem
        background-color: #00a0e9
        padding:0.5rem
        color: #ffffff
    .p2
      margin:2rem 0 3rem 1rem
      span
        margin-left: 2rem
        padding:0.5rem
        color: #5DAF41
        border: 1px dashed #5DAF41
</style>
