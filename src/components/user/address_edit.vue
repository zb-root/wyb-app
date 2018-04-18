<template>
  <div>
    <mt-header fixed>
      <router-link to="/app/user/userinfo/addresslist" slot="left">
        <mt-button icon="back">添加新地址</mt-button>
      </router-link>
      <mt-button slot="right" v-if="name" @click="deleteaddr">删除</mt-button>
    </mt-header>
    <div class="head"></div>

    <mt-field label="收货人" placeholder="请输入姓名" type="text" v-model="name"></mt-field>
    <!--<mt-field label="联系电话" placeholder="请输入手机号" type="tel" v-model="mobile"></mt-field>-->
    <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="mobile"></mt-field>
    <mt-field label="所在地区" readonly>
      <span @click="openPicker1" v-if="!addressProvince"> 省 市 区</span>
      <span @click="openPicker1" v-if="addressProvince">{{addressProvince}} {{addressCity}} {{addressXian}}</span>
    </mt-field>
    <mt-field label="街道" readonly><span @click="openPicker2">{{addressStreet || '街道'}}</span></mt-field>
    <mt-field label="详细地址" type="textarea" rows="3" v-model="detail"></mt-field>
    <div style="border-top: 1px solid #dddddd; width: 100%">
      <mt-popup v-model="popupVisible1" position="bottom" style="width: 100%">
        <mt-picker :slots="addressSlots"  class="picker" v-on:change="onAddressChange"></mt-picker >
      </mt-popup>

      <mt-popup v-model="popupVisible2" position="bottom" style="width: 100%" >
        <mt-picker :slots="streetSlots" class="picker" v-on:change="onStreetChange" :visible-item-count="5"></mt-picker >
      </mt-popup>
    </div>
    <div style="margin: 1rem">
      <mt-button type="primary" @click="save" size="large">保存</mt-button>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import s from '../../../static/json/address4.json'
  import { Toast, MessageBox, Popup, Picker } from 'mint-ui'
  export default {
    name: 'address',
    data () {
      return {
        name: '',
        mobile: '',
        detail: '',
        popupVisible1: false,
        popupVisible2: false,
        addressSlots: [
          {
            flex: 1,
            defaultIndex: 1,
            values: Object.keys(s),
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
          }, {
            divider: true,
            content: '-',
            className: 'slot4'
          }, {
            flex: 1,
            values: [],
            className: 'slot5',
            textAlign: 'center'
          }
        ],
        streetSlots: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        addressProvince: '',
        addressCity: '',
        addressXian: '',
        addressStreet: '',
        xianObj: ''
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        setTimeout(() => {    // 这个是一个初始化默认值的一个技巧
          this.addressSlots[0].defaultIndex = 0
        }, 100)
      })
      this.getinfo()
    },
    methods: {
      openPicker1: function () {
        if (this.popupVisible1 === true) {
          this.popupVisible1 = false
        } else {
          this.popupVisible1 = true
        }
      },
      openPicker2: function () {
        if (this.popupVisible2 === true) {
          this.popupVisible2 = false
        } else {
          this.popupVisible2 = true
        }
      },
      onAddressChange: function (picker, values) {
        if (s[values[0]]) {
          let shi = Object.keys(s[values[0]])
          picker.setSlotValues(1, shi)
          let index = shi.indexOf(values[1])
          let xian = s[values[0]][shi[index]]
          this.xianObj = xian
          this.addressProvince = values[0]
          this.addressCity = values[1]
          this.addressXian = values[2]
          if (xian) {
            picker.setSlotValues(2, Object.keys(xian))
          }
        }
      },
      onStreetChange: function (picker, values) {
        this.addressStreet = values[0]
      },
      getinfo: function () {
        let self = this
        let id = this.$route.params.id
        let token = localStorage.getItem('token')
        axios.get(global.shop + '/addresses/' + id, {
          params: {
            token: token
          }
        }).then(function (res) {
          self.name = res.data.name
          self.mobile = res.data.mobile
          self.addressProvince = res.data.province
          self.addressCity = res.data.city
          self.addressXian = res.data.area
          self.detail = res.data.address
        }).catch(function (err) {
          console.info(err)
        })
      },
      deleteaddr: function () {
        let self = this
        let id = this.$route.params.id
        let token = localStorage.getItem('token')
        MessageBox.confirm('确定删除此地址?').then(action => {
          axios.delete(global.shop + '/addresses/' + id, {
            params: {
              token: token
            }
          }).then(function (res) {
            if (res.data.ret === 1) {
              Toast({message: '删除成功', position: 'bottom', duration: 5000})
            } else {
              Toast({message: '删除失败', position: 'bottom', duration: 5000})
            }
            self.$router.push('/app/user/userinfo/addresslist')
            console.info(res.data)
          }).catch(function (err) {
            console.info(err)
          })
        }, cancel => {
          return
        })
      },
      save: function () {
        let self = this
        let id = this.$route.params.id
        let url = ''
        let token = localStorage.getItem('token')
        if (!self.name) {
          MessageBox('提示', '请输入用户姓名')
        } else if (!self.mobile) {
          MessageBox('提示', '请输入手机号')
        } else if (!self.detail) {
          MessageBox('提示', '请输入详细地址')
        } else {
          let reg = /^1[3|4|5|7|8][0-9]{9}$/
          if (reg.test(self.mobile)) {
            if (id) {
              url = global.shop + '/addresses/' + id
            } else {
              url = global.shop + '/addresses'
            }
            axios.post(url, {
              token: token,
              name: self.name,
              mobile: self.mobile,
              province: self.addressProvince,
              city: self.addressCity,
              area: self.addressXian + self.addressStreet,
              address: self.detail
            }).then(function (res) {
              Toast({message: '保存成功', position: 'bottom', duration: 5000})
              self.$router.back(-1)
            }).catch(function (error) {
              console.log(error)
            })
          } else {
            MessageBox('提示', '请输入有效手机号')
          }
        }
      }
    },
    watch: {
      'addressXian': {
        handler (val, oval) {
          if (this.addressXian) {
            let street = this.xianObj[this.addressXian]
            this.streetSlots[0].values = street
          }
        }
      }
    },
    components: {
      'mt-picker': Picker,
      'mt-popup': Popup
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .head
    height: 38px
</style>
