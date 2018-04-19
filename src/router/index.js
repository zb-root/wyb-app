import Vue from 'vue'
import Router from 'vue-router'
import app from '../components/app/app.vue'

import personal from '../components/personal/personal.vue'
import login from '../components/login/login.vue'
import register from '../components/register/register.vue'
import updatePhone from '../components/personal/update_phone.vue'
import newPhone from '../components/personal/newPhone.vue'

//企业搜索
import companylist from '../components/company/CompanyList.vue'
import companydetails from '../components/company/CompanyDetails.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/app/personal'
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: login
    // },
    // {
    //   path: '/register',
    //   name: 'register',
    //   component: register
    // },
    {
      path: '/app',
      component: app,
      children: [
        {
          path: '/',
          component: personal
        }, {
          path: 'personal',
          component: personal
        }
      ]
    },
    {
      path: '/app/login',
      name: 'login',
      component: login
    },
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
      path: '/app/company/list',
      name: 'companylist',
      component: companylist
    },
    {
      path: '/app/company/list/:id',
      name: 'companydetails',
      component: companydetails
    }
  ]
})
