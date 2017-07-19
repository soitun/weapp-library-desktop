import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        redirect: '/login'
    }, {
        path: '/login',
        component: resolve => require(['../components/Login.vue'], resolve)
    }, {
        path: '/home',
        component: resolve => require(['../components/Home.vue'], resolve),
        children: [{
            path: '',
            component: resolve => require(['../components/Dashboard.vue'], resolve)
        }, {
            path: '/order',
            component: resolve => require(['../components/Order.vue'], resolve)
        }, {
            path: '/collection',
            component: resolve => require(['../components/Collection.vue'], resolve)
        }]
    }]
})
