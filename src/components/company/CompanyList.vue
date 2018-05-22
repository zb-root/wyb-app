<template>
  <div v-bind:style="{height:height}" v-bind:class="{'mengban':noPremission}">
    <!--<i-header title="企业搜索"></i-header>-->
    <div style="position:absolute;top:30%;padding:0 1rem;width:100%;text-align: center;box-sizing: border-box;height:15rem;" v-if="noPremission">
      <p style="line-height:2.5rem;height:2.5rem;background-color:#1A4B9C;color:white;font-size:1.1em;">温馨提示</p>
      <div style="background:white;padding-bottom: 2rem;">
        <img src="../../assets/inside/nopermission.png" style="width:1.5rem;margin-top:2rem;"/>
        <p style="line-height:2rem;height:2rem;color:#4275D1;margin-top:0.5rem;font-size:1.05em;font-weight: 600">您不是实名认证用户没有权限使用企业查询</p>
      </div>
    </div>
    <div style="position:fixed;width:100%;background-color:white !important;z-index:100;top:0rem;" v-if="isValidate">
      <div style="position:relative;padding:1rem 1rem;background-color:#1A4B9C;">
        <div>
          <input type="text" v-model="search" style="box-sizing:border-box; width:100%;height:2.5rem;font-size:15px;padding:0 1rem;" placeholder="搜索企业信息"/>
          <span></span>
        </div>
        <div style="position:absolute;top:1.1rem;right:1.5rem;" @click="getdata(0)">
          <img src="../../assets/png/search.png" height="36px" width="36px" slot="icon">
        </div>
      </div>

      <div class="select" style="font-size:0;box-sizing: border-box;">
        <div class="seldiv" v-bind:style="{'background':'url('+selImg+') repeat'}">
          <select v-model="province">
            <option selected value="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;省份</option>
            <option v-for="province in provinceList" v-bind:value="province.code">{{province.name}}</option>
          </select>
          <img class="down" src="../../assets/png/down.png"/>
        </div>

        <div class="seldiv" v-bind:style="{'background':'url('+selImg+') repeat'}">
          <div class="specrator"></div>
          <select v-model="city">
            <option selected value="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;市</option>
            <option v-for="city in cityList" v-bind:value="city.code">{{city.name}}</option>
          </select>
          <img class="down" src="../../assets/png/down.png"/>
        </div>

        <div class="seldiv" v-bind:style="{'background':'url('+selImg+') repeat'}">
          <div class="specrator"></div>
          <select v-model="product">
            <option selected value="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;产品</option>
            <option v-for="item in proList" v-bind:value="item.name">{{item.name}}</option>
          </select>
          <img class="down" src="../../assets/png/down.png"/>
        </div>

        <div class="seldiv" v-bind:style="{'background':'url('+selImg+') repeat'}">
          <div class="specrator"></div>
          <select v-model="type">
            <option selected value="">企业类型</option>
            <option value="生产">生产</option>
            <option value="经营">经营</option>
            <option value="储存">储存</option>
            <option value="使用">使用</option>
            <option value="运输">运输</option>
            <option value="处置">处置</option>
          </select>
          <img class="down" src="../../assets/png/down.png" />
          <!--<div style="display:inline-block;width:20%;height:3rem;background-repeat: no-repeat" v-bind:style="{'backgroundImage':'url('+downImg+')'}"></div>-->
        </div>
      </div>
      <p style="line-height: 3rem;color:#aaa;font-size:0.85em;padding-left:1em;">检索到 <span style="color:red;">{{total}}</span> 家企业</p>
    </div>

    <div style="width:100%;margin-top:10.5rem;" v-if="isValidate">
      <ul
        ref="loadmore"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
        autoFill="false"
        topLoadingText="加载中">
        <li v-for="item in itemlist"  style="display: block" @click="detail(item._id)">
          <div>
            <div style="width:100%;height:0.8rem;background-color:#F7F7F7;"></div>
            <div style="min-height:9rem;padding:17px 13px 5px 13px;position:relative;">

              <div style="font-size:16px;color:#134498;position:relative;box-sizing:border-box;">
                <!--<img src="../../assets/company/chemical.png" style="width:1rem;height:1rem;position:absolute;top:-0.1rem;left:0rem">-->
                <div style="display:inline-block;float:left;width:75%;line-height: 25px">
                  <span style="font-weight: bold">| </span>  <span v-html="handleSearchText(item.name)"></span>
                </div>
              </div>
              <div style="clear:both;"></div>

              <div style="border-top:1px solid #DDD;margin-top:0.6rem"></div>
              <div style="position:absolute;top:1rem;right:1rem;">
                <img style="width:3.5rem;height:1.2rem;" src="../../assets/png/renzhen.png" />
              </div>
              <ul style="margin-top:0.6rem">
                <li class="productT" v-for="productType in item.operationModes" v-bind:style="{'color':handleColor(productType),'border-color':handleColor(productType)}">{{productType}}</li>
              </ul>
              <div style="font-size: 14px;color:#999;line-height: 20px;margin-top: 10px">
                <p style="display:inline-block;width:95%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                  <img src="../../assets/png/company/crtime.png" style="width: 15px;position: relative;top: 0.2em;">
                  <span>登记时间：{{item.crtime | date}}</span>
                </p>
                <p style="display:inline-block;width:95%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                  <img src="../../assets/png/company/address.png" style="width: 12px;position: relative;top: 0.2em;">
                  &nbsp;地址信息：<span v-html="handleSearchText(item.address)"></span>
                </p>
                <p style="display:inline-block;width:95%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                  <img src="../../assets/png/company/chemical.png" style="width: 15px;position: relative;top: 0.2em;">
                  经营化学品：<span v-html="handleChemical(item.chemicals)"></span>
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="itemlist && isValidate">
      <div style="background-color: #F7F7F7;width: 100%;height: 1em"></div>
      <p style="text-align: center;margin: 1em 0 2em 0;color: #777777">更多下拉~~~</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import header from '../header/header.vue'
  import {Search,Toast,Indicator} from 'mint-ui'
  import provinceList from '../../../static/json/province.json'
  import cityList from '../../../static/json/city.json'
  import wx from 'weixin-js-sdk'
  import jsonp from 'jsonp'
  export default {
    data () {
      return {
      	province:'',
        city:'',
        product:'',
        type:'',
        itemlist:[],
        proList:[],   //产品列表
        page:0,
        rows:10,
        isValidate:false,
        noPremission:false,
        loading:false,
        total:0,
        search:'',
        getType:1,         // 0：模糊搜索  1：选项搜索
        provinceList:provinceList,
        cityList:[],
        selImg:require('../../assets/jpg/sel_bg.jpg'),
        downImg:require('../../assets/png/down.png'),
        height:(window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight) + 'px',
        isFirst:true          //第一次进入province时不getdata
      }
    },
    mounted: function () {
      this.getUserInfo()
    },
    methods: {
      getUserInfo:function () {
        let self = this
        var id = localStorage.getItem('id')
        var token = localStorage.getItem('token')
        if(id){
          axios.get(global.user + '/users/'+id,{
            params:{
              token:token
            }
          })
            .then(function (response) {
              if(response.data.err){
                self.noPremission = true
                return Toast({
                  message: '获取用户信息失败',
                  position: 'bottom',
                  duration: 1000
                });
              }
              let data = response.data || {}
              if(data.idcard){
                self.isValidate = true
                self.initConfig()
                self.getProduct()
              }else{
                self.noPremission = true
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        }else{
          self.login()
        }
      },
      initConfig:function () {
      	let self = this
        let url = location.href.split('#')[0]
        url = encodeURIComponent(url)      //不encode的话如果url带有&签名会有问题
//        alert(url)
        axios.get(global.wechat+'/api/jsconfig?url='+url,{})
          .then(function (res) {
            let data = res.data || {}
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: data.appId, // 必填，公众号的唯一标识
              timestamp: data.timestamp, // 必填，生成签名的时间戳
              nonceStr: data.nonceStr, // 必填，生成签名的随机串
              signature: data.signature,// 必填，签名
              jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表
            });
            wx.ready(function () {
              Indicator.open({
                text: '自动定位中...',
                spinnerType: 'fading-circle'
              });
              wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                  let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                  let longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
//                  let speed = res.speed; // 速度，以米/每秒计
//                  let accuracy = res.accuracy; // 位置精度
                  if(latitude && longitude){
                    self.setCityCode(latitude,longitude)
                  }
                }
              });
            })
            wx.error(function(res){
              // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
              this.loadMore()
              alert(res)
            });
          })
          .catch(function (error) {
            Indicator.close()
          })
      },
      setCityCode:function (latitude,longitude) {
        let self = this
        jsonp('http://api.map.baidu.com/geocoder/v2/?location='+latitude+','+longitude+'&output=json&pois=0&ak=C6MDDbngC73PDlo6ifrzISzG', null, (err, data) => {
          Indicator.close()
          if (err) {
            this.loadMore()
            console.error(err.message);
          } else {
            let result = data.result || {}
            let code = (result.addressComponent || {}).adcode || ''
            if(code && code.length > 3){
              let province = code.substr(0,2)
              let city = code.substr(2,2)
              self.province = province
              setTimeout(function () {
                self.city = city
              },300)
//              this.loadMore()
            }
          }
        })
      },
      getdata:function (type) {        //模糊搜索
        this.page = 0;
        this.total = 0;
        this.itemlist = []
        this.getType = type
        this.loadMore()
      },
      handleColor:function (type) {   //处理小标签字体颜色
         //生产、经营、储存、使用、运输、处置
        let color = ''
        switch (type)
        {
          case '生产':
          	color = '#F1924F'
            break
          case '经营':
            color = '#5474DB'
            break
          case '储存':
            color = '#20A85F'
            break
          case '使用':
            color = '#40A7D7'
            break
          case '运输':
            color = 'yellow'
            break
          case '处置':
            color = 'purple'
            break
          default:             //默认红色，出现红色则有问题
          	color = 'red'
        }
        return color
      },
      handleSearchText:function (val) {     //这里只处理企业名以及地址信息
        let data = val.split(this.search)
        let str = ''
      	if(this.search != '' && data.length > 1){        //有模糊搜索只按模糊搜索的找
          for(let i=0;i<data.length;i++){
            str += data[i]
            if(i != data.length-1) str += '<span style="color:red">'+ this.search +'</span>'
          }
          return str
        }
        return val
      },
      handleChemical:function (chemicals) {
        chemicals = chemicals || []
        let sign = this.product || this.search
        if(sign && chemicals.length && !this.getType){
          let reg = new RegExp(".*"+sign+'.*');

          let data = []
          chemicals.forEach(function (item) {           //这里主要是把包含关键字的化学药品放前面，用以标红
            if(reg.test(item)){
            	data.unshift(item)
//              console.log(data)
            }else{
            	data.push(item)
            }
          })
          let str = data.join('、')
          let strData = str.split(sign)
          let returnStr = ''
          if(strData.length > 1){
            for(let i=0;i<strData.length;i++){
              returnStr += strData[i]
              if(i != strData.length-1) returnStr += '<span style="color:red">'+ sign +'</span>'
            }
            return returnStr
          }
        }
        return chemicals.join('、')
      },
      getProduct:function () {    //获取产品字段
        let self = this
        axios.get(global.company+'/dict',{
          params:{
          	type:'化学品'
          }
        })
          .then(function (response) {
            let data = response.data || {}
            self.proList = data['化学品']
          })
          .catch(function (error) {
            console.log(error)
          })
      },
      loadMore:function (type) {   //下拉加载更多的方法
        if(this.page >= this.total && this.page !=0 ) return;
        Indicator.open();
        this.page++
        let self = this
        self.loading = true
        let token = localStorage.getItem('token')

        let data = {}
        if(this.getType){
          data.province = self.province
          data.city = self.city
          data.products = self.product
          data.types = self.type
        }else{
          data.search = self.search
        }
        data.token = token
        data.page = self.page
        data.rows = self.rows
        axios.get(global.company+'/infos',{
        	params:data
        })
          .then(function (response) {
            Indicator.close();
            let data = response.data || {}
            if(data.err) return;
//            data.rows = data.rows || []
            if(data.rows && data.rows.length > 0){
              data.rows.forEach(function (item) {
                self.itemlist.push(item)
              })
            }
            self.loading = false
            self.total = data.total
          })
          .catch(function (error) {
            self.loading = false
            Indicator.close();
            console.log(error)
          })
      },
      detail:function (id) {
        this.$router.push('/app/company/list/'+id)
      }
    },
    watch:{
    	province:function (val) {
        let data = []
        cityList.forEach(function (item) {
          if(item.precode == val) data.push(item)
        })
        this.cityList = data
        this.city = ""
        if(this.isFirst) {        //减少初次进入时请求次数, province不请求，city时请求
          this.isFirst = false
        	return;
        }
        this.getdata(1)
      },
      city:function () {
        this.getdata(1)
      },
      product:function () {
        this.getdata(1)
      },
      type:function () {
        this.getdata(1)
      }
    },
    filters:{
      date(time){
        let date   = new Date(time)//把定义的时间赋值进来进行下面的转换
        let year   = date.getFullYear();
        let month  = date.getMonth()+1;
        let day    = date.getDate();
        let hour   = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        return year+"-"+month+"-"+day
      }
    },
    components:{
      'i-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .productT {
    display:inline-block
    padding: 2px 5px 0px
    font-size:0.75em
    margin-right:0.6rem
    border-radius:0.2rem
    display: inline-block
    border:1px solid
  }
  .seldiv{
    float:left;
    width:25%;
    height:3rem;
  }
  .specrator{
    display: inline-block;
    width:1px;
    height:20%;
    background:#7B9FDF;
  }
  .select select{
    background: transparent;
    height:3rem
    font-size:14px !important
    outline:none;
    color:white;
    border:none;
    appearance:none;
    width:63% !important;
    margin-left:5%;
  }
  .select select option{
    background-color:white
    direction:ltr !important;
    color:black
  }
  .down{
    margin-left:8%;
    width:12%;
    height:15%
  }
</style>
