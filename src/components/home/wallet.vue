<template>
  <div>
    <mt-header fixed>
      <router-link to="/app/home" slot="left">
        <mt-button icon="back">余额</mt-button>
      </router-link>
    </mt-header>
    <div class="head"></div>

    <div class="self_wallet">
      <p class="p1">账户余额（元）</p>
      <p class="p2">{{integral}}</p>
    </div>
    <div class="list_wallet">
      <mt-cell title="明细" to="/app/home/walletdatail" is-link >
        <span></span>
        <img slot="icon" src="../../assets/svg/icon/integral_detail.svg" width="24" height="24"/>
      </mt-cell>
      <div class="line_wallet"></div>
      <mt-cell title="充值"  is-link >
        <span></span>
        <img slot="icon" src="../../assets/svg/icon/wallet_in.svg" width="24" height="24"/>
      </mt-cell>
      <mt-cell title="提现"  is-link >
        <span></span>
        <img slot="icon" src="../../assets/svg/icon/wallet_out.svg" width="24" height="24"/>
      </mt-cell>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  export default {
    data () {
      return {
        integ: 0,
        integral: '0.00'
      }
    },
    mounted: function () {
      this.isLogin()
      this.getinfo()
    },
    methods: {
      isLogin () {
        let self = this
        let token = localStorage.getItem('token')
        axios.get(global.sso + '/user?token=' + token)
          .then(function (res) {
            if (res.data.err) {
              localStorage.clear()
              self.$router.push('/login')
            }
          }).catch(function (error) {
            console.info(error)
          })
      },
      getinfo: function () {
        let self = this
        let id = localStorage.getItem('id')
        let token = localStorage.getItem('token')
        axios.get(global.apiHost + '/cny/' + id, {
          params: {
            token: token
          }
        }).then(function (response) {
          console.info(response.data)
          if (response.data.amount) {
            self.integ = response.data.amount
            let integ = self.integ.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            self.integral = integ
          }
        }).catch(function (error) {
          console.info(error)
        })
      }
    },
    components: {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .head
    height: 38px
  .self_wallet
    height:120px
    background-color: #38C790
    padding:10px 0 10px
    /*text-align:center*/
    img
      width: 50px
      height: 50px
      text-align:center
    .p1
      color:#eeeeee
      padding:16px 0 0 20px
      font-size:13px
      span
        color:#1864EF
    .p2
      padding:35px 0 0 16px
      font-size:40px
      color:#ffffff
      /*text-align:center*/
  .line_wallet
    height: 10px
    background-color: #f0f0f0
</style>
