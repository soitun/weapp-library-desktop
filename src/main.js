import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import axios from 'axios';
import router from './router';
import Echarts from 'vue-echarts';
import store from './store'

Vue.use(ElementUI)
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



new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App),
    watch: {
        "$route": 'checkLogin'
    },
    created() {
        this.checkLogin();
    },
    methods: {
        checkLogin() {
            //检查是否存在session
            if (!this.getCookie('session')) {
                this.$router.push('/login');
            } else {
                this.$router.push('/home');
            }
        }
    }
})
