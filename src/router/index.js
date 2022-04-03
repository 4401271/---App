/*
* 向外暴露路由器对象模块
* */
import Vue from 'vue'
import VueRouter from "vue-router";

import routes from "@/router/routes";
import store from "@/vuex/store";

// 声明使用vue插件
Vue.use(VueRouter)


const router = new VueRouter({
  // 配置：路由路径没有#
  // 注意！！！！   这个history是个字符串
  mode: 'history',
  // 配置项目中所有路由
  routes

})

// 定义一个全局守卫（如果是路径 /a /b的话则需要验证登录，只有登录才可以访问这两个网页）
const paths = ['/a', '/b'];
router.beforeEach((to, from, next)=>{

  const path = to.path;
  if(paths.indexOf(path) !== -1){
    if(!store.state.user.token){
      return next('/login')
    }
  }
  next();
})

export default router