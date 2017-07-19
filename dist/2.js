webpackJsonp([2],{117:function(t,e,a){a(176);var i=a(38)(a(133),a(169),"data-v-2cbc2732",null);t.exports=i.exports},133:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={data:function(){return{libraryId:localStorage.getItem("libraryId"),orderData:[],total:void 0,pageSize:20,currentPage:1,currentTableType:"all",dialogData:{id:null,state:null,user:{name:null,phone:null},book_brief:{title:null,isbn:null}},dialogStateValue:"",dialogFormVisible:!1,popoverVisible:!1,orderTableLoading:!1,dialogSubmitBtnLoading:!1,dialogDeleteBtnLoading:!1,stateOptions:[{value:1001,label:"预约中"},{value:1002,label:"可取书"},{value:1004,label:"借阅中"},{value:1005,label:"已超期"},{value:1011,label:"已归还"}],searchOptions:{orderId:void 0,phone:void 0,startDate:void 0,endDate:void 0,states:[]},pickerOptions:{shortcuts:[{text:"今天",onClick:function(t){t.$emit("pick",new Date)}},{text:"昨天",onClick:function(t){var e=new Date;e.setTime(e.getTime()-864e5),t.$emit("pick",e)}},{text:"一周前",onClick:function(t){var e=new Date;e.setTime(e.getTime()-6048e5),t.$emit("pick",e)}}]}}},created:function(){this.fetchData(1)},methods:{handleEdit:function(t){this.dialogData=t,this.dialogFormVisible=!0},handleSubmit:function(){if(!this.dialogStateValue)return this.dialogFormVisible=!1;var t=this;t.$axios.post("/api/orders/"+t.dialogData.id,{state:t.dialogStateValue}).then(function(e){t.dialogSubmitBtnLoading=!1,200==e.data.code?(t.dialogFormVisible=!1,t.$message.success("修改成功"),t.fetchData(t.currentPage)):t.$message.error("修改失败")})},handleDelete:function(){this.popoverVisible=!1,this.dialogDeleteBtnLoading=!0;var t=this;t.$axios.delete("/api/orders/"+t.dialogData.id).then(function(e){t.dialogDeleteBtnLoading=!1,200==e.data.code?(t.dialogFormVisible=!1,t.$message.success("删除订单成功"),t.orderData.splice(t.orderData.findIndex(function(e){return e.id==t.dialogData.id}),1)):t.$message.error("删除订单失败："+e.data.errmsg)}).catch(function(e){t.dialogDeleteBtnLoading=!1,t.$message.error("删除订单失败")})},handleSearch:function(){this.currentTableType="search",1==this.currentPage?this.fetchData(1):this.currentPage=1},resetTable:function(){this.searchOptions={phone:void 0,startDate:void 0,endDate:void 0,states:[]},this.currentTableType="all",1==this.currentPage?this.fetchData(1):this.currentPage=1},resetFields:function(){this.dialogStateValue=""},fetchData:function(t){var e=(t-1)*this.pageSize,a=this,i="/api/orders/libraries/"+this.libraryId+"?start="+e,s={};"search"==this.currentTableType&&(i="/api/orders/libraries/"+this.libraryId+"?start="+e,this.searchOptions.orderId&&(s.order_id=this.searchOptions.orderId),this.searchOptions.phone&&(s.phone=this.searchOptions.phone),this.searchOptions.startDate&&(s.start_date=this.searchOptions.startDate),this.searchOptions.endDate&&(s.end_date=this.searchOptions.endDate),this.searchOptions.states&&(s.states=[],this.searchOptions.states.includes(1001)&&s.states.push(1001),this.searchOptions.states.includes(1002)&&s.states.push(1002,1003),this.searchOptions.states.includes(1004)&&s.states.push(1004),this.searchOptions.states.includes(1005)&&s.states.push(1005),this.searchOptions.states.includes(1011)&&s.states.push(1011,1012,1013,1014,1015))),a.orderTableLoading=!0,a.$axios.get(i,{params:s}).then(function(t){a.orderTableLoading=!1,200==t.data.code?(t.data.data.subjects.forEach(function(e,a){e.state>1010&&(t.data.data.subjects[a].stateColor="gray",t.data.data.subjects[a].stateTitle="已归还"),1001==e.state&&(t.data.data.subjects[a].stateColor="warning",t.data.data.subjects[a].stateTitle="预约中"),1002!=e.state&&1003!=e.state||(t.data.data.subjects[a].stateColor="primary",t.data.data.subjects[a].stateTitle="可取书"),1004==e.state&&(t.data.data.subjects[a].stateColor="success",t.data.data.subjects[a].stateTitle="借阅中"),1005==e.state&&(t.data.data.subjects[a].stateColor="danger",t.data.data.subjects[a].stateTitle="已超期")}),a.orderData=t.data.data.subjects,0==e&&(a.total=t.data.data.total)):a.$message.error("获取订单列表失败："+t.data.errmsg)})}}}},162:function(t,e,a){e=t.exports=a(10)(void 0),e.push([t.i,".el-pagination[data-v-2cbc2732]{margin-top:20px;text-align:center}.el-table .el-form-item[data-v-2cbc2732]{margin:0}.dialog-footer>.deleteBtn[data-v-2cbc2732]{float:left}",""])},169:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"content"},[a("el-form",{attrs:{inline:""}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"订单号"},model:{value:t.searchOptions.orderId,callback:function(e){t.searchOptions.orderId=e},expression:"searchOptions.orderId"}})],1),t._v(" "),a("el-form-item",[a("el-input",{attrs:{placeholder:"手机号"},model:{value:t.searchOptions.phone,callback:function(e){t.searchOptions.phone=e},expression:"searchOptions.phone"}})],1),t._v(" "),a("el-form-item",[a("el-date-picker",{attrs:{align:"right",type:"date",placeholder:"起始日期","picker-options":t.pickerOptions},model:{value:t.searchOptions.startDate,callback:function(e){t.searchOptions.startDate=e},expression:"searchOptions.startDate"}})],1),t._v(" "),a("el-form-item",[a("el-date-picker",{attrs:{align:"right",type:"date",format:"yyyy-MM-dd",placeholder:"结束日期","picker-options":t.pickerOptions},model:{value:t.searchOptions.endDate,callback:function(e){t.searchOptions.endDate=e},expression:"searchOptions.endDate"}})],1),t._v(" "),a("el-form-item",[a("el-select",{attrs:{multiple:"",placeholder:"订单状态"},model:{value:t.searchOptions.states,callback:function(e){t.searchOptions.states=e},expression:"searchOptions.states"}},t._l(t.stateOptions,function(t){return a("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})}))],1),t._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.handleSearch()}}},[t._v("搜索")])],1),t._v(" "),a("el-form-item",[a("el-button",{on:{click:function(e){t.resetTable()}}},[t._v("重置")])],1)],1),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.orderTableLoading,expression:"orderTableLoading"}],staticStyle:{width:"100%"},attrs:{data:t.orderData,stripe:""}},[a("el-table-column",{attrs:{type:"expand"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-form",{attrs:{"label-position":"left","label-width":"120px"}},[a("el-form-item",{attrs:{label:"订单创建日期："}},[a("span",[t._v(t._s(e.row.create_time))])]),t._v(" "),a("el-form-item",{attrs:{label:"订单结束日期："}},[a("span",[t._v(t._s(e.row.create_time))])]),t._v(" "),a("el-form-item",{attrs:{label:"借书开始日期："}},[a("span",[t._v(t._s(e.row.actual_take_time))])]),t._v(" "),a("el-form-item",{attrs:{label:"续借次数："}},[a("span",[t._v(t._s(e.row.renew_count))])]),t._v(" "),a("el-form-item",{attrs:{label:"应还日期："}},[a("span",[t._v(t._s(e.row.should_return_time))])]),t._v(" "),a("el-form-item",{attrs:{label:"实际归还日期："}},[a("span",[t._v(t._s(e.row.actual_return_time))])])],1)]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"id",label:"订单id",width:"100"}}),t._v(" "),a("el-table-column",{attrs:{prop:"user.name",label:"借阅人",width:"100"}}),t._v(" "),a("el-table-column",{attrs:{prop:"user.phone",label:"手机号"}}),t._v(" "),a("el-table-column",{attrs:{prop:"book_brief.title",label:"书名"}}),t._v(" "),a("el-table-column",{attrs:{prop:"book_brief.isbn",label:"ISBN"}}),t._v(" "),a("el-table-column",{attrs:{label:"订单状态",width:"120"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-tag",{attrs:{type:e.row.stateColor}},[t._v(t._s(e.row.stateTitle))])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"操作",width:"120"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{size:"small"},on:{click:function(a){t.handleEdit(e.row)}}},[t._v("编辑")])]}}])})],1),t._v(" "),a("el-pagination",{attrs:{layout:"prev, pager, next",total:t.total,"page-size":t.pageSize,"current-page":t.currentPage},on:{"update:currentPage":function(e){t.currentPage=e},"current-change":t.fetchData}}),t._v(" "),a("div",[t._v("一共"+t._s(t.total)+"条订单数据")]),t._v(" "),a("el-dialog",{attrs:{title:"设置馆藏",visible:t.dialogFormVisible},on:{"update:visible":function(e){t.dialogFormVisible=e},close:t.resetFields}},[a("el-form",{attrs:{"label-width":"120px","label-position":"left",model:t.dialogData}},[a("el-form-item",{attrs:{label:"订单id"}},[a("el-input",{attrs:{disabled:"",value:t.dialogData.id}})],1),t._v(" "),a("el-form-item",{attrs:{label:"借阅人"}},[a("el-input",{attrs:{disabled:"",value:t.dialogData.user.name}})],1),t._v(" "),a("el-form-item",{attrs:{label:"手机号"}},[a("el-input",{attrs:{disabled:"",value:t.dialogData.user.phone}})],1),t._v(" "),a("el-form-item",{attrs:{label:"图书名称"}},[a("el-input",{attrs:{disabled:"",value:t.dialogData.book_brief.title}})],1),t._v(" "),a("el-form-item",{attrs:{label:"ISBN"}},[a("el-input",{attrs:{disabled:"",value:t.dialogData.book_brief.isbn}})],1),t._v(" "),a("el-form-item",{attrs:{label:"订单状态"}},[a("el-select",{attrs:{placeholder:t.dialogData.stateTitle},model:{value:t.dialogStateValue,callback:function(e){t.dialogStateValue=e},expression:"dialogStateValue"}},t._l(t.stateOptions,function(t){return a("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})}))],1)],1),t._v(" "),a("div",{staticClass:"dialog-footer",slot:"footer"},[a("el-popover",{ref:"confirmPopover",attrs:{placement:"top",width:"160"},model:{value:t.popoverVisible,callback:function(e){t.popoverVisible=e},expression:"popoverVisible"}},[a("p",[t._v("删除此订单可能影响该图书的可借数量，确定删除吗？")]),t._v(" "),a("div",{staticStyle:{"text-align":"right",margin:"0"}},[a("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(e){t.popoverVisible=!1}}},[t._v("取消")]),t._v(" "),a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(e){t.handleDelete()}}},[t._v("确定")])],1)]),t._v(" "),a("el-button",{directives:[{name:"popover",rawName:"v-popover:confirmPopover",arg:"confirmPopover"}],staticClass:"deleteBtn",attrs:{type:"danger",loading:t.dialogDeleteBtnLoading}},[t._v("删除此订单")]),t._v(" "),a("el-button",{on:{click:function(e){t.dialogFormVisible=!1}}},[t._v("取 消")]),t._v(" "),a("el-button",{attrs:{type:"primary",loading:t.dialogSubmitBtnLoading},on:{click:function(e){t.handleSubmit()}}},[t._v("确 定")])],1)],1)],1)},staticRenderFns:[]}},176:function(t,e,a){var i=a(162);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);a(39)("05a77b72",i,!0)}});
//# sourceMappingURL=2.js.map?a5d05105c955d604569e