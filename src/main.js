import Vue from 'vue';
import ElementUI from 'element-ui';
import { Message } from 'element-ui';
import VueAreaLinkage from 'vue-area-linkage';
import 'element-ui/lib/theme-default/index.css';
import App from './App.vue'
import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // Progress 进度条 样式
import router from './router';
import Echarts from 'vue-echarts';
import store from './store';
import { getId } from './utils/auth.js';
require('promise.prototype.finally').shim();

Vue.use(ElementUI);
Vue.use(VueAreaLinkage);
Vue.component('chart', Echarts);


// 每隔一定时间更新用户信息
if (store.getters.id) {
    store.dispatch("GET_INFO")
}
setInterval(() => {
    if (store.getters.id) {
        store.dispatch("GET_INFO")
    }
}, 5000);

router.beforeEach((to, from, next) => {
    NProgress.start(); // 开启Progress 

    // 如果进入登录页，在有cookie的时候跳至主页
    if (to.path == '/login') {
        if (getId()) {
            next({ path: '/home' })
            NProgress.done();
        } else {
            next();
        }
    }
    // 如果进入的不是登录页，在没cookie的时候跳到登录页
    else if (!getId()) {
        next({ path: '/login' })
        NProgress.done();
    } else {
        // 如果有cookie，检查是否已经获取了用户信息
        if (!store.getters.adminPhone) {
            // 获取用户信息
            store.dispatch('GET_INFO').then(res => {
                next();
            }).catch(() => {
                Message.error("获取用户信息失败, 请刷新重试");
                NProgress.done();
            });
        } else {
            next();
        }
    }
})

router.afterEach(() => {
    NProgress.done(); // 结束Progress
});


new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})