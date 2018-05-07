<template>
  <div>
    <i-header title="实名认证" leftNav="/app/login" ></i-header>
    <div style="margin-top:2.5rem;padding:0 1rem;">

      <div class="itemdiv">
        <img class="itemimg"  src="../../assets/register/name.png" style="position: absolute; top:0.9rem; left:0.8rem; width:1.15rem;" />
        <input class="iteminput" type="text" placeholder="姓名   (不可更改，必填)"  v-model="name" />
      </div>

      <div class="itemdiv">
        <img class="itemimg"  src="../../assets/register/idcard.png" style="position: absolute; top:0.9rem; left:0.8rem; width:1.3rem;" />
        <input class="iteminput" type="text" placeholder="身份证号   (不可更改，必填)"  v-model="idcard" />
      </div>

      <div class="itemdiv" sty="background-color:red;" @click="open">
        <img class="itemimg"  src="../../assets/register/city.png" style="position: absolute; top:0.9rem; left:0.8rem; width:1.3rem;" />
        <div style="padding-left:1rem;height:3.1rem;background-color:#EAEAEA;box-sizing:border-box;padding:1.15rem 0 1rem 2.5rem;border-radius:0.2rem;width:99%;"><span v-html="getCityText()"></span></div>
        <!--<input style="padding-left:1rem;height:3.1rem;box-sizing:border-box;padding:1.15rem 0 1rem 2.5rem;border-radius:0.2rem;width:99%;" placeholder="所在城市   (必填)" v-bind:value="getCityText()"/>-->
      </div>

      <div class="itemdiv">
        <img class="itemimg"  src="../../assets/personal/phone.png" style="position: absolute; top:0.9rem; left:0.8rem; width:1rem;" />
        <input class="iteminput" type="text" placeholder="手机号   (必填)"  v-model="phone" @click.stop/>
      </div>

      <div class="itemdiv">
        <img style="position: absolute;top:0.9rem;left:0.8rem;width:1rem;"  src="../../assets/personal/vericate_code.png" />
        <input type="text" placeholder="请输入验证码"  v-model="code" style="box-sizing:border-box;padding:1rem 0 1rem 2.5rem;height:3.1rem;background-color:#EAEAEA;border-radius:0.2rem;width:61%;"/>
        <mt-button style="width:35%;background-color:#1A4B9C;margin-left:2%;color:white;font-size:0.95em;height:3.1rem;border-radius:0.3rem;" size="normal"  @click="rgsms">{{smstext}}</mt-button>
      </div>

      <div style="text-align: center;margin-top:2.5rem">
        <mt-button style="background-color:#1A4B9C;color:white;width:100%;border-radius:0.3rem;height:3rem;" v-on:click="register">注册</mt-button>
      </div>
    </div>

    <div>
      <mt-popup
        v-model="popupVisible"
        position="bottom"
        style="width:100%;">
        <div>
          <div style="height:2.8rem;line-height: 2.8rem;padding:0 0.8rem;border-bottom:1px solid #EEEEEE">
            <a style="color:#4275D1;float:left;" @click="cancel">取消</a>
            <a style="color:#4275D1;float:right;" @click="selcity">确定</a>
          </div>
          <mt-picker :slots="slots" @change="onValuesChange" value-key="name"></mt-picker>
        </div>
      </mt-popup>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import header from '../header/header.vue'
  import { MessageBox, Indicator, Toast } from 'mint-ui'
  import provinceList from '../../../static/json/province.json'
  import cityList from '../../../static/json/city.json'
  import wx from 'weixin-js-sdk'
  import jsonp from 'jsonp'
  export default {
    data () {
      return {
        phone: '',
        code: '',
        name:'',
        idcard:'',
        province:'',
        city:'',
        smstext:'发送验证码',
        stateph:'success',
        count: 60,
        provinceList:provinceList,
        popupVisible:false,
        slots: [{
          flex: 1,
          values: provinceList,
          className: 'slot1',
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'center'
        }],
        nowSelPro:'11',
        nowSelCity:'01',
        defaultSelProIndex:0,
        defaultSelCityIndex:0
      }
    },
    mounted: function () {
      this.initConfig()
    },
    methods: {
      initConfig:function () {
        let self = this
        let url = location.href.split('#')[0]
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
              alert(res)
            });
          })
      },
      setCityCode:function (latitude,longitude) {
        let self = this
        jsonp('http://api.map.baidu.com/geocoder/v2/?location='+latitude+','+longitude+'&output=json&pois=0&ak=C6MDDbngC73PDlo6ifrzISzG', null, (err, data) => {
          if (err) {
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
              },100)

              for(let i=0;i<provinceList.length;i++){
              	if(provinceList[i].code == province){
              		self.defaultSelProIndex = i
                  break
                }
              }
              let cityList = self.getCityList(province)
              for(let i=0;i<cityList.length;i++){
                if(cityList[i].code == city){
                  self.defaultSelCityIndex = i
                  break
                }
              }
            }
          }
        })
      },
      open:function () {
//        找出defaultIndex的位置
        this.slots = [{
          flex: 1,
          values: provinceList,
          className: 'slot1',
          textAlign: 'center',
          value:this.defaultSelProIndex,
          defaultIndex:this.defaultSelProIndex
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: this.getCityList(this.nowSelPro),
          className: 'slot3',
          textAlign: 'center',
          value:this.defaultSelCityIndex,
          defaultIndex:this.defaultSelCityIndex
        }]
        this.popupVisible = true
      },
      cancel:function () {         //选择城市弹出框取消按钮
//        this.nowSelPro = this.province
//        this.nowSelCity = this.city
        this.popupVisible = false
      },
      selcity:function () {
      	this.province = this.nowSelPro
        this.city = this.nowSelCity
        this.popupVisible = false
      },
      getCityList:function (procode) {
        let data = []
        cityList.forEach(function (item) {
          if(item.precode == procode) data.push(item)
        })
        return data
      },
      getCityText:function () {
      	let str = ''
        for(let i=0;i<provinceList.length;i++){
        	if(this.province == provinceList[i].code){
        		str += provinceList[i].name
            break;
          }
        }

        for(let j=0;j<cityList.length;j++){
          if(this.city == cityList[j].code && cityList[j].precode == this.province){
          	str += '   '
            str += cityList[j].name
            break;
          }
        }
        if(str){
        	return '<span style="">'+ str +'</span>'
        }else{
        	console.log(123)
          return '<span style="color:#838383">所在城市   (必填)</span>'
        }
//        return str || '所在城市   (必填)';
      },
      onValuesChange(picker, values) {       //这里主要设定省变化后市的联动
//        console.log(111,values[0],values[1],this.getCityList(values[0].code))

        if(values[0]) this.nowSelPro = values[0].code
        if(values[1]) this.nowSelCity = values[1].code

        let cityList = this.getCityList(values[0].code)
        picker.setSlotValues(1,cityList)
//        picker.setSlotValue(2,cityList[0])
//        this.slots[2].values = cityList
//        picker.setSlotValue(0,values[0])
//        picker.setSlotValue(1,values[1])
      },
      register: function () {
    		if(!this.idcard || !this.name || !this.province || !this.city || !this.phone || !this.code) return Toast({message: '请完善注册信息',position: 'bottom',duration: 1500});
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(!reg.test(this.idcard)) return Toast({message: '身份证号不正确',position: 'middle',duration: 1500});


        let regph = /^1[3|4|5|7|8][0-9]{9}$/
        if(!regph.test(this.phone)) return Toast({message: '请输入正确的手机号码',position: 'middle',duration: 1500});

        let self = this
        Indicator.open()

        let obj = {}
        obj = {
          mobile: self.phone,
          name: self.name,
          province:self.province,
          city:self.city,
          idcard:self.idcard
        }

        axios.get(global.verifycode+'/'+this.phone+'/check',{
          params: {code:self.code,mobile:self.phone}
        })
          .then(function (response) {
            if (response.data && response.data.err) {
              Indicator.close()
              return Toast({message: response.data.msg,position: 'middle',duration: 1500});
            }
            axios.post(global.passport + '/register', obj)
              .then(function (response) {
              	console.log(response.data,22)
                Indicator.close()
                if (response.data.id) {
                  axios.post(global.passport + '/login/mobile', {
                    mobile: self.phone,
                    code: self.code
                  }).then(function (response) {
                  	console.log(response.data,88)
                    if (response.data.token) {
                      localStorage.setItem('token', response.data.token)
                      localStorage.setItem('id', response.data.id)
                      self.$router.push('/app/personal')
                    }
                  }).catch(function (error) {
                    console.log(error)
                  })
                }else{
                  Indicator.close()
                  Toast({
                    message: '注册失败',
                    position: 'middle'
                  });
                }
              }).catch(function (error) {
              Indicator.close()
              console.log(error)
            })
          })
          .catch(function (error) {
            console.log(error)
          })

      },
      rgsms: function () {
        if(this.count != 60) return;
        let self = this
        let reg = /^1[3|4|5|7|8][0-9]{9}$/
        if(!reg.test(this.phone)) return Toast({message: '请输入正确的手机号码',position: 'bottom',duration: 1500});
        if(this.stateph == 'error') return Toast({message: '该手机号码已注册',position: 'bottom',duration: 1500});
        let url = global.passport + '/sms/'
        axios.get(url + self.phone, {
          params: {}
        }).then(function (response) {
          if (response.data.Code === 'OK') {
            Toast('发送成功')
            self.settime()
          } else {
            Toast('发送失败')
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      settime: function () {
        let self = this
        if (self.count === 0) {
          self.smstext = '重新发送'
          self.count = 60
          return
        } else {
          self.smstext = '重发(' + self.count + ')'
          self.count--
        }
        setTimeout(function () {
          self.settime()
        }, 1000)
      }
    },
    watch: {
      phone (val, oldVal) {
        let self = this
        let reg = /^1[3|4|5|7|8][0-9]{9}$/
        if (reg.test(val)) {
          axios.get(global.user + '/users/' + val + '/exists')
          .then(function (response) {
            if (response.data.ret === 0) {
              self.stateph = 'success'
            } else {
              MessageBox('提示', '该手机号已被注册！')
              self.stateph = 'error'
            }
          }).catch(function (error) {
            console.log(error)
          })
        } else {
          self.stateph = 'error'
        }
        self.validate()
      },
      password (val, oldVal) {
        let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
        if (reg.test(val)) {
          this.statepwd = 'success'
        } else {
          this.statepwd = 'error'
        }
        this.validate()
      },
      nick (val, oldVal) {
        if (val.length) {
          this.statenick = 'success'
        } else {
          this.statenick = 'error'
        }
        this.validate()
      },
      captcha (val, oldVal) {
        let self = this
        if (val.length === 6) {
          axios.get(global.verifycode + '/' + self.phone + '/check?code=' + val)
            .then(function (response) {
              console.info(response.data)
              if (response.data.key) {
                self.statesms = 'success'
                self.validate()
              } else {
                self.statesms = 'error'
              }
            }).catch(function (error) {
              console.info(error)
            })
        } else {
          self.statesms = 'error'
        }
        self.validate()
      },
      protocal (val, oldVal) {
        if (val === true) {
          this.stateprotocol = true
        } else {
          this.stateprotocol = false
        }
        this.validate()
      }
    },
    components: {
      'i-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .smsbtn
    border-left: 1px solid #38C790
    padding-left: 6px
    color: #38C790
  .itemdiv{
    box-sizing:border-box;
    position: relative;
    margin-top:0.7rem;
  }
  .iteminput{
    box-sizing:border-box;
    padding:1rem 0 1rem 2.5rem;
    height:3.1rem;
    background-color:#EAEAEA;
    border-radius:0.2rem;
    width:99%;
  }
</style>
