<template>
  <div>
    {{msg}}
  </div>
</template>

<script type="text/ecmascript-6">
//  import axios from 'axios'
//  import { Indicator } from 'mint-ui'
  export default {
    data () {
      return {
        msg: global.bank + '123456'
      }
    },
    mounted: function () {
//      this.closeIndicator()
//      this.getinfo()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
