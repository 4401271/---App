/*
* 当前文件用于存放所有的工具函数
* */

import Vue from 'vue'

// 保存当前商家的购物车信息至session，保存了商家的id、食物的id、以及食物的数量
export function saveCartFoods(shopId, cartFoods) {
  // cartCountsList内部格式：{1: 3, 2: 5} id为1的食物数量为3，id为2的食物数量为5，最后
  const cartCountsList = cartFoods.reduce((pre, food)=>{
    // pre一开始是个空对象，用来存储每个食物的id和它对应的数量，
    // 然后依次在这个空对象中创建名为food.id的属性，这个属性对应了食物的id,值为cartFoods中的的每一个食物的数量
    pre[food.id] = food.count
    return pre
  }, {})

  // 保存到sessionStorage
  sessionStorage.setItem(shopId + '_key', JSON.stringify(cartCountsList))
}

// 根据session信息生成一个保存用户所选商品的购物车对象
export function getCartFoods(shop) {
  const cartFoods = []
  // 获取session中店铺对应商品信息的对象
  const cartCountsList = JSON.parse(sessionStorage.getItem(shop.id+'_key')) || {}

  // 已经进入的对应的商铺，shop中保存着这个商铺对应的商品，首先遍历得到的商品的类别，例如优惠、折扣、甜粥
  shop.goods.forEach(classes => {
    // 此时再遍历，得到的就是每个类别下的商品，例如：南瓜粥
    classes.foods.forEach(food => {
      // 取出food在cartCountsList中对应的商品数量
      // cartCountsList是一个对象，想要从一个对象中快速获取一个name对应value，用的方法是cartCountsList[name]，这样取出的就是name属性对应的value
      const foodCount = cartCountsList[food.id]
      if (foodCount > 0 ){
        Vue.set(food, 'count', foodCount)
        cartFoods.push(food)
      }
    })
  })
  return cartFoods
}