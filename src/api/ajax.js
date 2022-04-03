/*
对axios进行二次封装，用来发送ajax请求

一个能发送ajax请求的函数
1. 统一处理请求异常
2. 异步请求成功的数据不是response, 而是response.data
3. 对post请求参数进行urlencoded处理, 而不使用默认的json方式(后台接口不支持)
  json是个对象，其内部保存的是键值对，{key: value}
  如果不支持json格式，就需要将其格式转换为urlencoded，格式：q=s&w=p
  判断是否为json的方式就是判断这个数据是否为对象

4. 配置请求超时的时间
5. 通过请求头携带token数据
*/

import axios from 'axios'
// query-string可以用来将Object格式的字符串转换为urlencoded的字符串
import qs from 'qs'
import { Toast, MessageBox } from 'mint-ui';  // Indicator
import store from "@/vuex/store";
import router from "@/router";

// 创建一个实例
const instance = axios.create({
  // 跨域请求问题 添加这个配置可以让浏览器在请求的最前面添加api
  baseURL: '/api',
  // 4. 配置请求超时的时间
  timeout: 20000
})

// 添加请求拦截器
instance.interceptors.request.use((config)=>{
  // 显示请求loading，在请求拦截器中进行控制显示，在响应拦截器中进行控制隐藏
  // Indicator.open();

  // 3. 对post请求参数进行urlencoded处理, 而不使用默认的json方式(后台接口不支持)
  const data = config.data
  if (data instanceof Object){
    config.data = qs.stringify(data)
  }

  const token = store.state.user.token
  if (token){
    config.headers['Authorization'] = token
  }else{
    // 此时表示状态中没有token，没有token可能也会有多个分支，分为接口需要token，和不需要token，
    //    需要token而我们此时又没有，可能是由于登录失效导致的，此时就需要抛出异常，然后不再发送请求，在响应中处理这个错误，即直接跳转到登录页面
    //    不需要token也就表示可以直接显示页面，这种情况不在这个else中，会直接向下执行，然后将config返回
    const needCheck = config.headers.needCheck
    if (needCheck){
      throw new Error('尚未登录，请先登录！')
    }
  }

  return config
})

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    // 隐藏请求loading
    // Indicator.close();
    // 2. 异步请求成功的数据不是response, 而是response.data
    return response.data
  },
  error => {
    // 隐藏请求loading
    // Indicator.close();
    // 响应请求时可能出错，出错的信息在error的response中，请求时发现没有token的登录失效问题，或者一些其他问题
    if(!error.response){
      // 此处是由于没有登录而产生的错误
      if (router.currentRoute.path !== '/login'){
        router.replace('/login')
        Toast(error.message)
      }
    }else if (error.response.status === 401){
      store.dispatch("logout")
      // 此处是由于token过时失效而产生的错误
      if (router.currentRoute.path !== '/login'){
        Toast(error.response.data.message || '登录失效，请重新登录...')
        router.replace('/login')
      }else{
        MessageBox('提示','请求出错：'+error.message)
      }
    }
    return new Promise(()=>{})
  }
)

export default instance
