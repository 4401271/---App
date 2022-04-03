/*
* 包含n个接口请求的函数模块
* */
import ajax from './ajax'

// 1. 根据经纬度获取位置详情
export const reqAddress = (long, lat) => ajax(`/position/${lat},${long}`)

// 2. 获取食品分类列表
export const reqCategories = () => ajax('/index_categories', {
  headers: {
    needCheck: true
  }
})

// 3. 根据经纬度获取商铺列表
export const reqShops = ({long, lat}) => ajax('/shops', {
  params: {long, lat},
  headers: {
    needCheck: true
  }
})

// 4. 发送短信验证码
export const reqSendCode = (phone) => ajax.get('/sendcode',{
  params: {
    phone
  }
})

// 5. 用户名密码登录     get请求第一个参数是路径，第二个参数是传递的配置对象，而post第一个参数是路径，第二个参数是参数对象，然后是配置
export const reqPwdLogin = ({name, pwd, captcha}) => ajax.post('/login_pwd', {name, pwd, captcha})

// 6. 手机号验证码登录
export const reqSmsLogin = ({phone, code}) => ajax.post('/login_sms', {phone, code})

// 7. 自动登录
export const reqAutoLogin = () => ajax.get('/auto_login')

export const reqShop = (id) => ajax('/shop/' +  id)

export const reqRatings = () => ajax('/ratings')

