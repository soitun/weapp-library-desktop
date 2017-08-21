import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import Order from '../views/Order.vue';
import Collection from '../views/Collection.vue';

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        redirect: '/login'
    }, {
        path: '/login',
        component: Login
    }, {
        path: '/home',
        component: Home,
        children: [{
            path: '',
            component: Dashboard
        }, {
            path: '/order',
            component: Order
        }, {
            path: '/collection',
            component: Collection
        }]
    }]
})
