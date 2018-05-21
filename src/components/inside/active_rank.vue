<template>
  <div style="position:relative;width:100%;" v-bind:style="{height:height}" v-bind:class="{'mengban':!isInsider}">
    <i-header title="内部数据" leftNav="/app/insider/data"></i-header>
    <div style="position:absolute;top:30%;padding:0 1rem;width:100%;text-align: center;box-sizing: border-box;height:15rem;" v-if="!isInsider">
      <p style="line-height:2.5rem;height:2.5rem;background-color:#1A4B9C;color:white;font-size:1.1em;">温馨提示</p>
      <div style="background:white;padding-bottom: 2rem;">
        <img src="../../assets/inside/nopermission.png" style="width:1.5rem;margin-top:2rem;"/>
        <p style="line-height:2rem;height:2rem;color:#4275D1;margin-top:0.5rem;font-size:1.05em;font-weight: 600">该数据属于内部数据，您无查询权限</p>
      </div>
    </div>
    <div style="position:fixed;width:100%;z-index:99;top:3rem;background-color:white !important;">
      <div v-if="isInsider">
        <h3 style="text-align:center;padding:0.8rem;font-size:1.1em;height:1.2rem;line-height:1.4rem;background-color: #1A4B9C;color:white;">当月活跃企业数排名</h3>
        <!--<div style="height:1px;background-color:#ccc;"></div>-->
        <div style="font-size:.95em;box-sizing: border-box;padding:0.5rem 1rem;margin:0;text-align: center;background-color:#E8ECF5;height:3.5rem;vertical-align: middle;color:#1A4B9C">
          <p class="top" style="width:12%;vertical-align: middle;line-height: 2.5rem;font-weight:600;">排名</p>
          <p class="top" style="width:15%;vertical-align: middle;line-height: 2.5rem;font-weight:600;">年份</p>
          <p class="top" style="width:21%;vertical-align: middle;line-height: 2.5rem;font-weight:600;">省份</p>
          <span class="top" style="width:26%;line-height: 1.4rem;font-weight:600;">
            <p style="font-weight:600;">活跃企业数</p>
            <p style="font-size:0.95em;font-weight:600;">（当月）</p>
          </span>
          <span class="top" style="width:26%;line-height: 1.4rem;font-weight:600;">
            <p style="font-weight:600;">活跃企业数</p>
            <p style="font-size:0.95em;font-weight:600;">（上月）</p>
          </span>
        </div>
      </div>
    </div>

    <div style="width:100%;margin-top:7.5rem; padding-bottom:1rem"  v-if="isInsider">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <li v-for="(item,index) in itemlist"  style="display: block">
          <div style="font-size:0.95em;box-sizing: border-box;height:2.4rem;line-height:2.4rem;text-align: center;border-bottom: 1px solid #EEEEEE;margin:0 1rem;">
            <span class="top" style="width:12%">{{getIndex(index)}}</span>
            <span class="top" style="width:15%">{{item.year}}</span>
            <span class="top" style="width:21%">{{proText(item._id.province) || '无'}}</span>
            <span class="top" style="width:26%;position:relative;" v-bind:class="{'rise':item.curCount > item.preCount}">
              {{item.curCount}}
              <img v-if="item.curCount > item.preCount" src="../../assets/inside/rise.png" style="position: absolute; width: 0.65rem;height:1.6rem;top:0.4rem;right:1rem"/>
            </span>
            <span class="top" style="width:26%">{{item.preCount}}</span>
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
        provinceList:provinceList,
        isInsider:true,
        itemlist:[],
        page:1,
        rows:50,
        height:(window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight) + 'px'
      }
    },
    mounted: function () {
      this.loadMore()
    },
    methods: {
      proText:function (code) {
        let text = ''
        for(let i=0;i<provinceList.length;i++){
          if(provinceList[i].code == code+''){
            text = provinceList[i].name
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
            break
          }
        }
        return text
      },
      getIndex:function (index) {
        let rank = index+1
        for(let i=index;i>0;i++){
          if(this.itemlist[i-1].curCount == this.itemlist[index].curCount){
            rank = i+1
            break
          }
        }
        return rank
      },
      loadMore:function () {   //下拉加载更多的方法
        if(this.page >= this.total && this.page !=0 ) return;
        this.page++
        let self = this
        self.loading = true
        let token = localStorage.getItem('token')
        axios.get(global.company+'/activeRanking',{
          params:{
            page:this.page,
            rows:self.rows,
            token:token
          }
        })
          .then(function (response) {
            Indicator.close();
            let data = response.data || {}
            if(data.err) {
              self.isInsider = false
            	return Toast(data.msg)
            }
            console.log(data)
            data.rows.forEach(function (item,index) {
              self.itemlist.push(item)
            })
            self.loading = false
          })
          .catch(function (error) {
            self.loading = false
            console.log(error)
          })
      },
    },
    watch:{

    },
    components:{
      'i-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .top{
    display:inline-block
    box-sizing:border-box
    float:left
  }
  .rise{
    color:#02B235
  }
</style>
