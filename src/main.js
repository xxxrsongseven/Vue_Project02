import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
//配置请求根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.prototype.$message = Message
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
