<template>
    <div class="login-wrap">
        <div id="particles-js"></div>
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
                    <el-button type="text" @click="registerDialogVisible=true">注册</el-button>
                </div>
            </el-form>
        </div>
        <el-dialog title="注册" :visible.sync="registerDialogVisible">
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
                <!-- <el-form-item label="图书馆地址" prop="area">
                    <area-select :level="3" type="text" v-model="registerForm.area"></area-select>
                </el-form-item> -->
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
                <el-button @click="registerDialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="registerLoading" @click="submitForm('registerForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import 'particles.js/particles';
const particlesJS = window.particlesJS;
import { requiredValidator, phoneValidator } from '../utils/validate.js'
import { register } from '../api/index.js';

export default {
    data: function() {
        return {
            // login
            loginForm: {
                phone: '',
                password: ''
            },
            loginRules: {
                phone: [requiredValidator('请输入用户名')],
                password: [requiredValidator('请输入密码')]
            },
            loginLoading: false,

            // register
            registerForm: {
                manager: '',
                managerPhone: '',
                password: '',
                confirmPassword: '',
                name: '',
                area: [],
                address: '',
                telephone: '',
                description: ''
            },
            registerRules: {
                admin_name: [requiredValidator('请输入负责人姓名')],
                admin_phone: [requiredValidator('请输入负责人手机号'), { validator: phoneValidator }],
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
            registerDialogVisible: false,
            registerLoading: false,

            // particles
            particlesCfg: {
                "particles": {
                    "number": {
                        "value": 88,
                        "density": {
                            "enable": true,
                            "value_area": 700
                        }
                    },
                    "color": {
                        "value": ["#aa73ff", "#f8c210", "#83d238", "#33b1f8"]
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 15
                        }
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1.5,
                            "opacity_min": 0.15,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 2.5,
                        "random": false,
                        "anim": {
                            "enable": true,
                            "speed": 2,
                            "size_min": 0.15,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 110,
                        "color": "#33b1f8",
                        "opacity": 0.25,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 1.6,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": false,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": false,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 100,
                            "line_linked": {
                                "opacity": 0.8
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            }
        }
    },
    mounted() {
        particlesJS("particles-js", this.particlesCfg);
    },
    methods: {
        resetForm(form) {
            this.$refs[form].resetFields()
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (formName == 'loginForm') {
                        this.loginLoading = true;
                        this.$store.dispatch('LOGIN', this.loginForm).then(() => {
                            this.$message.success("登录成功");
                            this.$router.push({ path: '/home' });
                        }).finally(() => {
                            this.loginLoading = false;
                        })
                    } else if (formName == 'registerForm') {
                        this.registerLoading = true;
                        register(this.registerForm).then(() => {
                            this.registerDialogVisible = false;
                            this.$message("注册成功");
                        }).finally(() => {
                            this.registerLoading = false;
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    }
}
</script>
<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
}

canvas {
    display: block;
    vertical-align: bottom;
}

#particles-js {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #323840;
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
<style>
.area-select .el-select {
    width: 30%;
    min-width: 100px;
    margin-left: 10px;
}

.area-select .el-select:first-child {
    margin-left: 0;
}
</style>