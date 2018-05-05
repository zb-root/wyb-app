<template>
  <div>
    <div style="position:relative;padding:1rem 1rem;background-color:#1A4B9C;">
      <div>
        <input type="text" v-model="search" style="box-sizing:border-box; width:100%;height:2.5rem;font-size:15px;padding:0 2.5rem 0 2.5rem;" placeholder="根据标识搜索"/>
        <span></span>
      </div>
      <div style="position:absolute;top:1.2rem;left:1.3rem;" @click="getid(search)">
        <img src="../../assets/png/search.png" height="36px" width="36px" slot="icon">
      </div>
      <div style="position:absolute;top:1.5rem;right:1.8rem;" @click="scan">
        <img src="../../assets/png/rqcode.png"  width="25px" slot="icon" >
      </div>

      <!--<mt-popup v-model="popupVisible" popup-transition="popup-fade" position="top" style="margin-top:5em; padding: 8px; border-radius: 10px">-->
        <!--<div v-for="id in ids">-->
          <!--<p class="ids" style="padding: 5px" @click="getid(id)">{{id}}</p>-->
        <!--</div>-->
      <!--</mt-popup>-->
    </div>

    <div id="nodata" style="display: none">
      <p style="text-align: center;margin-top: 60%">没有检索到匹配的标识！</p>
    </div>
    <div id="content" style="margin: 1em 0.3em 0.3em 0.3em;display: none">
      <p class="title1" style="padding: 2px;">|  {{detail.chemicalName || ''}}</p>
      <div style="border-bottom: 1px solid #CCCCCC"></div>
      <p class="title2">标识编码：{{detail._id || ''}}</p>
      <p class="title2">是否合法：是</p>
      <p class="title2">最新状态：<span v-if="detail.state!==4 && detail.state!==5 && detail.state!==7" style="font-weight: bold">{{state}}</span><span v-if="detail.state===4 || detail.state===5 || detail.state===7" style="color: #FF0000;font-weight: bold">{{state}}</span></p>

      <p v-if="company" class="title2" >生产日期：{{crtime}}</p>
      <p class="title2">生产规格：{{detail.amount}} {{detail.unit}}</p>
      <p v-if="company" class="title2">生产单位：{{company}}</p>
      <div style="border-bottom: 1px solid #CCCCCC"></div>
      <p class="title2" style="">归属企业：{{storageInfo}}</p>
      <p class="title2">是否可用：<span v-if="detail.state!==4 && detail.state!==5 && detail.state!==7" style="font-weight: bold">{{available}}</span><span v-if="detail.state===4 || detail.state===5 || detail.state===7" style="color: #FF0000;font-weight: bold">{{available}}</span>
      </p>
      <div style="width:100%; height:1em; background-color: #F7F7F7"></div>

      <div style="border-bottom: 1px solid #DDDDDD">
        <p class="title1" style="padding: 2px;">|  流转详情
          <span style="font-size: 0.9em">({{daterange}})</span>
        </p>
      </div>
      <div v-for="(flowto, index) in flowtos">
        <div class="flow1" v-bind:class="{flow2: index%2}">
          <p class="title3">登记时间：{{flowto.regtime | moment('YYYY-MM-DD')}}</p>
          <p v-if="flowto.type === 1" class="title3">生产数量：{{flowto.amount}} {{flowto.unit}}</p>
          <p v-if="flowto.type === 2" class="title3">销售数量：{{flowto.amount}} {{flowto.unit}}</p>
          <p v-if="flowto.type === 3" class="title3">购买数量：{{flowto.amount}} {{flowto.unit}}</p>
          <p v-if="flowto.type === 4" class="title3">使用数量：{{flowto.amount}} {{flowto.unit}}</p>
          <p v-if="flowto.type === 5" class="title3">处置数量：{{flowto.amount}} {{flowto.unit}}</p>
          <p v-if="flowto.type === 6" class="title3">转让数量：{{flowto.amount}} {{flowto.unit}}</p>
          <p v-if="flowto.type === 7" class="title3">丢失/被盗数量：{{flowto.amount}} {{flowto.unit}}</p>

          <p v-if="flowto.type === 1" class="title3">生产单位：{{flowto.company.name}}</p>
          <p v-if="flowto.type === 2" class="title3">销售单位：{{flowto.company.name}}</p>
          <p v-if="flowto.type === 3" class="title3">购买单位：{{flowto.company.name}}</p>
          <p v-if="flowto.type === 4" class="title3">使用单位：{{flowto.company.name}}</p>
          <p v-if="flowto.type === 5" class="title3">处置单位：{{flowto.company.name}}</p>
          <p v-if="flowto.type === 6" class="title3">转让单位：{{flowto.company.name}}</p>
          <!--<p v-if="flowto.type === 6" class="title3">接收单位：{{flowto.ext.company.name}}</p>-->
          <p v-if="flowto.type === 7" class="title3">丢失/被盗单位：{{flowto.company.name}}</p>

          <p class="title3">标识状态：
            <span class="type" style="color:#0000FF; border-color: #0000FF" v-if="flowto.type === 1">生产</span>
            <span class="type" style="color:#0000FF; border-color: #0000FF" v-if="flowto.type === 2">销售</span>
            <span class="type" style="color:#0000FF; border-color: #0000FF" v-if="flowto.type === 3">购买</span>
            <span class="type" style="color:#FF0000; border-color: #FF0000" v-if="flowto.type === 4">使用</span>
            <span class="type" style="color:#FF0000; border-color: #FF0000" v-if="flowto.type === 5">处置</span>
            <span class="type" style="color:#0000FF; border-color: #0000FF" v-if="flowto.type === 6">转让</span>
            <span class="type" style="color:#FF0000; border-color: #FF0000" v-if="flowto.type === 7">丢失/被盗</span>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import moment from 'moment'
  import header from '../header/header.vue'
  import {Search,Toast,Indicator,Popup } from 'mint-ui'
  import wx from 'weixin-js-sdk'
  export default {
    data() {
      return {
        search:'',
        code: '',
        popupVisible: false,
        ids: [],
        detail: {},
        company: '',
        storageInfo: '',
        available: '',
        crtime: '',
        ownership: '',
        state: '',
        flowtos: {},
        daterange: ''
      }
    },
    mounted: function () {
    	this.initConfig()
    },
    methods: {
      initConfig:function () {
        let url = location.href.split('#')[0]
        axios.get(global.wechat+'/api/jsconfig?url='+url,{})
          .then(function (res) {
            console.log(res.data)
            let data = res.data || {}
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: data.appId, // 必填，公众号的唯一标识
              timestamp: data.timestamp, // 必填，生成签名的时间戳
              nonceStr: data.nonceStr, // 必填，生成签名的随机串
              signature: data.signature,// 必填，签名
              jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表
            });
            wx.error(function(res){
              // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
              alert(res)
            });
          })
      },
      scan:function () {
        let self = this
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            let resultStr = res.resultStr || ''; // 当needResult 为 1 时，扫码返回的结果
            let data = resultStr.split(',')
            if(data.length > 1){      //条形码会有一个生成编码，生成编码跟实际数据用,分开，取第二个
              let id = data[1]
              self.search = id
              self.getid(id)
            }else{                //二维码直接是数据
              self.search = resultStr
              self.getid(resultStr)
            }
          }
        });
      },
