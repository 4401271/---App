import Vue from 'vue'
import App from './App.vue'
import 'lib-flexible'  // 这个引入方式并没有添加相对绝对路径，但是却可以找到，寻找方式是先从配置中看是否有关于该文件的配置，如果没有那么就去node_modules中寻找，找到同名文件之后，就会去看其下面的package.json文件，看main指向的是哪个文件，就会从哪个文件找我们真正需要引入的文件
import router from './router'
import {Button} from 'mint-ui'
import Header from "@/components/Header/Header";
import Star from "@/components/Star/Star";
import CartControl from "@/components/CartControl/CartControl";
// 这种引入文件的方法可以将多个暴露放置在一个对象中，然后通过API.就可以访问各个暴露
import * as API from "./api"
import store from "@/vuex/store";
import './validate'
import './mock/mock-server'
import './fiters'

Vue.prototype.$API1 = API

Vue.component('Header', Header)
Vue.component('Star', Star)
Vue.component('CartControl', CartControl)
Vue.component('mt-button', Button)

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  router,  //所有组件都能看到$router和$route  <router-link>和<router-view>
  store
}).$mount('#app')