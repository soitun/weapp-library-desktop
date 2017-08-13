import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        redirect: '/login'
    }, {
        path: '/login',
        component: resolve => require(["../views/Login.vue"], resolve)
    }, {
        path: '/home',
        component: resolve => require(["../views/Home.vue"], resolve),
        children: [{
            path: '',
            component: resolve => require(["../views/Dashboard.vue"], resolve)
        }, {
            path: '/order',
            component: resolve => require(["../views/Order.vue"], resolve)
        }, {
            path: '/collection',
            component: resolve => require(["../views/Collection.vue"], resolve)
        }]
    }]
})
