webpackJsonp([1],{115:function(e,t,n){var o=n(38)(n(131),n(173),null,null);e.exports=o.exports},130:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={data:function(){return{name:"zkh"}},computed:{username:function(){var e=localStorage.getItem("username");return e||this.name},onRoutes:function(){return this.$route.path.replace("/","")}},methods:{handleCommand:function(e){"loginout"==e&&(localStorage.removeItem("username"),this.$router.push("/login"))}}}},131:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(168),a=n.n(o);t.default={components:{vHead:a.a}}},166:function(e,t,n){t=e.exports=n(10)(void 0),t.push([e.i,".header[data-v-d3f6a578]{position:relative;box-sizing:border-box;width:100%;height:60px;font-size:22px;line-height:60px;color:#fff}.header .logo[data-v-d3f6a578]{float:left;width:250px;text-align:center}.user-info[data-v-d3f6a578]{float:right;height:60px;padding-right:50px;color:#fff}.user-info .el-dropdown[data-v-d3f6a578]{display:block}.user-info .el-dropdown-link[data-v-d3f6a578]{position:relative;padding-left:50px;height:60px;color:#fff;cursor:pointer;vertical-align:middle}.el-dropdown-menu__item[data-v-d3f6a578]{text-align:center}.el-menu-item.is-active[data-v-d3f6a578]{border-bottom:5px solid #20a0ff}",""])},168:function(e,t,n){n(180);var o=n(38)(n(130),n(175),"data-v-d3f6a578",null);e.exports=o.exports},173:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"wrap"},[n("v-head"),e._v(" "),n("transition",{attrs:{name:"move",mode:"out-in"}},[n("router-view")],1)],1)},staticRenderFns:[]}},175:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-menu",{staticClass:"header",attrs:{theme:"dark","default-active":e.onRoutes,mode:"horizontal",router:""}},[n("div",{staticClass:"logo"},[e._v("图书馆后台管理系统")]),e._v(" "),n("el-menu-item",{attrs:{index:"home"}},[e._v("个人中心")]),e._v(" "),n("el-menu-item",{attrs:{index:"collection"}},[e._v("馆藏管理")]),e._v(" "),n("el-menu-item",{attrs:{index:"order"}},[e._v("订单管理")]),e._v(" "),n("div",{staticClass:"user-info"},[n("el-dropdown",{attrs:{trigger:"click"},on:{command:e.handleCommand}},[n("span",{staticClass:"el-dropdown-link"},[e._v("\n                欢迎你，"+e._s(e.username)+" \n                "),n("i",{staticClass:"el-icon-setting",staticStyle:{"margin-left":"5px"}})]),e._v(" "),n("el-dropdown-menu",{slot:"dropdown"},[n("el-dropdown-item",{attrs:{command:"loginout"}},[e._v("退出")])],1)],1)],1)],1)},staticRenderFns:[]}},180:function(e,t,n){var o=n(166);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);n(39)("7265e554",o,!0)}});
//# sourceMappingURL=1.js.map?116acd402e0ee6219070