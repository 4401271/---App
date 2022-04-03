import Mock from 'mockjs'
import data from './data.json'
import shops from './shops.json'

Mock.mock('/api/goods', {code: 0, data: data.goods})
Mock.mock('/api/ratings', {code: 0, data: data.ratings})
Mock.mock('/api/info', {code: 0, data: data.info})
Mock.mock(/^\/api\/shop\/\d+$/, function (options) {
  // 这个发送请求的url字符串就存储在options的url中，因此我们如果想要这个id，只需要按位置取出来这个id即可，对应开始下标是10
  const id = options.url.substring(10)
  const shop = shops.find(shop=>shop.id == id)
  // 因为有个时候可能会因为数据错误，导致请求的id有问题，那么我们就需要在这个时候显示第一个商家的信息
  return Mock.mock({code: 0, data: shop || shops[0]} )
})