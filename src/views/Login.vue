<template>
    <div class="login-wrap">
        <div class="ms-title">图书馆后台管理系统</div>
        <div class="ms-login">
            <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px">
                <el-form-item prop="phone">
                    <el-input v-model="loginForm.phone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="loginForm.password" @keyup.enter.native="submitForm('loginForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" :loading="loginLoading" @click="submitForm('loginForm')">登录</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="text" @click="dialogFormVisible=true">注册</el-button>
                </div>
            </el-form>
        </div>
        <el-dialog title="注册" :visible.sync="dialogFormVisible">
            <el-form :rules="registerRules" label-width="120px" label-position="left" :model="registerForm" ref="registerForm">
                <el-form-item label="负责人手机号" prop="admin_phone">
                    <el-input placeholder="负责人手机号将作为登录账号" v-model="registerForm.admin_phone"></el-input>
                </el-form-item>
                <el-form-item label="负责人姓名" prop="admin_name">
                    <el-input v-model="registerForm.admin_name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="admin_password">
                    <el-input type="password" v-model="registerForm.admin_password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model="registerForm.confirmPassword" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图书馆名称" prop="name">
                    <el-input v-model="registerForm.name"></el-input>
                </el-form-item>
                <el-form-item label="图书馆地址" prop="location">
                    <el-input v-model="registerForm.location"></el-input>
                </el-form-item>
                <el-form-item label="图书馆电话" prop="phone">
                    <el-input v-model="registerForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="图书馆描述" prop="description">
                    <el-input type="textarea" v-model="registerForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button style="float: left;" @click="resetForm('registerForm')">重 置</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" :loading="registerLoading" @click="submitForm('registerForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { requiredValidator } from '../utils/validate.js'

export default {
    data: function() {
        return {
            loginForm: {
                phone: '',
                password: ''
            },
            loginRules: {
                phone: [requiredValidator('请输入用户名')],
                password: [requiredValidator('请输入密码')]
            },

            registerForm: {
                manager: '',
                managerPhone: '',
                password: '',
                confirmPassword: '',
                name: '',
                address: '',
                telephone: '',
                description: ''
            },
            registerRules: {
                admin_name: [requiredValidator('请输入负责人姓名')],
                admin_phone: [requiredValidator('请输入负责人手机号')],
                name: [requiredValidator('请输入图书馆名称')],
                location: [requiredValidator('请输入图书馆地址')],
                phone: [requiredValidator('请输入图书馆电话')],
                description: [requiredValidator('请输入图书馆描述')],
                admin_password: [requiredValidator('请输入密码'), {
                    validator: (rule, value, callback) => {
                        if (this.registerForm.confirmPassword !== '') {
                            this.$refs.registerForm.validateField('confirmPassword');
                        }
                        callback();
                    }
                }],
                confirmPassword: [requiredValidator('请再次输入密码'), {
                    validator: (rule, value, callback) => {
                        if (value !== this.registerForm.admin_password) {
                            callback(new Error('两次输入密码不一致!'));
                        } else {
                            callback();
                        }
                    }
                }],
            },

            dialogFormVisible: false,
            loginLoading: false,
            registerLoading: false
        }
    },
    methods: {
        resetForm(form) {
            this.$refs[form].resetFields()
        },
        submitForm(formName) {
            const self = this;
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    if (formName == 'loginForm') {
                        this.login();
                    } else if (formName == 'registerForm') {
                        this.register();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        login() {
            const self = this;
            self.loginLoading = true;
            self.$axios.get("/api/libraries/login", {
                params: self.loginForm
            }).then((res) => {
                self.loginLoading = false;
                if (!res.data.data) {
                    self.$message.error("用户名或密码错误");
                } else {
                    //登录状态15天后过期
                    let expireDays = 1000 * 60 * 60 * 24 * 15;
                    this.setCookie('id', res.data.data.id, expireDays);
                    self.$store.commit('userInfo', res.data.data);
                    self.$router.push('/home');
                }
            }).catch(_ => {
                self.loginLoading = false;
                self.$message.error("服务器错误")
            })
        },
        register() {
            const self = this;
            self.registerLoading = true;
            self.$axios.post("/api/libraries", self.registerForm).then(res => {
                self.registerLoading = false;
                if (res.data.data) {
                    self.dialogFormVisible = false;
                    self.$message("注册成功");
                } else {
                    self.$message.error("注册失败：" + res.data.errmsg);
                }
            }).catch(_ => {
                self.loginLoading = false;
                self.$message.error("服务器错误")
            })
        }
    }
}
</script>
<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background: #324157;
}

.ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 160px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
}
</style>