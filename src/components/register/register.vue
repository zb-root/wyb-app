<template>
  <div>
    <i-header title="注册" leftNav="/app/login" rightNav="/" rightText="个人中心"></i-header>
    <div style="margin:1rem;">
      <mt-field label="身份证号" placeholder="填写真实身份证信息" type="text" v-model="idcard"></mt-field>
      <!--<mt-cell title="城市" >-->
        <div @click="tt">
          <mt-cell title="城市" is-link></mt-cell>
        </div>
      <!--</mt-cell>-->
      <mt-field label="姓名" placeholder="填写真实姓名" type="text" v-model="name"></mt-field>
      <mt-field label="手机号" placeholder="填写真实手机号" type="text" v-model="phone"></mt-field>
      <mt-field label="验证码" v-model="code">
        <a v-on:click="rgsms" class="smsbtn" disabled>{{smstext}}</a>
      </mt-field>
      <mt-field></mt-field>
      <!--<mt-button type="primary" size="normal" style="width:100%" v-on:click="register">注&nbsp;&nbsp;&nbsp;册</mt-button>-->
      <div style="text-align: center;margin-top:-35px">
        <mt-button size="small" type="primary" style="width:80%;" @click="register">注&nbsp;&nbsp;&nbsp;册</mt-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import header from '../header/header.vue'
  import { MessageBox, Indicator, Toast } from 'mint-ui'
  export default {
    data () {
      return {
        phone: '',
        code: '',
        name:'',
        idcard:'',
        phone:'',
        province:'',
        city:'',
        smstext:'发送验证码',
        stateph:'success',
        count: 60
      }
    },
    mounted: function () {
      this.stateprotocol = true
    },
    methods: {
    	tt:function () {
        console.log(456)
      },
      register: function () {
    		if(!this.idcard || !this.name || !this.phone || !this.code) return Toast({message: '请完善注册信息',position: 'bottom',duration: 1500});
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(!reg.test(this.idcard)) return Toast({message: '身份证号不正确',position: 'bottom',duration: 1500});


        let regph = /^1[3|4|5|7|8][0-9]{9}$/
        if(!regph.test(this.phone)) return Toast({message: '请输入正确的手机号码',position: 'bottom',duration: 1500});

        let self = this
        Indicator.open()

        let obj = {}
        obj = {
          mobile: self.phone,
          name: self.name,
          idcard:self.idcard
        }

        axios.get(global.verifycode+'/'+this.phone+'/check',{
          params: {code:self.code,mobile:self.phone}
        })
          .then(function (response) {
            if (response.data && response.data.err) {
              Indicator.close()
              return Toast({message: response.data.msg,position: 'bottom',duration: 1500});
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
                    position: 'bottom'
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
              MessageBox('提示', '账号已存在！')
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
</style>
