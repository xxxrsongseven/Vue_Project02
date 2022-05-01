<template>
  <el-container class="home-container">
    <!-- 头部 -->
  <el-header> <span>七影后台管理系统</span> <el-button @click="logout" type="info">退出</el-button></el-header>
  <!-- 页面主题 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse?'64px':'200px'">
      <div class="toggle-button" @click="toggleCollp">|||</div>
      <el-menu
      :default-active="activePath"
      router
      :collapse-transition="false"
      :collapse="isCollapse"
      unique-opened
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff">
      <!-- 一级菜单 -->
      <el-submenu v-for="item in meauList" :key="item.id" :index="String(item.id)">
        <!-- 一级菜单模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsListObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
      <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="'/'+subItem.path" @click="saveNavState('/'+subItem.path)">
         <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
      </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 右侧内容 -->
    <el-main>
      <!-- 路由占位符 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return {
      //左侧菜单
      meauList:[],
      iconsListObj:{
        '125':'el-icon-user-solid',
        '103':'el-icon-s-check',
        '101':'el-icon-s-shop',
        '102':'el-icon-s-order',
        '145':'el-icon-data-line',
      },
      isCollapse:false,
      //被激活的链接地址
      activePath:''
    }
  },
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    //保存链接的激活状态
    saveNavState(activePath){
      sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    },
    //点击按钮,侧边栏展开与折叠
    toggleCollp(){
      this.isCollapse=!this.isCollapse
    },
    //获取所有的菜单
    async getMenuList(){
    const {data:res} =  await  this.$http.get('menus')
    if (res.meta.status!==200) return this.$message.error(res.meta.msg)
    this.meauList = res.data
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  font-size: 30px;
  align-items: center;
  padding-left: 30px ;
  color: #fff;
}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #eaedf1;
}
.el-menu{
  border-right-width: 0px ;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>