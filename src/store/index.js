import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    userInfo: null
  },
  mutations: {
    userInfo(state, userInfo){
        state.userInfo = userInfo;
    }
  }
})