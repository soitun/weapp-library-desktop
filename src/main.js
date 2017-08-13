import Vue from 'vue';
import ElementUI from 'element-ui';
import VueAreaLinkage from 'vue-area-linkage';
import 'element-ui/lib/theme-default/index.css';
import App from './App.vue'
import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // Progress 进度条 样式
import router from './router';
import Echarts from 'vue-echarts';
import store from './store'
require('promise.prototype.finally').shim();

Vue.use(ElementUI);
Vue.use(VueAreaLinkage);
Vue.component('chart', Echarts);

Vue.prototype.$axios = axios;

Vue.prototype.setCookie = (c_name, value, expiredays) => {
    var exdate = new Date();　　　　
    exdate.setDate(exdate.getDate() + expiredays);　　　　
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

Vue.prototype.getCookie = (name) => {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
}

Vue.prototype.deleteCookie = (name) => {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = Vue.prototype.getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

router.beforeEach((to, from, next) => {
    NProgress.start(); // 开启Progress
    if (to.path == '/login') {
        Vue.prototype.deleteCookie('id');
    }
    if (!Vue.prototype.getCookie('id') && to.path != '/login') {
        next({ path: '/login' })
        NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题
    } else if (to.path != '/login' && !store.state.userInfo) {
        // 获取用户信息
        Vue.prototype.$axios.get("/api/libraries/" + Vue.prototype.getCookie('id')).then(res => {
            store.commit('SET_USER_INFO', res.data.data);
            next();
        }).catch(() => {
            Vue.prototype.$message.error("获取用户信息失败, 请刷新重试");
        });
    } else {
        next();
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