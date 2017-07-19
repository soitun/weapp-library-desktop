import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import axios from 'axios';
import router from './router';
import Echarts from 'vue-echarts';

Vue.use(ElementUI)
Vue.component('chart', Echarts);
Vue.prototype.$axios = axios;
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
