<template>
  <div style="position:relative;width:100%;" v-bind:style="{height:height}" v-bind:class="{'mengban':!isInsider}">
    <i-header title="内部数据"></i-header>
    <div style="position:absolute;top:30%;padding:0 1rem;width:100%;text-align: center;box-sizing: border-box;height:15rem;" v-if="!isInsider">
      <p style="line-height:2.5rem;height:2.5rem;background-color:#1A4B9C;color:white;font-size:1.1em;">温馨提示</p>
      <div style="background:white;padding-bottom: 2rem;">
        <img src="../../assets/inside/nopermission.png" style="width:1.5rem;margin-top:2rem;"/>
        <p style="line-height:2rem;height:2rem;color:#4275D1;margin-top:0.5rem;font-size:1.05em;font-weight: 600">该数据属于内部数据，您无查询权限</p>
      </div>
    </div>

    <div style="position:fixed;width:100%;z-index:99;top:3rem;background-color:white !important;" v-if="isInsider">
      <div class="insiderselect"  style="font-size:0;box-sizing: border-box;">
        <div class="seldiv" v-bind:style="{'background':'url('+selImg+') repeat'}">
          <select v-model="year">
            <option v-for="year in yearList" v-bind:value="year">{{year}}年</option>
          </select>
          <img class="down" src="../../assets/png/down.png"/>
        </div>

        <div class="seldiv" v-bind:style="{'background':'url('+selImg+') repeat'}">
          <div class="specrator"></div>
          <select v-model="province">
            <option v-for="province in provinceList" v-bind:value="province.code">{{province.name}}</option>
          </select>
          <img class="down" src="../../assets/png/down.png"/>
        </div>

        <div class="seldiv" v-bind:style="{'background':'url('+selImg+') repeat'}">
          <div class="specrator"></div>
          <select v-model="type">
            <option value="1">企业数量</option>
            <option value="2">人员数量</option>
            <option value="3">库房数量</option>
            <option value="4">库存数量</option>
            <option value="5">车辆数量</option>
            <option value="6">标识数量</option>
            <option value="7">生产数量</option>
            <option value="8">销售数量</option>
            <option value="9">购买数量</option>
            <option value="10">使用数量</option>
          </select>
          <img class="down" src="../../assets/png/down.png"/>
        </div>
      </div>
      <div style="clear:both;"></div>
      <div class="head" v-if="isInsider" style="padding:0 0.9rem;">
        <p style="line-height:1.2rem;color:#aaa;font-size:0.9em;height:2.4rem;padding-top:0.5rem;">{{proText()}}{{typeText()}} <span style="color:red;">{{selNum}}</span> {{selName}}，在全国排名第 <span style="color:red;">{{selRank}}</span> 名</p>
        <p style="text-align: right;font-size:0.9em;"><a @click="toActiveRank" style="text-decoration: underline;color:#4275D1;">当月活跃企业数排名</a></p>
        <div style="box-sizing: border-box;padding:0.8rem 0.5rem;text-align: center;background-color:#F7F7F7;height: 2.5rem;margin:0;margin-top:0.5rem;">
          <span class="top" style="width:15%">排名</span>
          <span class="top" style="width:25%">年份</span>
          <span class="top" style="width:25%">省份</span>
          <span class="top" style="width:30%">
            {{typeText()}}
            <img @click="getdata(1)" src="../../assets/inside/order.png" style="width: 6%;position: absolute;right: 1.5em;margin-top: -0.3em">
          </span>
        </div>
      </div>
    </div>

    <div style="width:100%;margin-top:10.8rem;"  v-if="isInsider">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <li v-for="(item,index) in itemlist"  style="display: block">
          <div class="body" style="box-sizing: border-box;height:2.4rem;line-height:2.4rem;text-align: center;border-bottom: 1px solid #EEEEEE;margin:0 1rem;" v-bind:class="{'signClass':index == selRank-1}">
            <span class="top" style="width:18%">{{index+1}}</span>
            <span class="top" style="width:26%">{{item._id.date}}</span>
            <span class="top" style="width:26%">{{proText(item._id.province) || '无'}}</span>
            <span class="top" style="width:30%">{{item.count}}</span>
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
  export default {
    data () {
      return {
      	year:new Date().getFullYear(),
        province:'44',
        type:'1',
        yearList:this.getYearList(),
        provinceList:provinceList,
        isInsider:true,
        provinceText:'',
        selNum:0,
        selRank:0,
        selName:'家',
        itemlist:[],
        alldata: [],
        page:0,
        rows:20,
        total:0,
        selImg:require('../../assets/jpg/sel_bg.jpg'),
        downImg:require('../../assets/png/down.png'),
        height:(window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight) + 'px'
      }
    },
    mounted: function () {
      this.loadMore()
    },
    methods: {
    	toActiveRank:function () {
        this.$router.push('/app/active/rank')
      },
      signClass:function (item) {
        if(item._id.date = this.year && item._id.province == this.province) return true
        return false
      },
      getDateText:function (item) {
        return item._id.date
      },
    	getYearList:function () {
      	let nowYear = new Date().getFullYear()
        let yearList = []
      	for(let i=0;i<10;i++){
          yearList.push(nowYear--)
        }
        return yearList
      },
      typeText:function () {
    		let text = ''
        switch (this.type)
        {
          case "1":
          	text = '企业数量'
            break
          case "2":
            text = '人员数量'
            break
          case "3":
            text = '库房数量'
            break
          case "4":
            text = '库存数量'
            break
          case "5":
            text = '车辆数量'
            break
          case "6":
            text = '标识数量'
            break
          case "7":
            text = '生产数量'
            break
          case "8":
            text = '销售数量'
            break
          case "9":
            text = '购买数量'
            break
          case "10":
            text = '使用数量'
            break
        }
        return text
      },
//      proText:function (code) {
//        let text = ''
//        code = code || this.province
//        for(let i=0;i<provinceList.length;i++){
//        	if(provinceList[i].code == code+''){
//        		text = provinceList[i].name
//            break
//          }
//        }
//        return text
//      },
      proText:function (code) {
        let text = ''
        let isProvince = code ? false : true
        code = code || this.province
        for(let i=0;i<provinceList.length;i++){
          if(provinceList[i].code == code+''){
            text = provinceList[i].name
            if(!isProvince){
              switch (provinceList[i].code)
              {
                case "15":
                  text = '内蒙古'
                  break
                case "45":
                  text = '广西'
                  break
                case "54":
                  text = '西藏'
                  break
                case "64":
                  text = '宁夏'
                  break
                case "65":
                  text = '新疆'
                  break
                default:
                  text = text.substr(0,text.length-1)
              }
            }
            break
          }
        }
        return text
      },
      getdata:function (param) {        //模糊搜索
        this.page = 0
        this.total = 0
        this.selNum = 0
        this.selRank = 0
        this.itemlist = []
        Indicator.open();
        this.loadMore(param)
      },
      compare1: function(property){
        return function(a,b){
          var value1 = a[property];
          var value2 = b[property];
          return value1 - value2;
        }
      },
      compare2: function(property){
        return function(a,b){
          var value1 = a[property];
          var value2 = b[property];
          return value2 - value1;
        }
      },
      loadMore:function (param) {   //下拉加载更多的方法
        if(this.page >= this.total && this.page !=0 ) return;
        this.page++
        let self = this
        self.loading = true
        let token = localStorage.getItem('token')
        axios.get(global.company+'/ranking',{
          params:{
            page:this.page,
            rows:self.rows,
            year:self.year,
//            province:self.province,
            type:self.type,
            token:token
          }
        })
          .then(function (response) {
            Indicator.close();
            let data = response.data || {}
            console.info(self.alldata)
            if(param){
              console.info("a")
              if(self.alldata[self.alldata.length-1].count > self.alldata[0].count){
                data.rows=self.alldata.sort(self.compare2('count'))
              }else{
                data.rows=self.alldata.sort(self.compare1('count'))
              }
            }else{
              data.rows = response.data.rows
            }
            if(data.err) {
              self.isInsider = false
            	return Toast(data.msg)
            }
            data.rows.forEach(function (item,index) {
              self.itemlist.push(item)
              if(item._id.date == self.year && item._id.province == self.province){
              	self.selNum = item.count
                self.selRank = index + 1
              }
            })
            self.alldata = self.itemlist
            self.loading = false
            self.total = data.total
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
          })
      }
    },
    watch:{
    	year:function () {
    		this.getdata()
      },
      province:function () {
        this.getdata()
      },
      type:function () {
        switch (this.type)
        {
          case "1":
            this.selName = '家'
            break
          case "2":
            this.selName = '人'
            break
          case "3":
            this.selName = '个'
            break
          case "4":
            this.selName = '吨'
            break
          case "5":
            this.selName = '辆'
            break
          case "6":
            this.selName = '个'
            break
          case "7":
            this.selName = '吨'
            break
          case "8":
            this.selName = '吨'
            break
          case "9":
            this.selName = '吨'
            break
          case "10":
            this.selName = '吨'
            break
        }
        this.getdata()
      }
    },
    components:{
      'i-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .head .top{
    display:inline-block
    box-sizing:border-box
    float:left
    color:#4275D1
  }
  .body .top{
    display:inline-block
    box-sizing:border-box
    float:left
  }
  .signClass{
    color:red
  }

  .insiderselect .seldiv{
    float:left;
    width:33.3%;
    height:3rem;
  }
  .insiderselect .specrator{
    display: inline-block;
    width:1px;
    height:20%;
    background:#7B9FDF;
  }
  .insiderselect select{
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
  .insiderselect select option{
    background-color:white
    direction:ltr !important;
    color:black
  }
  .down{
    margin-left:8%;
    width:12%;
    height:15%
  }
  .mengban{
    background-color:#7F7F7F
  }
</style>
