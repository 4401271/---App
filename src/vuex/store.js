/*
* vuex最核心的管理对象
*
* */

import Vue from 'vue'
import Vuex from 'vuex'

import mutations from "@/vuex/mutations"
import getters from "@/vuex/getters"
import actions from "@/vuex/actions"
import msite from "@/vuex/modules/msite"
import user from '@/vuex/modules/user'
import shop from '@/vuex/modules/shop'

Vue.use(Vuex)

export default new Vuex.Store({
  mutations,  // 总的mutations
  getters,    // 操作的是总的state
  actions,
  modules: {
    msite,
    user,
    shop
  }
})
