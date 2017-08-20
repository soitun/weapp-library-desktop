import Vuex from 'vuex'
import Vue from 'vue'
import { getUserInfoById, getUserInfoByIdWithoutNotify, updateUserInfoById, login } from '../api/index.js';
import { getId, setId, removeId } from '../utils/auth.js';
import { Notification } from 'element-ui';

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        userInfo: {
            id: getId(),
            state: 0,
            name: "",
            admin_name: "",
            admin_phone: undefined,
            image_urls: []
        },
        showTip: false, // 馆藏页提示是否已经显示过
        showStateTip: false, // 账号审核状态是否已经提示过
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
        },
        SET_SHOW_STATE_TIP(state, showStateTip) {
            state.showStateTip = showStateTip;
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
                    image_urls: []
                });
                resolve();
            });
        },
        GET_INFO({ commit, state, getters }, notifyOnError) {
            return new Promise((resolve, reject) => {
                var fetch = notifyOnError ? getUserInfoById : getUserInfoByIdWithoutNotify;
                fetch(getters.id).then(res => {
                    if (!state.showStateTip) {
                        if (res.state == '0') {
                            Notification.warning({
                                title: "审核中",
                                message: "您的账号正在审核中，您可提供更详细的信息以完成认证，认证通过后您的账号将拥有认证标志，并且其他图书馆将不能使用和你相同的名称",
                                duration: 0
                            })
                        } else if (res.state == '2') {
                            Notification.error({
                                title: "审核未通过",
                                message: "您的账号未通过审核，原因是：" + res.reason + "。您可提供更详细的信息以完成认证，认证通过后您的账号将拥有认证标志，并且其他图书馆将不能使用和你相同的名称",
                                duration: 0
                            })
                        }
                        commit('SET_SHOW_STATE_TIP', true);
                    }
                    commit('SET_USER_INFO', res);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },
        UPDATE_USER_INFO({ commit, getters }, data) {
            return new Promise((resolve, reject) => {
                if (getters.state == 2) {
                    data.request_reapprove = true; // 未通过审核时要求复审
                }
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