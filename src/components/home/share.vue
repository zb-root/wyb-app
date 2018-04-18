<template>
  <div>
    <div class="content_share" v-bind:style="{height:height}">
      <!--<img v-bind:src="imgurl + '?' + Math.random()">-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { MessageBox } from 'mint-ui'
  export default {
    data () {
      return {
        height: '',
        imgurl: ''
      }
    },
    mounted: function () {
      this.getheight()
      this.getimg()
    },
    methods: {
      getheight: function () {
        this.height = ((window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight) - 38) + 'px'
      },
      getimg: function () {
        let id = localStorage.getItem('id')
        if (id) {
          this.imgurl = global.apiHost + '/qrcode?text=' + encodeURIComponent(global.avatarsrc + '/#/register?creator=' + id)
        } else {
          MessageBox('提示', '请先登录！')
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.head
  height: 38px
.content_share
  background: url("../../assets/png/share.png") no-repeat
  width: 100%
  background-size:100%
  text-align: center
  img
    width:130px
    margin-top:98%
</style>
