import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        userInfo: null,
        showTip: false, // 馆藏页提示是否已经显示过
    },
    getters: {
        adminPhone: state => state.userInfo.admin_phone,
        showTip: state => state.showTip,
    },
    mutations: {
        SET_USER_INFO(state, userInfo) {
            state.userInfo = userInfo;
        },
        SET_SHOW_TIP(state, showTip) {
            state.showTip = showTip;
        }
    }
})