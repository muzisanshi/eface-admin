// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { VueAxios } from './utils/request'
// mock
import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission'
import hasPermission from '@/utils/hasPermission'
import './utils/filter'
import Api from './api/index'

Vue.config.productionTip = false
Vue.prototype.$api = Api
Vue.prototype.$store = store

Vue.use(VueAxios)
Vue.use(hasPermission)
new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
