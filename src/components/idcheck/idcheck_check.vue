<template>
  <div>
    <div style="position:relative;padding:1rem 1rem;background-color:#1A4B9C;">
      <div>
        <input type="text" v-model="search" style="box-sizing:border-box; width:100%;height:2.5rem;font-size:15px;padding:0 1rem;" placeholder="根据标识搜索"/>
        <span></span>
      </div>
      <div style="position:absolute;top:1.1rem;right:1.5rem;" @click="getdata">
        <img src="../../assets/png/search.png" height="36px" width="36px" slot="icon">
      </div>

      <mt-popup v-model="popupVisible" popup-transition="popup-fade" position="top" style="margin-top:5em; padding: 8px; border-radius: 10px">
        <div v-for="id in ids">
          <p class="ids" style="padding: 5px" @click="getid(id)">{{id}}</p>
        </div>
      </mt-popup>
    </div>

    <div id="nodata" style="display: none">
      <p style="text-align: center;margin-top: 60%">没有数据哦！</p>
    </div>
    <div id="content" style="margin: 1em 0.3em 0.3em 0.3em;display: none">
      <p class="title1" style="padding: 2px;">|  {{detail.chemicalName || ''}}</p><hr/>
      <p class="title2">标识编码：{{detail._id || ''}}</p>
      <p class="title2">是否合法：是</p>
      <p class="title2">最新状态：{{state}}</p>

      <p v-if="company" class="title2" >生产日期：{{crtime}}</p>
      <p class="title2">生产规格：{{detail.amount}}{{detail.unit}}</p>
      <p v-if="company" class="title2">生产厂家：{{company}}</p>
      <div style="width:100%; height:1em; background-color: #F7F7F7"></div>

      <p v-if="flowtos.length !== 0" class="title1" style="padding: 2px;">|  流转详情  ({{daterange}})
      </p><hr/>
      <div v-for="flowto in flowtos">
        <div style="margin: 5px; padding: 3px; background: #F8F9FC">
          <p class="title3">登记时间：{{flowto.regtime | moment('YYYY-MM-DD')}}</p>
          <p v-if="flowto.type === 1" class="title3">生产数量：{{flowto.amount}}{{flowto.unit}}</p>
          <p v-if="flowto.type === 2" class="title3">销售数量：{{flowto.amount}}{{flowto.unit}}</p>
          <p v-if="flowto.type === 3" class="title3">购买数量：{{flowto.amount}}{{flowto.unit}}</p>
          <p v-if="flowto.type === 4" class="title3">使用数量：{{flowto.amount}}{{flowto.unit}}</p>
          <p v-if="flowto.type === 5" class="title3">处置数量：{{flowto.amount}}{{flowto.unit}}</p>
          <p v-if="flowto.type === 6" class="title3">转让数量：{{flowto.amount}}{{flowto.unit}}</p>
          <p v-if="flowto.type === 7" class="title3">丢失/被盗数量：{{flowto.amount}}{{flowto.unit}}</p>

          <p v-if="flowto.type === 1" class="title3">生产厂家：{{flowto.company.name}}</p>
          <p v-if="flowto.type === 2" class="title3">销售厂家：{{flowto.company.name}}</p>
          <p v-if="flowto.type === 3" class="title3">购买厂家：{{flowto.company.name}}</p>
          <p v-if="flowto.type === 4" class="title3">使用厂家：{{flowto.company.name}}</p>
          <p v-if="flowto.type === 5" class="title3">处置厂家：{{flowto.company.name}}</p>
          <p v-if="flowto.type === 6" class="title3">转让单位：{{flowto.company.name}}</p>
          <p v-if="flowto.type === 6" class="title3">接收单位：{{flowto.ext.company.name}}</p>
          <p v-if="flowto.type === 7" class="title3">丢失/被盗厂家：{{flowto.company.name}}</p>

          <p class="title3">标识状态：
            <span class="type" style="color:#F76209; border-color: #F76209" v-if="flowto.type === 1">生产</span>
            <span class="type" style="color:#0000FF; border-color: #0000FF" v-if="flowto.type === 2">销售</span>
            <span class="type" style="color:#00FF80; border-color: #00FF80" v-if="flowto.type === 3">购买</span>
            <span class="type" style="color:#800080; border-color: #800080" v-if="flowto.type === 4">使用</span>
            <span class="type" style="color:#FFFF00; border-color: #FFFF00" v-if="flowto.type === 5">处置</span>
            <span class="type" style="color:#00FFFF; border-color: #00FFFF" v-if="flowto.type === 6">转让</span>
            <span class="type" style="color:#E80500; border-color: #E80500" v-if="flowto.type === 7">丢失/被盗</span>
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
  export default {
    data() {
      return {
        search:'',
        code: '',
        popupVisible: false,
        ids: [],
        detail: {},
        company: '',
        crtime: '',
        ownership: '',
        state: '',
        flowtos: {},
        daterange: ''
      }
    },
    mounted: function () {
    },
    methods: {
      getdata: function () {       //模糊搜索  标识编码
        Indicator.open({spinnerType: 'fading-circle'})
        this.company = ''
        document.getElementById('content').style.display = 'none'
        let self = this
        axios.get(global.company+'/signSearch?search='+self.search,{
        })
          .then(function (response) {
            let data = response.data || {}
            self.ids = data.rows
            Indicator.close()
            if(self.search && data.rows.length>0){
              self.popupVisible = true
              document.getElementById('nodata').style.display = 'none'
            }else{
              document.getElementById('nodata').style.display = 'block'
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      getid: function (param) {
        this.search = param
        this.popupVisible = false
        this.code = param
        let self = this
        //标识基本信息
        Indicator.open({spinnerType: 'fading-circle'})
        axios.get(global.company+'/signInfo?id='+param,{
        })
          .then(function (response) {
            self.detail = response.data || {}
            Indicator.close()
            self.detail.factoryInfo? self.company=self.detail.factoryInfo.company.name : ''
            self.detail.factoryInfo? self.crtime=self.detail.factoryInfo.crtime : ''
            self.crtime = moment(self.detail.factoryInfo? self.detail.factoryInfo.crtime : '').format('YYYY-MM-DD')
            self.detail.storageInfo? self.ownership=self.detail.storageInfo.companyName : ''
            switch (self.detail.state) {
              case 0:
                self.state = '新生成-可用于生产'
                break;
              case 1:
                self.state = '已生产入库-可用于使用、销售和处置'
                break;
              case 2:
                self.state = '已销售出库-可用于运输登记和购买入库'
                break;
              case 3:
                self.state = '已购买入库-可用于使用、销售和处置'
                break;
              case 4:
                self.state = '已使用出库-可用于回库'
                break;
              case 5:
                self.state = '已处置-不可用'
                break;
              case 6:
                self.state = '已转让-不可用'
                break;
              case 7:
                self.state = '已丢失被盗-不可用'
                break;
            }
            document.getElementById('content').style.display = 'block'
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
    border-radius: 5px
    /*color: #30D17C*/
  }
</style>
