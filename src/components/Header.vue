<template>
    <el-menu class="header" theme="dark" :default-active="onRoutes" mode="horizontal" router>
        <div class="logo">图书馆后台管理系统</div>
        <el-menu-item index="home">个人中心</el-menu-item>
        <el-menu-item index="collection">馆藏管理</el-menu-item>
        <el-menu-item index="order">订单管理</el-menu-item>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    欢迎你，{{username}} 
                    <i class="el-icon-setting" style="margin-left: 5px"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </el-menu>
</template>
<script>
export default {
    data() {
            return {
                name: 'zkh'
            }
        },
        computed: {
            username() {
                let username = this.$store.state.userInfo.admin_name;
                return username ? username : this.name;
            },
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        methods: {
            handleCommand(command) {
                if (command == 'loginout') {
                    this.deleteCookie('session');
                    this.$router.push('/login');
                }
            }
        }
}
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    font-size: 22px;
    line-height: 60px;
    color: #fff;
}

.header .logo {
    float: left;
    width: 250px;
    text-align: center;
}

.user-info {
    float: right;
    height: 60px;
    padding-right: 50px;
    color: #fff;
}

.user-info .el-dropdown {
    display: block;
}

.user-info .el-dropdown-link {
    position: relative;
    padding-left: 50px;
    height: 60px;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
}

.el-dropdown-menu__item {
    text-align: center;
}

.el-menu-item.is-active {
    border-bottom: 5px solid #20a0ff;
}
</style>
