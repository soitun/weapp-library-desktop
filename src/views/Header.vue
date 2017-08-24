<template>
    <div>
        <div class="wrap">
            <el-menu class="header" theme="dark" :default-active="onRoutes" mode="horizontal" router>
                <div class="logo">图书馆后台管理系统</div>
                <el-menu-item index="home">个人中心</el-menu-item>
                <el-menu-item index="chart">数据统计</el-menu-item>
                <el-menu-item index="collection">馆藏管理</el-menu-item>
                <el-menu-item index="order">订单管理</el-menu-item>
                <div class="header-action">
                    <screenfull class='screenfull'></screenfull>
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                    欢迎你，{{username}} 
                    <i class="el-icon-setting" style="margin-left: 5px"></i>
                </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="changepassword">修改密码</el-dropdown-item>
                            <el-dropdown-item command="loginout" divided>退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-menu>
        </div>
        <el-dialog title="修改密码" :visible.sync="dialogVisible" @close="resetForm">
            <el-form :rules="passwordRules" label-width="120px" label-position="left" :model="passwordForm" ref="passwordForm">
                <el-form-item label="原密码" prop="password">
                    <el-input type="password" v-model="passwordForm.password" placeholder="请输入原密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="passwordForm.newPassword" auto-complete="off" placeholder="长度6~25位"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword">
                    <el-input type="password" v-model="passwordForm.confirmPassword" auto-complete="off" placeholder="请确认新密码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button style="float: left;" @click="resetForm()">重 置</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="loading" @click="submitForm('passwordForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import screenfull from '../components/Screenfull.vue';
import { changePassword } from '../api/index.js';
export default {
    components: {
        screenfull
    },
    data() {
        return {
            passwordForm: {
                password: '',
                newPassword: "",
                confirmPassword: ""
            },
            passwordRules: {
                password: {
                    required: true,
                    message: '请输入原密码',
                    trigger: 'blur'
                },
                newPassword: [{
                    required: true,
                    message: '请输入新密码，长度6~25位',
                    min: 6,
                    max: 25,
                    trigger: 'blur'
                }, {
                    validator: (rule, value, callback) => {
                        if (value.length < 6)
                            callback(new Error("密码长度不得小于6位"));

                        if (this.passwordForm.confirmPassword !== '') {
                            this.$refs.passwordForm.validateField('confirmPassword');
                        }
                        callback();
                    }
                }],
                confirmPassword: [{
                    required: true,
                    message: '请再次输入新密码',
                    trigger: 'blur'
                }, {
                    validator: (rule, value, callback) => {
                        if (value !== this.passwordForm.newPassword) {
                            callback(new Error('两次输入密码不一致'));
                        } else {
                            callback();
                        }
                    }
                }]
            },

            dialogVisible: false,
            loading: false
        }
    },
    computed: {
        username() {
            let username = this.$store.state.userInfo.admin_name;
            return username ? username : "管理员";
        },
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    methods: {
        resetForm() {
            this.$refs['passwordForm'].resetFields()
        },
        handleCommand(command) {
            if (command == 'loginout') {
                this.$store.dispatch('LOG_OUT').then(() => {
                    this.$router.push('/login');
                })
            }
            if (command == 'changepassword') {
                this.dialogVisible = true;
            }
        },
        submitForm(formName) {
            const self = this;
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    if (formName == 'passwordForm') {
                        self.loading = true;
                        self.passwordForm.adminPhone = this.$store.getters.adminPhone;
                        changePassword(self.passwordForm).then(res => {
                            self.$message.success("修改密码成功");
                            self.dialogVisible = false;
                        }).finally(_ => self.loading = false)
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
.wrap {
    z-index: 999;
    box-sizing: border-box;
    position: relative;
    padding: 0 35px;
    width: 100%;
    height: 100%;
    background-color: #324157;
}

.header {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    font-size: 22px;
    color: #fff;
}

.header .logo {
    float: left;
    margin-right: 50px;
    line-height: 60px;
}

.header-action {
    position: absolute;
    right: 0;
    line-height: 60px;
}

.header-action .screenfull {
    margin-right: 10px;
}

.header-action .el-dropdown,
.header-action .login-link {
    display: inline-block;
    vertical-align: top;
}

.header-action .el-dropdown-link {
    color: #fff;
    cursor: pointer;
}

.header-action .login-link {
    font-size: 14px;
}
</style>