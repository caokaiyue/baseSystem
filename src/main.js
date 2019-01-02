// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
import 'es6-promise/auto'
import Vuex from 'vuex'
import App from './App'
import Axios from 'axios'
import qs from 'qs'
import router from './router'
// import ApiUrl from './api/api'
import './common.css'
import './assets/icon/iconfont.css'
import {
  Button, Menu, Form, FormItem, Input, Table, Row, Col, MenuItem, Submenu, MenuItemGroup, TableColumn,
  Switch, Select, Option, Radio, Container, Header, Aside, Main, Footer, Pagination, Card, DatePicker, Dialog,
  Message, Tag, TabPane, Tabs, Transfer, Alert, CheckboxGroup, Checkbox, Loading
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css'
// collapse 展开折叠
Vue.use(Vuex)
Vue.use(Loading.directive)
Vue.prototype.$http = Axios
// Vue.prototype.$api = ApiUrl
Vue.prototype.$qs = qs
Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$dateFormat = function (sTimeCount, eTimeCount) {
  let yyyy = new Date().getFullYear()
  let mm = new Date().getMonth()
  let dd = new Date().getDate()
  let sTime = new Date(yyyy, mm, dd - sTimeCount)
  let eTime = new Date(yyyy, mm, dd - eTimeCount)
  let obj = {
    startTime: '',
    endTime: ''
  }
  function getMonthFormat (month) {
    let formatMonth = ''
    let realMonth = Number(month) + 1
    if (realMonth === 12) {
      formatMonth = '12'
    } else {
      console.log(realMonth.toString().length)
      formatMonth = realMonth.toString().length > 1 ? realMonth.toString() : '0' + realMonth
    }
    return formatMonth
  }
  obj.startTime = [
    sTime.getFullYear(),
    getMonthFormat(sTime.getMonth().toString()),
    // sTime.getMonth().toString().length > 1 ? sTime.getMonth() : '0' + sTime.getMonth().toString(),
    sTime.getDate().toString().length > 1 ? sTime.getDate() : '0' + sTime.getDate().toString()].join('-')
  obj.endTime = [
    eTime.getFullYear(),
    getMonthFormat(eTime.getMonth().toString()),
    // eTime.getMonth().toString().length > 1 ? eTime.getMonth() : '0' + eTime.getMonth().toString(),
    eTime.getDate().toString().length > 1 ? eTime.getDate() : '0' + eTime.getDate().toString()].join('-')
  return obj
}
const elComponents = [
  Row, Col, Menu, MenuItem, Submenu, MenuItemGroup, Table, TableColumn,
  FormItem, Switch, Select, Option, Radio, Button, Form, Input, Header,
  Aside, Main, Footer, Container, Pagination, Card, DatePicker, Dialog,
  Message, Tag, TabPane, Tabs, Transfer, Alert, CheckboxGroup, Checkbox]
const store = new Vuex.Store({
  state: {
    LoadingConfig: false
  },
  mutations: {
    loading (state) {
      state.LoadingConfig = true
      // console.log('loading状态改变为:' + state.LoadingConfig)
    },
    noLoading (state) {
      // setTimeout(function () {
      state.LoadingConfig = false
      // console.log('loading状态改变为:' + state.LoadingConfig)
      // }, 1000)
    }
  },
  actions: {
    loading: ({commit}) => {
      commit('loading')
    },
    noLoading: ({commit}) => {
      commit('noLoading')
    }
  }
})
elComponents.forEach(item => {
  Vue.component(item.name, item)
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    next()
  } else {
    next()
  }
})

function isNull (obj) {
  for (let key in obj) {
    if (obj[key] === '' || obj[key] === null) {
      obj[key] = '暂无'
    }
    if (obj[key].constructor === Array || obj[key].constructor === Object) {
      isNull(obj[key])
    }
  }
}

Axios.interceptors.request.use(
  config => {
    store.dispatch('loading')
    return config
  },
  err => {
    store.dispatch('noLoading')
    return Promise.reject(err)
  })

Axios.interceptors.response.use(
  data => {
    if (data.data.code === 4) {
      data.data.msg = '长时间未操作，请重新登录'
      router.push('/login')
    } else {
      isNull(data.data.data)
    }
    store.dispatch('noLoading')
    return data
  },
  err => {
    store.dispatch('loading')
    // 这里是返回状态码不为200时候的错误处理
    // if (!err.response) {
    //   err.message = '网络不通'
    //   return
    // }
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误'
          break
        case 401:
          err.message = '未授权，请登录'
          break
        case 403:
          err.message = '拒绝访问'
          break
        case 404:
          err.message = '请求地址出错'
          break
        case 408:
          err.message = '请求超时'
          break
        case 500:
          err.message = '服务器开小差了'
          break
        case 501:
          err.message = '服务未实现'
          break
        case 502:
          err.message = '网关错误'
          break
        case 503:
          err.message = '服务不可用'
          break
        case 504:
          err.message = '网关超时'
          break
        case 505:
          err.message = 'HTTP版本不受支持'
          break
      }
    } else {
      err.message = '网络错误'
    }
    Message({
      message: err.message,
      type: 'error',
      duration: 2000
    })
    return Promise.reject(err)
  })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
