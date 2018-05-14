// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router/index'
import MintUI from 'mint-ui'
import '../static/css/style.css'
import './config'

Vue.use(MintUI)
Vue.prototype.axios = axios
Vue.config.productionTip = false
Vue.use(require('vue-moment'))

let getArgs = function () {
  var args = {} // 声明一个空对象
  var query = window.location.search.substring(1) // 取查询字符串，如从 http://www.snowpeak.org/testjs.htm?a1=v1&a2=&a3=v3#anchor 中截出 a1=v1&a2=&a3=v3。
  var pairs = query.split('&') // 以 & 符分开成数组
  for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=') // 查找 "name=value" 对
    if (pos === -1) continue // 若不成对，则跳出循环继续下一对
    var argname = pairs[i].substring(0, pos) // 取参数名
    var value = pairs[i].substring(pos + 1) // 取参数值
    value = decodeURIComponent(value) // 若需要，则解码
    args[argname] = value // 存成对象的一个属性
  }
  return args // 返回此对象
}

let login = function (path,next) {
  let code = getArgs()['code']
  let openid = localStorage.getItem('openid')
  let data = {}         //传递的参数
  if(openid){                //有openid先取openid
    data.openid = openid
  }
  if(code){                 //有code的话必定是重定向过来的，这时候优先code,
    data.code = code
  }
  let uri = global.redirect_uri + encodeURIComponent(global.staticHost+'/#'+path) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
  if(!data.openid && !data.code){                    //如果没有openid和code，则直接重新授权
    window.location.href = uri
  }else if(data.code || data.openid) {                //localStorage有openid的话直接登录，登录失败则重新授权，有code的话必定是重定向过来的直接登录
    axios.get(global.passport_wechat + '/login', {
      params: data
    })
      .then(function (res) {
        let result = res.data || {}
        if (result.err && result.err) {                //如果是登录失败，应该是openid失效，所以重新授权
          window.location.href = uri
        } else {           //登录成功保存id,token,openid等
          localStorage.setItem('id',result.userId)
          localStorage.setItem('token',result.token)
          localStorage.setItem('openid',result.openid)
          next()
        }
      })
  }
}

router.beforeEach((to,from,next)=>{
  if(to.meta.requireAuth){
    let token = localStorage.getItem('token')
    axios.get(global.sso + '/user?token=' + token)
      .then(function (res) {
        if (res.data.err && res.data.err == 1104) {      //1104是无效token
          localStorage.removeItem('id')
          localStorage.removeItem('token')
          login(to.path,next)
        } else {
          next()
        }
      })
      .catch(function (error) {
        // console.info(error)
        alert('网络错误')
      })
  }else{
    next()
  }
  // next()
})

/* eslint-disable no-new */
new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')

