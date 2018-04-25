<template>
  <div>
    <i-header title="企业详情" leftNav="/app/company/list"></i-header>
    <div style="border-top:1px solid #ccc;padding:27px 13px 13px 13px;position:relative">
      <p style="font-size: 1.2em;color:#134498">{{name}}</p>
      <div style="position:absolute;top:1.7rem;right:1rem;">
        <img style="width:3.5rem;height:1.2rem;" src="../../assets/png/renzhen.png" />
      </div>
      <ul style="margin-top:0.8rem">
        <li class="productT" v-for="productType in operationModes" style="display: inline-block;border:1px solid" v-bind:style="{'color':handleColor(productType),'border-color':handleColor(productType)}">{{productType}}</li>
      </ul>
      <div>
        <!--<div style="font-size:1em;margin-top:1rem;color:gray;position:relative;line-height: 1.7rem">-->
          <!--<p>登记时间：{{crtime | date}}</p>-->
          <!--<p>更新时间：{{crtime | date}}</p>-->
        <!--</div>-->
        <div style="font-size:1em;color:#aaa;position:relative;padding-left:1.5rem;margin-top:0.8rem;">
          <img src="../../assets/company/time.png" style="width:1rem;height:1rem;position:absolute;top:-0.05rem;left:0rem">
          <span>登记时间：{{crtime | date}}</span>
        </div>
        <div style="font-size:1em;color:#aaa;position:relative;padding-left:1.5rem;margin-top:0.7rem;">
          <img src="../../assets/company/time.png" style="width:1rem;height:1rem;position:absolute;top:-0.05rem;left:0rem">
          <span>更新时间：{{moditime | date}}</span>
        </div>
      </div>
      <div style="height:1px;background-color:#ddd;margin-top:0.6em"></div>
      <div style="margin-top:0.7rem">
        <!--<div style="font-size:1em;color:gray;position:relative;line-height: 1.5rem;">-->
          <!--<p style="display:inline-block;width:90%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">组织代码：{{coding}}</p>-->
        <!--</div>-->
        <div style="font-size:1em;color:#aaa;position:relative;padding-left:1.5rem;">
          <img src="../../assets/company/haomachi.png" style="width:1rem;height:1rem;position:absolute;top:-0.1rem;left:0rem">
          <p style="display:inline-block;width:90%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">组织代码：{{coding}}</p>
        </div>

        <!--<div style="font-size:1em;color:gray;position:relative;line-height: 1.5rem;">-->
          <!--<p style="display:inline-block;width:90%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">固定电话：{{telephone}}</p>-->
        <!--</div>-->

        <div style="font-size:1em;color:#aaa;position:relative;padding-left:1.5rem;margin-top:0.6rem;">
          <img src="../../assets/company/telephone.png" style="width:1rem;height:1rem;position:absolute;top:-0.1rem;left:0rem">
          <p style="display:inline-block;width:90%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">固定电话：{{telephone}}</p>
        </div>

        <div style="font-size:1em;color:#aaa;position:relative;padding-left:1.5rem;margin-top:0.6rem;">
          <img src="../../assets/company/cancel.png" style="width:1rem;height:1rem;position:absolute;top:-0.1rem;left:0rem">
          <p style="display:inline-block;width:90%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">是否注销：{{isCancel?'已注销':'否'}}</p>
        </div>
      </div>
      <div style="height:1px;background-color:#ddd;margin-top:0.6em"></div>

      <div style="font-size:1em;color:#aaa;position:relative;padding-left:1.5rem;margin-top:0.6rem;">
        <img src="../../assets/company/address.png" style="width:1rem;height:1rem;position:absolute;top:-0.1rem;left:0rem">
        <p>地址信息：{{address}}</p>
      </div>
      <div style="font-size:1em;color:#aaa;position:relative;padding-left:1.5rem;margin-top:0.8rem;box-sizing:border-box;">
        <img src="../../assets/company/chemical.png" style="width:1rem;height:1rem;position:absolute;top:-0.1rem;left:0rem">
        <div style="display:inline-block;float:left;vertical-align:top;">
          <p>经营化学品：</p>
        </div>
        <div style="display:inline-block;float:left;width:62%;">
          <p>{{handleChemical(chemicals)}}</p>
        </div>
      </div>
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
      },
      handleChemical:function (chemicals) {
      	chemicals = chemicals || []
      	return chemicals.join('、')
      },
      handleColor:function (type) {   //处理小标签字体颜色
//        console.log(type)  //生产、经营、储存、使用、运输、处置
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
    padding: 0.25rem 0.6rem 0.1rem
    font-size:0.95em
    margin-right:0.6rem
    border-radius:0.25rem
  }
</style>
