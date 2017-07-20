<template>
    <el-row class='content'>
        <el-col :span="16">
            <my-chart :xaxis="xaxis" :yaxis="yaxis"></my-chart>
        </el-col>
        <el-col :span="8">
            <div class="panel" v-loading="libraryLoading">
                <div class="content-title">图书馆信息</div>
                <div class="card">
                    <el-form v-if="editing" :model="libraryFormData" :rules="libraryRules" ref="libraryForm" style="padding: 12px 20px" label-width="110px" label-position="left">
                        <el-form-item label="图书馆名称：" prop="name">
                            <el-input v-model="libraryFormData.name" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="图书馆地址：" prop="location">
                            <el-input v-model="libraryFormData.location" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="图书馆电话：" prop="phone">
                            <el-input v-model="libraryFormData.phone" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="图书馆描述：" prop="description">
                            <el-input v-model="libraryFormData.description" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="负责人：" prop="admin_name">
                            <el-input v-model="libraryFormData.admin_name" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话：" prop="admin_phone">
                            <el-input v-model="libraryFormData.admin_phone" size="small"></el-input>
                        </el-form-item>
                    </el-form>
                    <div v-else class="fragment">
                        <div>
                            <div>图书馆名称：</div>{{libraryData.name}}</div>
                        <div>
                            <div>图书馆地址：</div>{{libraryData.location}}</div>
                        <div>
                            <div>图书馆电话：</div>{{libraryData.phone}}</div>
                        <div>
                            <div>图书馆描述：</div>{{libraryData.description}}</div>
                        <div>
                            <div>负责人：</div>{{libraryData.admin_name}}</div>
                        <div>
                            <div>联系电话：</div>{{libraryData.admin_phone}}</div>
                    </div>
                    <div class="fragment">
                        <div>
                            <div>图书种类数：</div>{{libraryData.book_kind_number}}</div>
                        <div>
                            <div>图书馆馆藏：</div>{{libraryData.book_total_number}}</div>
                        <div>历史借阅总次数：{{libraryData.order_total_number}}</div>
                    </div>
                    <div v-if="editing" class="fragment">
                        <el-button type="primary" @click="submitForm('libraryForm')">提 交</el-button>
                        <el-button type="default" @click="handleCancel">取 消</el-button>
                    </div>
                    <div v-else class="fragment">
                        <el-button type="default" @click="editing=true">修改图书馆资料</el-button>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import myChart from './Chart.vue';

// 横坐标：最近7天的日期；纵坐标：模拟借书量
var date = [];
var now = new Date().getTime();
for (let i = 0; i < 7; i++) {
    let time = new Date(now - i * 24 * 3600 * 1000);
    date.unshift([time.getFullYear(), time.getMonth() + 1, time.getDate()].join('/'));
}

var validator = (rule, value, callback) => {
    if (isNaN(value)) {
        callback(new Error('请输入一个整数'));
    } else {
        callback();
    }
}

export default {
    data: () => {
        return {
            xaxis: date,
            yaxis: [],
            libraryData: {},
            libraryFormData: {},

            libraryLoading: true,
            editing: false,

            libraryRules: {
                admin_name: [{
                    required: true,
                    message: '请输入负责人姓名',
                    trigger: 'blur'
                }],
                admin_phone: [{
                    required: true,
                    message: '请输入负责人手机号',
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '请输入图书馆名称',
                    trigger: 'blur'
                }],
                location: [{
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
            }
        }
    },
    computed: {
        libraryId() {
            return this.$store.state.userInfo.id;
        }
    },
    created: function() {
        let self = this;
        self.$axios.get('/api/libraries/' + this.libraryId).then(res => {
            self.libraryLoading = false;
            if (res.data.code == 200) {
                self.libraryData = res.data.data;
                self.yaxis = res.data.data.recent_lending_records;
                self.libraryFormData = Object.assign({}, res.data.data);
            } else {
                self.$message.error("获取图书馆信息失败，请刷新页面重试")
            }
        }).catch(_ => {
            self.libraryLoading = false;
            self.$message.error("服务器错误")
        })
    },
    methods: {
        handleCancel() {
            this.editing = false;
            this.libraryFormData = Object.assign({}, this.libraryData);
        },
        submitForm(formName) {
            const self = this;
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    if (formName == 'libraryForm') {
                        self.submitLibraryForm();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        submitLibraryForm() {
            const self = this;
            self.libraryLoading = true;
            let params = {
                name: self.libraryFormData.name,
                location: self.libraryFormData.location,
                phone: self.libraryFormData.phone,
                description: self.libraryFormData.description,
                admin_name: self.libraryFormData.admin_name,
                admin_phone: self.libraryFormData.admin_phone,
            }
            self.$axios.post('/api/libraries/' + this.libraryId, params).then(res => {
                self.libraryLoading = false;
                if (res.data.code == 200) {
                    self.dialogFormVisible = false;
                    self.$message("修改成功");
                    self.editing = false;
                    self.libraryData = Object.assign({}, self.libraryFormData);
                } else {
                    self.$message.error("修改失败");
                }
            }).catch(_ => {
                self.libraryLoading = false;
                self.$message.error("服务器错误")
            })
        }
    },
    components: {
        myChart
    }
}
</script>
<style scoped>
.card {
    margin-top: 20px;
    font-size: 14px;
    color: #48576a;
    border: 1px solid #d1dbe5;
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
}

.card .el-form-item {
    margin-bottom: 0;
}

.fragment {
    padding: 20px;
    border-top: 1px solid #d1dbe5;
}

.fragment:first-child {
    border-top: 0
}

.fragment > div {
    margin-bottom: 16px;
}

.fragment > div > div {
    width: 100px;
    display: inline-block;
}

.fragment > div:last-child {
    margin-bottom: 0;
}
</style>
