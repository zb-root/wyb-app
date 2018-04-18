<template>
  <div id="play_bg" class="play_bg" v-bind:style="{height:height,width:width}">
    <div class="play_vediotop">
      <div id="video" v-bind:style="{display:display}">
        <!--视频-->
        <canvas id="jsmpeg-player" style="position: absolute; overflow: hidden"></canvas>
        <canvas id="jsmpeg-player2" style="position: absolute; overflow: hidden"></canvas>
      </div>
      <div class="avatar">
        <img src="../../assets/png/play/avatar.png" width="50%" style="display: inline-block;float: left"/>
        <div style="color: #fff;line-height: 1.3rem;font-size: 14px;position: relative; left: 0.5rem">
          <span style="display: inline-block">暗礁...</span>
          <span style="display: inline-block">排队中</span>
        </div>
      </div>
      <div class="timeout">&nbsp;&nbsp;游戏时间： 26s&nbsp;&nbsp;</div>
      <img class="camera" src="../../assets/png/play/camera.png" width="25%" @click="changeCarema"/>
    </div>
    <div class="play_btngroup" id="play_btngroup">
      <div class="play_chat btn-item">
        <img src="../../assets/png/play/chat.png" width="50%"/>
      </div>
      <div class="play_start btn-item">
        <span style="font-size: 1.3rem" @click="startPlay">开始游戏</span><br/>
        <span>本次10币</span>
      </div>
      <div class="play_charge btn-item">
        <span style="color: #fff">余额：110币</span><br/>
        <span class="play_tocharge">+7去充币</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {AgoraCMH5SDK} from '../../lib/agoracmh5sdk.min'
  import jm from '../../lib/jm-ms'
  export default {
    data () {
      return {
        height: '',
        width: '',
        display: 'none',
        imgurl: '',
        uri_api: 'http://api.h5.jamma.cn/signaling',
        uri_server: 'ws://api.wawa.gzleidi.cn',
        appid: '54ad432ae1d3480998aca0df97837c9e',
        client: '',
        channelKey: '',
        h5client: '',
        vedioState: false
      }
    },
    mounted: function () {
      this.getheight()
      this.getChannelkey()
    },
    methods: {
      getheight: function () {
        this.height = (window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight) + 'px'
        this.width = (window.innerWidth || document.body.innerWidth || document.documentElement.innerWidth)
        this.setwidth()
      },
      setwidth: function () {
        let play1 = document.getElementById('jsmpeg-player')
        play1.style.width = (window.innerWidth || document.body.innerWidth || document.documentElement.innerWidth) + 'px'
        play1.style.transform = 'scale(1, 1.7)'
        let play2 = document.getElementById('jsmpeg-player2')
        play2.style.width = (window.innerWidth || document.body.innerWidth || document.documentElement.innerWidth) + 'px'
        play2.style.transform = 'scale(1, 1.7)'
      },
      getChannelkey: function () {
        let self = this
        if (global.appCertificate) {
          jm.ms.client({
            uri: self.uri_api
          }, function (err, doc) {
            if (err) {
              console.info(err)
            }
            let client = doc
            client.get('channelKey', {
              channelName: 3399,
              uid: 0
            }, function (err, doc) {
              if (err) {
                alert('获取频道失败！')
              } else {
                alert('获取频道失败！')
                self.channelKey = doc.key
                self.join()
              }
            })
          })
        } else {
          self.join()
        }
      },
      join: function () {
        let self = this
        self.client = AgoraCMH5SDK.createClient()
        self.client.init(self.appid, '3399', {
          key: '',
          uid1: 1,
          uid2: 2
        }, function () {
          self.client.play({
            canvas1: 'jsmpeg-player',
            canvas2: 'jsmpeg-player2'
          }, function () {
            self.display = 'block'
            console.log('started playing..')
          })
        })
        self.h5client = self.client
      },
      changeCarema: function () {
        this.h5client.switchCamera()
      },
      startPlay: function () {
        this.$router.push('/app/home/start')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .play_bg
    background-color: #FF4E88
    margin: 0 auto
    .play_vediotop
      #video
        position: absolute
        top: 94px
        display: flex;
        align-items: center;
        justify-content: center;
      .camera
        position: fixed
        top: 30%
        right: -8%
        background: none
      .avatar
        position: fixed
        margin: 0.5rem
      .timeout
        position: fixed
        right: 0
        color #fff
        background-color: rgba(92,96,100,0.5)
        font-size 12px
        margin: 1rem
        padding: 0.3rem
        border-radius: 20px
    .play_btngroup
      position: relative
      top: 80%
      display: flex
      .btn-item
        text-align: center
        flex: 1
      .play_start
        height: 3rem
        line-height: 1.5rem
        background: #FEDA3F
        color: #ffffff
        border-radius: 30px
        padding: 0.5rem
      .play_charge
        line-height: 2rem
        .play_tocharge
          background-color: #ffffff
          padding: 0.3rem
          border-radius: 5px
          color: #FF4E88
    .play_direction
      margin: 0 1rem
      position: relative
      top: 81%
      display: flex
      .btn-item
        text-align: right
        flex: 1
        .img2
          position:relative
          top: -40%
        .img4
          position:relative
          bottom: 5%
          right: 34%
        .img5
          position:relative
          right: 15%
</style>
