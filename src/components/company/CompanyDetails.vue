<template>
  <div>
    <i-header title="企业详情" leftNav="/app/company/list"></i-header>
    <div style="border-top:1px solid #ccc;padding:22px 13px 13px 13px;position:relative">
      <p style="font-size: 15px;">{{name}}</p>
      <span style="position:absolute;top:17px;right:8px;font-size:10px;border-radius:5px;background-color:#F2F2F2;padding:5px 10px;">已认证</span>
      <ul style="margin-top:0.4em">
        <li class="productT" v-for="productType in operationModes" v-bind:style="{'backgroundColor':productType == '生产'?'#FFFFCC' :(productType == '经营'?'#CCFFCC':(productType == '储存'?'#FFE2FF':(productType == '经营'?'#FFFFCC':'#D5EAFF')))}">{{productType}}</li>
      </ul>
      <div>
        <p style="display:inline-block;font-size:13px;margin-top:0.9em;width:49%;">登记时间：{{crtime | date}}</p>
        <p style="display:inline-block;font-size:13px;margin-top:0.9em;width:49%;">更新时间：{{moditime | date}}</p>
      </div>
      <div style="height:1px;background-color:#ccc;margin-top:0.5em"></div>
      <p style="font-size:13px;margin-top:0.5em">组织代码：{{coding}}</p>
      <p style="font-size:13px;margin-top:0.5em">固定电话：{{telephone}}</p>
      <p style="font-size:13px;margin-top:0.5em">是否注销：{{isCancel?'已注销':'否'}}</p>
      <p style="font-size:13px;margin-top:0.5em;line-height: 20px;">地址信息：{{address}}</p>
      <div style="height:1px;background-color:#ccc;margin-top:0.5em"></div>
      <p style="font-size:13px;height:25px;margin:0.5em 0;line-height: 20px;">经营化学品：<span v-for="chemical in chemicals">{{chemical}}、</span></p>
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
      	id:this.$route.params.id,
        name:'',
        crtime:'',
        moditime:'',
        address:'',
        operationModes:[],  //企业类型
        coding:'',           //组织编码
        chemicals:[],         //经营化学品
        telephone:'',
        isCancel:false,       //是否注销
      }
    },
    mounted: function () {
    	this.getdata()
    },
    methods: {
      getdata:function () {        //模糊搜索
        let self = this
        axios.get(global.company+'/infos/'+self.id,{
          params:{

          }
        })
          .then(function (response) {
            let data = response.data || {}
            self.name = data.name
            self.crtime = data.crtime
            self.moditime = data.moditime
            self.address = data.address
            self.operationModes = data.operationModes || []
            self.coding = data._id
            self.chemicals = data.chemicals || []
            self.telephone = data.telephone
            self.isCancel = data.isCancel
          })
          .catch(function (error) {
            console.log(error)
          })
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
