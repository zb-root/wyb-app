<template>
  <div>
    <mt-header title="帮助中心" fixed>
      <router-link to="/app/user/userconfig" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="head"></div>
    <div class="content_aboutus">
      <h1>1、通过关联手机找回密码？</h1>
      <p>
        答：若您的帐号已经关联手机，且手机号能正常使用，如果资料正确，马上可以取回密码。
      </p>
      <p>
        第一步，在登陆页面点击忘记密码
      </p>
      <p>
        第二步，在找回密码页面填写我的账号，即手机号码，并输入验证码，点击确认
      </p>
      <p>
        第三步，在设置密码页面输入新密码、确认密码，点击确认修改
      </p>
      <h1>2、如何进入财富榜？</h1>
      <p>
        答：第一步，消费者通过注册成为美夏惠诚用户。
      </p>
      <p>
        第二步，消费者通过消费送积分的方式，累计获得积分满2万，即可进入财富榜，获得创业机会。
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
