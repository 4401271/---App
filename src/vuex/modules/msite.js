import {RECEIVE_ADDRESS, RECEIVE_CATEGORIES, RECEIVE_SHOPS} from "@/vuex/mutation-types";
import {reqAddress, reqCategories, reqShops} from "@/api";

export default {
  state: {
    lat: 22.297088, // 纬度
    long: 114.178196, // 经度
    address: {}, // 地址信息对象
    categories: [], // 分类数组
    shops: [], //商家数组
  },
  mutations: {
    [RECEIVE_ADDRESS](state, address){
      state.address = address
    },
    [RECEIVE_CATEGORIES](state, categories){
      state.categories = categories
    },
    [RECEIVE_SHOPS](state, shops){
      state.shops = shops
    },
  },
  actions: {
    /*
 * 获取当前地址信息对象的异步action
 * */
    async getAddress({commit, state}){
      const {long, lat} = state
      // 发送异步请求
      const result = await reqAddress(long, lat)

      // 请求成功后，提交给mutation
      if (result.code === 0){
        const address = result.data
        commit(RECEIVE_ADDRESS, address)
      }
    },

    async getCategories({commit}){
      // 发送异步请求
      const result = await reqCategories()

      // 请求成功后，提交给mutation
      if (result.code === 0){
        const categories = result.data
        commit(RECEIVE_CATEGORIES, categories)
      }
    },

    async getShops({commit, state}){
      const {long, lat} = state
      // 发送异步请求
      const result = await reqShops({long, lat})

      // 请求成功后，提交给mutation
      if (result.code === 0){
        const shops = result.data
        commit(RECEIVE_SHOPS, shops)
      }
    },

  },
  getters: { }
}