import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        userInfo: null
    },
    getters: {
        adminPhone: state => state.userInfo.admin_phone
    },
    mutations: {
        userInfo(state, userInfo) {
            state.userInfo = userInfo;
        }
    }
})