import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
Vue.use(VueRouter)
//导入全局样式
import '../assets/css/global.css'

const routes = [
  { path: '/', redirect: '/Login' },
  { path: '/Login', component: Login },
  { path: '/Home', component: Home , redirect:'/Welcome' , children:[
    { path: '/Welcome', component: Welcome },
    { path: '/Users', component: Users }
  ]}
]
const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  //to 去哪 from 哪来 next()放行
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
