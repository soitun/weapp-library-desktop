import Vuex from 'vuex'
import Vue from 'vue'
import { getUserInfoById, updateUserInfoById, login } from '../api/index.js';
import { getId, setId, removeId } from '../utils/auth.js';

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        userInfo: {
            id: getId(),
            state: 0,
            name: "",
            admin_name: "",
            admin_phone: undefined,
        },
        showTip: false, // 馆藏页提示是否已经显示过
    },
    getters: {
        id: state => state.userInfo.id,
        state: state => state.userInfo.state,
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
    },
    actions: {
        LOGIN({ commit }, params) {
            return new Promise((resolve, reject) => {
                login(params.phone, params.password).then((res) => {
                    setId(res.id);
                    commit('SET_USER_INFO', res);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            });
        },
        LOG_OUT({ commit }, params) {
            return new Promise((resolve, reject) => {
                removeId();
                commit('SET_USER_INFO', {
                    id: undefined,
                    state: 0,
                    name: "",
                    admin_name: "",
                    admin_phone: undefined,
                });
                resolve();
            });
        },
        GET_INFO({ commit, getters }) {
            return new Promise((resolve, reject) => {
                getUserInfoById(getters.id).then(res => {
                    commit('SET_USER_INFO', res);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },
        UPDATE_USER_INFO({ commit, getters }, data) {
            return new Promise((resolve, reject) => {
                updateUserInfoById(getters.id, data).then(res => {
                    commit('SET_USER_INFO', data);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },
    }
})