import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
import Goods from '../components/goods/Goods.vue'
import Add from '../components/goods/Add.vue'
import Orders from '../components/order/Orders.vue'
import Reports from '../components/report/Reports.vue'
Vue.use(VueRouter)
//导入全局样式
import '../assets/css/global.css'

const routes = [
  { path: '/', redirect: '/Login' },
  { path: '/Login', component: Login },
  { path: '/Home', component: Home , redirect:'/Welcome' , children:[
    { path: '/Welcome', component: Welcome },
    { path: '/Users', component: Users },
    { path: '/Rights', component: Rights },
    { path: '/Roles', component: Roles },
    { path: '/Categories', component: Categories },
    { path: '/Params', component: Params },
    { path: '/Goods', component: Goods },
    { path: '/Goods/Add', component: Add },
    { path: '/Orders', component: Orders },
    { path: '/Reports', component: Reports },
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
