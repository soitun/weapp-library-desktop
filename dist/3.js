webpackJsonp([3],{116:function(e,r,o){o(179);var i=o(38)(o(132),o(174),"data-v-cb0261fc",null);e.exports=i.exports},132:function(e,r,o){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.default={data:function(){var e=this;return{loginForm:{phone:"",password:""},loginRules:{phone:[{required:!0,message:"请输入用户名",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"}]},registerForm:{manager:"",managerPhone:"",password:"",confirmPassword:"",name:"",address:"",telephone:"",description:""},registerRules:{manager:[{required:!0,message:"请输入负责人姓名",trigger:"blur"}],managerPhone:[{required:!0,message:"请输入负责人手机号",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{validator:function(r,o,i){""!==e.registerForm.confirmPassword&&e.$refs.registerForm.validateField("confirmPassword"),i()}}],confirmPassword:[{required:!0,message:"请再次输入密码",trigger:"blur"},{validator:function(r,o,i){o!==e.registerForm.password?i(new Error("两次输入密码不一致!")):i()}}],name:[{required:!0,message:"请输入图书馆名称",trigger:"blur"}],address:[{required:!0,message:"请输入图书馆地址",trigger:"blur"}],phone:[{required:!0,message:"请输入图书馆电话",trigger:"blur"}],description:[{required:!0,message:"请输入图书馆描述",trigger:"blur"}]},dialogFormVisible:!1,loginLoading:!1,registerLoading:!1}},methods:{submitForm:function(e){var r=this;r.$refs[e].validate(function(o){if(!o)return console.log("error submit!!"),!1;if("loginForm"==e)r.loginLoading=!0,r.$axios.get("/api/libraries/login",{params:r.loginForm}).then(function(e){r.loginLoading=!1,e.data.data?(localStorage.setItem("username",r.loginForm.phone),localStorage.setItem("libraryId",e.data.data.id),r.$router.push("/home")):r.$message.error("用户名或密码错误")}).catch(function(e){r.loginLoading=!1,r.$message.error("服务器错误")});else if("registerForm"==e){r.registerLoading=!0;var i={name:r.registerForm.name,phone:r.registerForm.phone,location:r.registerForm.address,description:r.registerForm.description,admin_name:r.registerForm.manager,admin_phone:r.registerForm.managerPhone,admin_password:r.registerForm.password};r.$axios.post("/api/libraries",i).then(function(e){r.registerLoading=!1,e.data.data?(r.dialogFormVisible=!1,r.$message("注册成功")):r.$message.error("注册失败")}).catch(function(e){r.loginLoading=!1,r.$message.error("服务器错误")})}})}}}},165:function(e,r,o){r=e.exports=o(10)(void 0),r.push([e.i,".login-wrap[data-v-cb0261fc]{position:relative;width:100%;height:100%;background:#324157}.ms-title[data-v-cb0261fc]{position:absolute;top:50%;width:100%;margin-top:-230px;text-align:center;font-size:30px;color:#fff}.ms-login[data-v-cb0261fc]{position:absolute;left:50%;top:50%;width:300px;height:160px;margin:-150px 0 0 -190px;padding:40px;border-radius:5px;background:#fff}.login-btn[data-v-cb0261fc]{text-align:center}.login-btn button[data-v-cb0261fc]{width:100%;height:36px}",""])},174:function(e,r){e.exports={render:function(){var e=this,r=e.$createElement,o=e._self._c||r;return o("div",{staticClass:"login-wrap"},[o("div",{staticClass:"ms-title"},[e._v("图书馆后台管理系统")]),e._v(" "),o("div",{staticClass:"ms-login"},[o("el-form",{ref:"loginForm",attrs:{model:e.loginForm,rules:e.loginRules,"label-width":"0px"}},[o("el-form-item",{attrs:{prop:"phone"}},[o("el-input",{attrs:{placeholder:"手机号"},model:{value:e.loginForm.phone,callback:function(r){e.loginForm.phone=r},expression:"loginForm.phone"}})],1),e._v(" "),o("el-form-item",{attrs:{prop:"password"}},[o("el-input",{attrs:{type:"password",placeholder:"密码"},nativeOn:{keyup:function(r){if(!("button"in r)&&e._k(r.keyCode,"enter",13))return null;e.submitForm("loginForm")}},model:{value:e.loginForm.password,callback:function(r){e.loginForm.password=r},expression:"loginForm.password"}})],1),e._v(" "),o("div",{staticClass:"login-btn"},[o("el-button",{attrs:{type:"primary",loading:e.loginLoading},on:{click:function(r){e.submitForm("loginForm")}}},[e._v("登录")])],1),e._v(" "),o("div",{staticClass:"login-btn"},[o("el-button",{attrs:{type:"text"},on:{click:function(r){e.dialogFormVisible=!0}}},[e._v("注册")])],1)],1)],1),e._v(" "),o("el-dialog",{attrs:{title:"注册",visible:e.dialogFormVisible},on:{"update:visible":function(r){e.dialogFormVisible=r}}},[o("el-form",{ref:"registerForm",attrs:{rules:e.registerRules,"label-width":"120px","label-position":"left",model:e.registerForm}},[o("el-form-item",{attrs:{label:"负责人手机号",prop:"managerPhone"}},[o("el-input",{attrs:{placeholder:"负责人手机号将作为登录账号"},model:{value:e.registerForm.managerPhone,callback:function(r){e.registerForm.managerPhone=r},expression:"registerForm.managerPhone"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"负责人姓名",prop:"manager"}},[o("el-input",{model:{value:e.registerForm.manager,callback:function(r){e.registerForm.manager=r},expression:"registerForm.manager"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"密码",prop:"password"}},[o("el-input",{attrs:{type:"password","auto-complete":"off"},model:{value:e.registerForm.password,callback:function(r){e.registerForm.password=r},expression:"registerForm.password"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"确认密码",prop:"confirmPassword"}},[o("el-input",{attrs:{type:"password","auto-complete":"off"},model:{value:e.registerForm.confirmPassword,callback:function(r){e.registerForm.confirmPassword=r},expression:"registerForm.confirmPassword"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"图书馆名称",prop:"name"}},[o("el-input",{model:{value:e.registerForm.name,callback:function(r){e.registerForm.name=r},expression:"registerForm.name"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"图书馆地址",prop:"address"}},[o("el-input",{model:{value:e.registerForm.address,callback:function(r){e.registerForm.address=r},expression:"registerForm.address"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"图书馆电话",prop:"phone"}},[o("el-input",{model:{value:e.registerForm.phone,callback:function(r){e.registerForm.phone=r},expression:"registerForm.phone"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"图书馆描述",prop:"description"}},[o("el-input",{attrs:{type:"textarea"},model:{value:e.registerForm.description,callback:function(r){e.registerForm.description=r},expression:"registerForm.description"}})],1)],1),e._v(" "),o("div",{staticClass:"dialog-footer",slot:"footer"},[o("el-button",{on:{click:function(r){e.dialogFormVisible=!1}}},[e._v("取 消")]),e._v(" "),o("el-button",{attrs:{type:"primary",loading:e.registerLoading},on:{click:function(r){e.submitForm("registerForm")}}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]}},179:function(e,r,o){var i=o(165);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);o(39)("e9336ae2",i,!0)}});
//# sourceMappingURL=3.js.map?1229fa779bc9ec8c534a