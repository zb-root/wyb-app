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

/* eslint-disable no-new */
new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')

