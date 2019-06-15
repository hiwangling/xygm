import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons'
import './permission'
import './utils/error-log'

import * as filters from './filters'
import permission from '@/directive/permission/index.js'
import Print from '@/utils/print.js'

Vue.use(Print)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium'
})
Vue.directive('permission', permission)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
