<template>
  <div>
    <mt-header title="关于我们" fixed>
      <router-link to="/app/user/userconfig" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="head"></div>
    <div class="content_aboutus">
      <p>
        美夏惠诚公司是从事网上购物的专业电子商务平台，现已成为国内专业购物网站，美夏惠诚公司目前经营有物美价廉商品。以齐全的商品种类、可靠的商品质量、
        最低的商品价格、灵活多样的微信订购方式、快捷周到的服务，赢得了广大消费者的信任和好评。 美夏惠诚公司自成立以来，坚持“以爱领众，以诚惠民”的理念，
        以良好的信誉和高质量的客户服务。完善的资质、专业规范的进货渠道、品质承诺、优质的服务口碑，确立了美夏惠诚将成为中国电子商务领先品牌。用户还可以通过美夏惠诚消费积分兑现礼品。
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
  .content_aboutus
    margin: 1rem
    p
      line-height: 25px
      color: #555555
      font-size: 14px
      text-indent: 30px
</style>
