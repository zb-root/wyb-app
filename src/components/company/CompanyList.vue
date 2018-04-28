<template>
  <div>
    <!--<i-header title="企业搜索"></i-header>-->
    <div style="position:fixed;width:100%;background-color:white !important;z-index:100;top:0rem;">
      <div style="position:relative;padding:1rem 1rem;background-color:#1A4B9C;">
        <div>
          <input type="text" v-model="search" style="box-sizing:border-box; width:100%;height:2.5rem;font-size:15px;padding:0 1rem;" placeholder="搜索企业信息"/>
          <span></span>
        </div>
        <div style="position:absolute;top:1.1rem;right:1.5rem;" @click="getdata">
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

    <div style="width:100%;margin-top:10.5rem;">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <li v-for="item in itemlist"  style="display: block" @click="detail(item._id)">
          <div>
            <div style="width:100%;height:0.8rem;background-color:#F7F7F7;"></div>
            <div style="min-height:10rem;padding:17px 13px 5px 13px;position:relative;">
              <!--<p style="font-size: 1.2em;color:#134498;width:80%;">-->
                <!--<span style="display:inline-block;width:0.2rem;height:1rem;background-color:#134498;"></span>&nbsp;-->
                <!--<span v-html="handleSearchText(item.name)"></span>-->
              <!--</p>-->

              <div style="font-size:16px;color:#134498;position:relative;box-sizing:border-box;">
                <!--<img src="../../assets/company/chemical.png" style="width:1rem;height:1rem;position:absolute;top:-0.1rem;left:0rem">-->
                <div style="display:inline-block;float:left;vertical-align:top;">
                  <span style="display:inline-block;width:0.2rem;height:1rem;background-color:#134498;"></span>
                </div>
                <div style="display:inline-block;float:left;width:75%;margin-left:1rem;">
                  <span v-html="handleSearchText(item.name)"></span>
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
              <div style="font-size:14px;margin-top:8px;color:#999;position:relative;padding-left:1.5rem;line-height: 1.7rem">
                <img src="../../assets/png/company/crtime.png" style="width:1rem;height:1rem;position:absolute;top:0.27rem;left:0rem">
                <span>登记时间：{{item.crtime | date}}</span>
              </div>
              <div style="font-size:14px;color:#999;position:relative;padding-left:1.5rem;line-height: 1.7rem;margin-top:0px">
                <img src="../../assets/png/company/address.png" style="width:0.9rem;height:1.05rem;position:absolute;top:0.25rem;left:0rem">
                <p style="display:inline-block;width:90%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">地址信息：
                  <span v-html="handleSearchText(item.address)"></span>
                </p>
              </div>
              <div style="font-size:14px;color:#999;position:relative;padding-left:1.5rem;line-height: 1.7rem;margin-top:-8px">
                <img src="../../assets/png/company/chemical.png" style="width:1rem;height:1.1rem;position:absolute;top:0.25rem;left:0rem">
                <p style="display:inline-block;width:90%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">经营化学品：<span v-html="handleChemical(item.chemicals)"></span></p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import header from '../header/header.vue'
  import {Search,Toast,Indicator} from 'mint-ui'
  import provinceList from '../../../static/json/province.json'
  import cityList from '../../../static/json/city.json'
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
        loading:false,
        total:0,
        search:'',
        provinceList:provinceList,
        cityList:[],
        selImg:require('../../assets/jpg/sel_bg.jpg'),
        downImg:require('../../assets/png/down.png')
      }
    },
    mounted: function () {
    	this.loadMore()
      this.getProduct()
    },
    methods: {
      getdata:function () {        //模糊搜索
        this.page = 0;
        this.total = 0;
        this.itemlist = []
        Indicator.open();
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
        if(this.product && chemicals.length){
          let reg = new RegExp(".*"+this.product+'.*');

          let data = []
          chemicals.forEach(function (item) {           //这里主要是把包含关键字的化学药品放前面，用以标红
            if(reg.test(item)){
//            	console.log(1,item)
            	data.unshift(item)
//              console.log(data)
            }else{
            	data.push(item)
            }
          })
          let str = data.join('、')
          let strData = str.split(this.product)
          let returnStr = ''
          if(strData.length > 1){
            for(let i=0;i<strData.length;i++){
              returnStr += strData[i]
              if(i != strData.length-1) returnStr += '<span style="color:red">'+ this.product +'</span>'
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
      loadMore:function () {   //下拉加载更多的方法
        if(this.page >= this.total && this.page !=0 ) return;
        this.page++
        let self = this
        self.loading = true
        axios.get(global.company+'/infos',{
        	params:{
        		page:self.page,
            rows:self.rows,
            search:self.search,
            products:self.product,
            types:self.type,
            province:self.province,
            city:self.city
          }
        })
          .then(function (response) {
            Indicator.close();
            let data = response.data || {}
            data.rows.forEach(function (item) {
              self.itemlist.push(item)
            })
            self.loading = false
            self.total = data.total
          })
          .catch(function (error) {
            self.loading = false
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
        this.getdata()
      },
      city:function () {
        this.getdata()
      },
      product:function () {
        this.getdata()
      },
      type:function () {
        this.getdata()
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
