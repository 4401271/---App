import {RECEIVE_TOKEN, RECEIVE_USER, RESET_TOKEN, RESET_USER} from "@/vuex/mutation-types";
import {reqAutoLogin} from "@/api";

export default {
  state: {
    user: {}, //用户信息
    token: localStorage.getItem('token_key') || '',
  },
  mutations: {
    [RECEIVE_USER](state, {user}){
      state.user = user
    },
    [RECEIVE_TOKEN](state, {token}){
      state.token = token
    },
    [RESET_TOKEN](state){
      state.token = ''
    },
    [RESET_USER](state){
      state.user = {}
    },
  },
  actions: {
    saveUser({commit}, user){
      const token = user.token
      // 将token 保存到local
      localStorage.setItem('token_key', token)

      delete user.token
      commit(RECEIVE_TOKEN, {token})
      commit(RECEIVE_USER, {user})
    },

    /*
    * 自动登录
    * */
    async autoLogin({commit, state}) {
      // 配置自动登录，在有token但是没有user._id时需要自动登录，自动登录即携带token向后台发送请求，然后将用户信息再加进去
      if (state.token && !state.user._id){
        const result = await reqAutoLogin()
        if (result.code === 0){
          const user = result.data
          commit(RECEIVE_USER, {user})
        }
      }
    },

    logout({commit}){
      localStorage.removeItem('token_key'),
      commit(RESET_USER)
      commit(RESET_TOKEN)
    },
  },
  getters: { }
}