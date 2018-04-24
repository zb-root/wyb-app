<template>
  <div>
    <i-header title="内部数据" leftNav="/app/insider/data"></i-header>
    <div style="position:fixed;width:100%;z-index:99;top:3rem;background-color:white !important;">
      <p style="line-height: 2.5rem" v-if="!isInsider">该数据属于内部数据，您无查阅权限。</p>

      <div v-if="isInsider">
        <h3 style="text-align:center;padding:0.8rem;font-size:1.1em;">当月活跃企业数排名</h3>
        <div style="height:1px;background-color:#ccc;"></div>
        <div style="box-sizing: border-box;padding:0.5rem;margin:0;text-align: center">
          <span class="top" style="width:12%">排名</span>
          <span class="top" style="width:15%">年份</span>
          <span class="top" style="width:21%">省份</span>
          <span class="top" style="width:26%">
            <p>活跃企业数</p>
            <p>（当月）</p>
          </span>
          <span class="top" style="width:26%">
            <p>活跃企业数</p>
            <p>（上月）</p>
          </span>
        </div>
      </div>
    </div>

    <div style="width:100%;margin-top:6rem; padding-bottom:1rem"  v-if="isInsider">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10">
        <li v-for="(item,index) in itemlist"  style="display: block">
          <div style="box-sizing: border-box;padding:1rem 0;margin:0;text-align: center;" v-bind:class="{'signClass':item.curCount > item.preCount}">
            <span class="top" style="width:12%">{{index+1}}</span>
            <span class="top" style="width:15%">{{item.year}}</span>
            <span class="top" style="width:21%">{{proText(item._id.province) || '无'}}</span>
            <span class="top" style="width:26%">{{item.curCount}}</span>
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
        rows:50
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
      loadMore:function () {   //下拉加载更多的方法
        if(this.page >= this.total && this.page !=0 ) return;
        this.page++
        let self = this
        self.loading = true
        let token = localStorage.getItem('token')
        console.log(token,33)
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
            if(data.err) return Toast(data.msg)
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
  .signClass{
    color:red
  }
</style>
