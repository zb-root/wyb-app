import Vue from 'vue'
import Router from 'vue-router'
import app from '../components/app/app.vue'

import personal from '../components/personal/personal.vue'
import login from '../components/login/login.vue'
import register from '../components/register/register.vue'
import updatePhone from '../components/personal/update_phone.vue'
import newPhone from '../components/personal/newPhone.vue'
import avatar from '../components/personal/avatar_config.vue'

//企业搜索
import companylist from '../components/company/CompanyList.vue'
import companydetails from '../components/company/CompanyDetails.vue'

//内部数据
import insiderdata from '../components/inside/insider_data.vue'
import activerank from '../components/inside/active_rank.vue'

//标识校验
import idcheck from '../components/idcheck/idcheck_check.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/app/personal'
    },
    {
      path: '/app',
      component: app,
      children: [
        {
          path: '/',
          component: personal
        },
        {
          path: 'personal',
          component: personal
        },
        {
          path: 'personal/avatar',
          component: avatar
        }
      ]
    },
    // {
    //   path: '/app/login',
    //   name: 'login',
    //   component: login
    // },
    {
      path: '/app/register',
      name: 'register',
      component: register
    },
    {
      path: '/app/updatePhone/:mobile',
      name: 'updatePhone',
      component: updatePhone
    },
    {
      path: '/app/updatePhone/:mobile/update',
      name: 'newPhone',
      component: newPhone
    },
    {
      path: '/app/company/list',     //企业列表
      name: 'companylist',
      component: companylist
    },
    {
      path: '/app/company/list/:id',      //企业详情
      name: 'companydetails',
      component: companydetails
    },
    {
      path: '/app/insider/data',    //内部数据
      name: 'insiderdata',
      component: insiderdata
    },
    {
      path: '/app/active/rank',       //当月企业活跃度排行
      name: 'activerank',
      component: activerank
    },
    {
      path: '/app/idcheck/check',       //标识校验
      name: 'idcheck',
      component: idcheck
    }
  ]
})
