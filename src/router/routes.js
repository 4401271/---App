// import这种引入方式称为：静态引入 打包时引入 且必须写在最上面
/*import MSite from "@/pages/MSite/MSite";
import Order from "@/pages/Order/Order";
import Profile from "@/pages/Profile/Profile";
import Search from "@/pages/Search/Search";*/

/*
项目优化：路由组件懒加载：
1）在打包时，路由组件会被单独打包（代码分割：code split）
2）默认不请求加载路由组件打包文件，请求对应路由时才去请求加载

1. import动态引入（哪里需要就写在哪里）：
      将import(模块路径)放在一个函数的返回值中
      结果：被引入的模块会被单独打包
2. 配置的路由组件是一个可以返回动态加载路由组件模块的函数
      函数在开始的时候并不会执行（即：开始并不会加载（请求）单独打包的路阻组件模块代码）
      当切换组件界面以请求对应路径时，才去加载由组件打包的文件

作用：
  应用一上来需要加载的文件更小了，因此启动就会更快（提高首屏加载速度）
*/
// const MSite = () => import('@/pages/MSite/MSite')
const Order = () => import('@/pages/Order/Order')
const Profile = () => import('@/pages/Profile/Profile')
const Search = () => import('@/pages/Search/Search')


import Login from "@/pages/Login/Login";
import Shop from "@/pages/Shop/Shop";
import Goods from "@/pages/Shop/Children/Goods";
import Info from "@/pages/Shop/Children/Info";
import Ratings from "@/pages/Shop/Children/Ratings";

export default [
  {
    path: '/msite',
    // component: MSite,
    //方式二：直接动态加载
    component: () => import('@/pages/MSite/MSite'),
    // 元对象，元对象仅在对应当前路径时才会存在，假如路径对应的是：login，则在$router中就不存在该属性
    meta: {
      isShow: true
    }
  },
  {
    path: '/order',
    component: Order,
    meta: {
      isShow: true
    }
  },
  {
    path: '/profile',
    component: Profile,
    meta: {
      isShow: true
    }
  },
  {
    path: '/search',
    component: Search,
    meta: {
      isShow: true
    }
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/shop/:id',
    name: 'shop',
    props: true,  // 将所有params属性转换为标签属性传递给子路由组件
    component: Shop,
    children: [
      {
        path: 'goods',
        component: Goods
      },
      {
        path: 'info',
        component: Info
      },
      {
        path: 'ratings',
        component: Ratings
      },
      {
        path: '',
        redirect: 'goods'
      }
    ]
  },
  {
    path: '/',
    redirect: '/msite'
  }
]