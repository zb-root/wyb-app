<template>
  <div>
    <i-header title="内部数据"></i-header>
    <div style="position:fixed;width:100%;z-index:99;top:3rem;background-color:white !important;">
      <p style="line-height: 2.5rem" v-if="!isInsider">该数据属于内部数据，您无查阅权限。</p>
      <p style="line-height: 2.5rem;text-align: right;font-size:0.9em;padding-right:1rem;" v-if="isInsider"><a @click="toActiveRank" style="text-decoration: underline;font-color:red;">当月活跃企业数排名</a></p>
      <div style="font-size:0;" v-if="isInsider">
        <div style="display: inline-block;width:33%;height:28px;">
          <select v-model="year" style="">
            <option v-for="year in yearList" v-bind:value="year">{{year}}年</option>
          </select>
        </div>
        <div style="display: inline-block;width:33%;height:30px;">
          <select v-model="province" style="">
            <option v-for="province in provinceList" v-bind:value="province.code">{{province.name}}</option>
          </select>
        </div>
        <div style="display: inline-block;width:34%;height:30px;">
          <select v-model="type" style="border-left:none">
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
        </div>
      </div>
      <div v-if="isInsider">
        <p style="line-height:1.2rem;color:#aaa;font-size:0.9em;padding:0.5rem;margin-top:1rem;">{{proText()}}{{typeText()}} <span style="color:red;">{{selNum}}</span> {{selName}}，在全国排名第 <span style="color:red;">{{selRank}}</span> 名</p>
        <div style="height:1px;background-color:#ccc;"></div>
        <div style="box-sizing: border-box;padding:0.5rem;margin:0;text-align: center">
          <span class="top" style="width:15%">排名</span>
          <span class="top" style="width:18%">年份</span>
          <span class="top" style="width:41%">省份</span>
          <span class="top" style="width:26%">{{typeText()}}</span>
        </div>
      </div>
    </div>

    <div style="width:100%;margin-top:11rem;"  v-if="isInsider">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <li v-for="(item,index) in itemlist"  style="display: block">
          <div style="box-sizing: border-box;padding:1rem 0;margin:0;text-align: center;" v-bind:class="{'signClass':index == selRank-1}">
            <span class="top" style="width:15%">{{index+1}}</span>
            <span class="top" style="width:18%">{{item._id.date}}</span>
            <span class="top" style="width:41%">{{proText(item._id.province) || '无'}}</span>
            <span class="top" style="width:26%">{{item.count}}</span>
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
        page:0,
        rows:20,
        total:0
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
      proText:function (code) {
        let text = ''
        code = code || this.province
        for(let i=0;i<provinceList.length;i++){
        	if(provinceList[i].code == code+''){
        		text = provinceList[i].name
            break
          }
        }
        return text
      },
      getdata:function () {        //模糊搜索
        this.page = 0
        this.total = 0
        this.selNum = 0
        this.selRank = 0
        this.itemlist = []
        Indicator.open();
        this.loadMore()
      },
      loadMore:function () {   //下拉加载更多的方法
        if(this.page >= this.total && this.page !=0 ) return;
        this.page++
        let self = this
        self.loading = true
        axios.get(global.company+'/ranking',{
          params:{
            page:this.page,
            rows:self.rows,
            year:self.year,
//            province:self.province,
            type:self.type,
          }
        })
          .then(function (response) {
            Indicator.close();
            console.log(response)
            let data = response.data || {}
            data.rows.forEach(function (item,index) {
              self.itemlist.push(item)
              if(item._id.date == self.year && item._id.province == self.province){
              	self.selNum = item.count
                self.selRank = index + 1
              }
            })
            self.loading = false
            self.total = data.total
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
          })
      },
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
  .productT {
    display:inline-block
    padding: 0.25rem 0.6rem 0.1rem
    font-size:0.95em
    margin-right:0.6rem
    border-radius:0.25rem
  }
  select{
    text-align :center
    background-color:#4275D1
    border: 1px solid #4275D1
    width:100%
    height:2.8rem
    font-size:15px
    outline:none;
  }
  select option{
    background-color:white
    direction:rtl;
  }
  .top{
    display:inline-block
    box-sizing:border-box
    float:left
  }
  .signClass{
    color:red
  }
</style>