//      getdata: function () {       //模糊搜索  标识编码
//        Indicator.open({spinnerType: 'fading-circle'})
//        this.company = ''
//        document.getElementById('content').style.display = 'none'
//        let self = this
//        axios.get(global.company+'/signSearch?search='+self.search,{
//        })
//          .then(function (response) {
//            let data = response.data || {}
//            self.ids = data.rows
//            Indicator.close()
//            if(self.search && data.rows.length>0){
//              self.popupVisible = true
//              document.getElementById('nodata').style.display = 'none'
//            }else{
//              document.getElementById('nodata').style.display = 'block'
//            }
//          })
//          .catch(function (error) {
//            console.log(error)
//          })
//      },
      getid: function (param) {
        let id = null
        param? id = param : id=null
        this.popupVisible = false
        this.code = param
        let self = this
        //标识基本信息
        Indicator.open({spinnerType: 'fading-circle'})
        axios.get(global.company+'/signInfo?id='+param,{
        })
          .then(function (response) {
            self.detail = response.data || {}
            if(self.detail._id){
              self.detail.factoryInfo? self.company=self.detail.factoryInfo.company.name : ''
              self.detail.storageInfo? self.storageInfo=self.detail.storageInfo.companyName : ''
              self.detail.factoryInfo? self.crtime=self.detail.factoryInfo.crtime : ''
              self.crtime = moment(self.detail.factoryInfo? self.detail.factoryInfo.crtime : '').format('YYYY-MM-DD')
              self.detail.storageInfo? self.ownership=self.detail.storageInfo.companyName : ''
              switch (self.detail.state) {
                case 0:
                  self.state = '新生成'
                  self.available = '可用'
                  break;
                case 1:
                  self.state = '生产'
                  self.available = '可用'
                  break;
                case 2:
                  self.state = '销售'
                  self.available = '可用'
                  break;
                case 3:
                  self.state = '购买'
                  self.available = '可用'
                  break;
                case 4:
                  self.state = '使用'
                  self.available = '不可用'
                  break;
                case 5:
                  self.state = '处置'
                  self.available = '不可用'
                  break;
                case 6:
                  self.state = '转让'
                  self.available = '可用'
                  break;
                case 7:
                  self.state = '丢失被盗'
                  self.available = '不可用'
                  break;
              }
              document.getElementById('nodata').style.display = 'none'
              document.getElementById('content').style.display = 'block'
            }else{
              document.getElementById('content').style.display = 'none'
              document.getElementById('nodata').style.display = 'block'
            }
            Indicator.close()

          })
          .catch(function (error) {
            console.log(error)
          })
        //流向信息
        axios.get(global.company+'/tracks?signCode='+param,{
        })
          .then(function (response) {
            self.flowtos = response.data.rows || {}
            self.flowtos.length>0? self.daterange = moment(self.flowtos[0].regtime).format('YYYY-MM-DD') + '至' + moment(self.flowtos[self.flowtos.length-1].regtime).format('YYYY-MM-DD') : ''
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .title1{
    font-size: 1em
    color: #1B4A9C
    font-weight: 600
    margin: 5px
    /*border-left: 1px solid #5959FD*/
  }
  .title2{
    font-size: 0.9em
    color:#666666
    font-weight: 600
    margin: 8px
  }
  .title3{
    font-size: 0.9em
    color:#444444
    margin: 8px
  }
  .ids:hover{
    background-color: #98D6FF
  }
  .type{
    padding: 0 5px 0 5px
    border: 1px solid #30D17C
    border-radius: 3px
  }
  .flow1{
    margin: 5px
    padding: 3px
  }
  .flow2{
    margin: 5px
    padding: 3px
    background: #F8F9FC
  }
</style>
