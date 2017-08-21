import Vue from 'vue';
import ElementUI from 'element-ui';
import Vuex from 'vuex';
import Router from 'vue-router';

var echarts = require('echarts/lib/echarts');
// 引入条形图，饼图
require('echarts/lib/chart/line');
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');