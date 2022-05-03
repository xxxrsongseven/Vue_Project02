import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' 
//导入富文本编辑器对应样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css' 
import 'quill/dist/quill.bubble.css' 
//配置请求根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
// axios请求拦截器
axios.interceptors.request.use((config) => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //必须return config
  return config
})
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.prototype.$message = Message
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
//将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor)
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')
  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
