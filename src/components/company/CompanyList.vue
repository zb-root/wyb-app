<template>
  <div>
    <i-header title="企业搜索"></i-header>
    <div style="position:fixed;width:100%;background-color:white !important;z-index:100">
      <div style="position:relative">
        <div style="width:100%;height:35px;">
          <input type="text" v-model="search" style="width:100%;height:35px;border:1px solid #ccc;padding:0 15px" placeholder="搜索"/>
        </div>
        <div style="position:absolute;top:1px;right:0px;">
          <mt-button style="width:35px;height:35px;padding:0;" v-on:click="getdata">
            <img src="../../assets/png/search.png" height="34" width="34" slot="icon">
          </mt-button>
        </div>
      </div>
      <div style="font-size:0">
        <div style="display: inline-block;width:18%;height:30px;">
          <select v-model="province" style="border: 1px solid #ccc;width:100%;height:30px;">
            <option selected value="">省</option>
            <option value="apple">苹果</option>
            <option value="banana">香蕉</option>
            <option value="watermelon">西瓜</option>
          </select>
        </div>
        <div style="display: inline-block;width:18%;height:30px;">
          <select v-model="city" style="border: 1px solid #ccc;width:100%;height:30px;border-left:none">
            <option selected value="">市</option>
            <option value="apple">苹果</option>
            <option value="banana">香蕉</option>
            <option value="watermelon">西瓜</option>
          </select>
        </div>
        <div style="display: inline-block;width:20%;height:30px;">
          <select v-model="product" style="border: 1px solid #ccc;width:100%;height:30px;border-left:none">
            <option selected value="">产品</option>
            <option v-for="item in proList" v-bind:value="item.code">{{item.name}}</option>
          </select>
        </div>
        <div style="display: inline-block;width:28%;height:30px;">
          <select v-model="type" style="border: 1px solid #ccc;width:100%;height:30px;border-left:none">
            <option selected value="">企业类型</option>
            <option value="生产">生产</option>
            <option value="经营">经营</option>
            <option value="储存">储存</option>
            <option value="使用">使用</option>
          </select>
        </div>
        <div style="display: inline-block;width:16%;height:30px;padding-top:2px;">
          <mt-button size="small" style="padding:0 10px;height:28px;width:100%;" @click="getdata">查询</mt-button>
        </div>
      </div>
      <p style="line-height: 33px;font-size:12px;padding-left:15px;margin-top:0px;">匹配到 <span style="color:red;">{{total}}</span> 家企业</p>
    </div>

    <div style="width:100%;margin-top:100px;">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <li v-for="item in itemlist"  style="display: block" @click="detail(item._id)">
          <div style="height:123px;border-top:1px solid #ccc;padding:17px 13px 13px 13px;position:relative">
            <p style="font-size: 15px;">{{item.name}}</p>
            <span style="position:absolute;top:12px;right:8px;font-size:10px;border-radius:5px;background-color:#F2F2F2;padding:5px 10px;">已认证</span>
            <ul style="margin-top:0.4em">
              <li class="productT" v-for="productType in item.operationModes" v-bind:style="{'backgroundColor':productType == '生产'?'#FFFFCC' :(productType == '经营'?'#CCFFCC':(productType == '储存'?'#FFE2FF':(productType == '经营'?'#FFFFCC':'#D5EAFF')))}">{{productType}}</li>
            </ul>
            <p style="font-size:13px;margin-top:0.9em">登记时间：{{item.crtime | date}}</p>
            <p style="font-size:13px;margin-top:0.5em">地址信息：{{item.address}}</p>
            <div style="height:1px;background-color:#ccc;margin-top:0.5em"></div>
            <p style="font-size:13px;width:80%;height:25px;margin:0.5em 0;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">经营化学品：<span v-for="chemical in item.chemicals">{{chemical}}、</span></p>
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
  import 'vue-router'
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
        search:''
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
        console.log(123)
        this.loadMore()
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
        console.log(this.page,this.total)
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
            types:self.type
          }
        })
          .then(function (response) {
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
    padding: 2px 8px
    font-size:12px
    margin-right:4px
  }
</style>
