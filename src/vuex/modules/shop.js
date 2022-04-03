import Vue from 'vue'
import {ADD_FOOD_COUNT, RED_FOOD_COUNT, CLEAR_CART, RECEIVE_SHOP, RECEIVE_RATINGS} from "@/vuex/mutation-types";
import { reqShop, reqRatings } from "@/api";
import { getCartFoods } from "@/utils";

export default {
  state: {
    shop: {},
    cartFoods: []   // 显示在购物车中的食物信息
  },

  mutations: {
    [ADD_FOOD_COUNT](state, {food}){
      if (food.count){
        food.count++
      }else{
        Vue.set(food, 'count', 1)
        state.cartFoods.push(food)
      }
    },
    [RED_FOOD_COUNT](state, {food}){
      food.count--
      if (food.count === 0){
        state.cartFoods.splice(state.cartFoods.indexOf(food), 1)
      }
    },
    [RECEIVE_RATINGS](state, {ratings}) {
      state.shop.ratings = ratings
    },
    [CLEAR_CART](state){
      state.cartFoods.forEach(food => food.count = 0)
      // 在上一步就已经将所有商品的数量置空，但是由于购物车仍然处于被拉开状态，我们需要将其收回，只需要清空购物车列表即可，购物车列表只要是空的就自然会收回
      state.cartFoods = []
    },
    /* 可以用来修改数据，可也以用来重置数据，利用了形参默认值 */
    [RECEIVE_SHOP](state, {shop={}, cartFoods=[]}){
      state.shop = shop
      state.cartFoods = cartFoods
    }
  },
  actions: {
    async getShop({commit, state}, id){
      // 重复访问一个店铺只请求一次
      //    我们每次点击不同的店铺都会对不同的店铺发送请求，此时会将店铺的信息保存在shop.js的shop对象中，我们只需要比对下次点击时，对应店铺的id和shop对象中保存的店铺的id是否相同即可，相同就直接显示这个店铺就可以了，也就不需要再发送请求了
      // state.shop就是当前文件的状态里面的shop
      if (id == state.shop.id){
        return
      }

      // 获取店铺信息
      if (state.shop.id){
        // 我们需要先重置状态中的数据
        commit(RECEIVE_SHOP, {})  // 空容器不带shop对象，因此我们需要在mutation中设置一下形参默认值，即当不传值的时候，所存储的数据
      }
      const result = await reqShop(id)

      if (result.code === 0){
        const shop = result.data
        // 获取当前商家的购物车列表
        const cartFoods = getCartFoods(shop)
        commit(RECEIVE_SHOP, {shop, cartFoods})

      }
    },

    // 异步获取商家评价列表
    async getShopRatings({commit}, cb) {
      const result = await reqRatings()
      if(result.code===0) {
        const ratings = result.data
        commit(RECEIVE_RATINGS, {ratings})

        cb && cb()
      }
    },

    updateFoodCount({commit}, {food, isAdd}){
      if (isAdd){
        commit(ADD_FOOD_COUNT, {food})
      }else {
        commit(RED_FOOD_COUNT, {food})
      }
    }
  },
  getters: {
    totalCount(state){
      return state.cartFoods.reduce((pre, food) => pre + food.count, 0)
    },
    totalPrice(state){
      return state.cartFoods.reduce((pre, food) => pre + food.count*food.price, 0)
    },
    positiveSize (state) {
      return state.shop.ratings.reduce((total, rating) => total + (rating.rateType===0 ? 1 : 0), 0)
    }
  }
}