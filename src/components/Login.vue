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
                <el-form-item label="负责人手机号" prop="managerPhone">
                    <el-input placeholder="负责人手机号将作为登录账号" v-model="registerForm.managerPhone"></el-input>
                </el-form-item>
                <el-form-item label="负责人姓名" prop="manager">
                    <el-input v-model="registerForm.manager"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="registerForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model="registerForm.confirmPassword" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图书馆名称" prop="name">
                    <el-input v-model="registerForm.name"></el-input>
                </el-form-item>
                <el-form-item label="图书馆地址" prop="address">
                    <el-input v-model="registerForm.address"></el-input>
                </el-form-item>
                <el-form-item label="图书馆电话" prop="phone">
                    <el-input v-model="registerForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="图书馆描述" prop="description">
                    <el-input type="textarea" v-model="registerForm.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" :loading="registerLoading" @click="submitForm('registerForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            loginForm: {
                phone: '',
                password: ''
            },
            loginRules: {
                phone: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }]
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
                manager: [{
                    required: true,
                    message: '请输入负责人姓名',
                    trigger: 'blur'
                }],
                managerPhone: [{
                    required: true,
                    message: '请输入负责人手机号',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }, {
                    validator: (rule, value, callback) => {
                        if (this.registerForm.confirmPassword !== '') {
                            this.$refs.registerForm.validateField('confirmPassword');
                        }
                        callback();
                    }
                }],
                confirmPassword: [{
                    required: true,
                    message: '请再次输入密码',
                    trigger: 'blur'
                }, {
                    validator: (rule, value, callback) => {
                        if (value !== this.registerForm.password) {
                            callback(new Error('两次输入密码不一致!'));
                        } else {
                            callback();
                        }
                    }
                }],
                name: [{
                    required: true,
                    message: '请输入图书馆名称',
                    trigger: 'blur'
                }],
                address: [{
                    required: true,
                    message: '请输入图书馆地址',
                    trigger: 'blur'
                }],
                phone: [{
                    required: true,
                    message: '请输入图书馆电话',
                    trigger: 'blur'
                }],
                description: [{
                    required: true,
                    message: '请输入图书馆描述',
                    trigger: 'blur'
                }]
            },
            dialogFormVisible: false,
            loginLoading: false,
            registerLoading: false
        }
    },
    methods: {
        submitForm(formName) {
            const self = this;
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    if (formName == 'loginForm') {
                        self.loginLoading = true;
                        self.$axios.get("/api/libraries/login", {
                            params: self.loginForm
                        }).then((res) => {
                            self.loginLoading = false;
                            if (!res.data.data) {
                                self.$message.error("用户名或密码错误");
                            } else {
                                localStorage.setItem('username', self.loginForm.phone);
                                localStorage.setItem('libraryId', res.data.data.id);
                                self.$router.push('/home');
                            }
                        }).catch(_ => {
                            self.loginLoading = false;
                            self.$message.error("服务器错误")
                        })
                    } else if (formName == 'registerForm') {
                        self.registerLoading = true;
                        let params = {
                            name: self.registerForm.name,
                            phone: self.registerForm.phone,
                            location: self.registerForm.address,
                            description: self.registerForm.description,
                            admin_name: self.registerForm.manager,
                            admin_phone: self.registerForm.managerPhone,
                            admin_password: self.registerForm.password
                        };
                        self.$axios.post("/api/libraries", params).then(res => {
                            self.registerLoading = false;
                            if (res.data.data) {
                                self.dialogFormVisible = false;
                                self.$message("注册成功");
                            } else {
                                self.$message.error("注册失败");
                            }
                        }).catch(_ => {
                            self.loginLoading = false;
                            self.$message.error("服务器错误")
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
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
