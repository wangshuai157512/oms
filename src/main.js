import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import directive from './directive'
import packages from './package'
import Tools  from './common/js/tools'
import mixin from './mixin'
// import base_url from './baseUrl.js'
import  * as echarts from 'echarts'





import request from './http'

Vue.config.productionTip = false
// Vue.prototype.$base_url = base_url
Vue.prototype.$axios = axios
Vue.prototype.$event = new Vue()
Vue.prototype.$api = request
Vue.prototype.$tools = Tools
Vue.prototype.$echarts = echarts

Vue.use(ElementUI)
Vue.use(directive)
Vue.use(packages)

Vue.mixin(mixin)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

