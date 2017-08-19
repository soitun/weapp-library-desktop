<template>
    <el-row>
        <el-col :span="16">
            <div class="chart">
                <div class="content-title">近期借阅统计</div>
                <chart ref="chart" :options="schema"></chart>
            </div>
        </el-col>
        <el-col :span="8">
            <div class="panel">
                <div class="content-title">图书馆信息</div>
                <div class="card">
                    <div class="fragment">
                        <div>
                            <div>图书馆名称：</div>{{libraryData.name}}</div>
                        <div>
                            <div>图书馆地址：</div>{{libraryData.location}}</div>
                        <div>
                            <div>图书馆电话：</div>{{libraryData.phone}}</div>
                        <div>
                            <div>图书馆描述：</div>{{libraryData.description}}</div>
                        <div>
                            <div>管理员姓名：</div>{{libraryData.admin_name}}</div>
                        <div>
                            <div>管理员手机号：</div>{{libraryData.admin_phone}}</div>
                    </div>
                    <div class="fragment">
                        <div>
                            <div>图书种类数：</div>{{libraryData.book_kind_number}}</div>
                        <div>
                            <div>图书馆馆藏：</div>{{libraryData.book_total_number}}</div>
                        <div>历史借阅总次数：{{libraryData.order_total_number}}</div>
                    </div>
                    <div class="fragment">
                        <el-button type="default" @click="dialogVisible=true">修改图书馆资料</el-button>
                    </div>
                </div>
            </div>
        </el-col>
        <el-dialog title="修改图书馆资料" :visible.sync="dialogVisible" @close="reset">
            <el-form :model="formData" :rules="rules" ref="form" label-width="120px" label-position="left">
                <el-form-item :disabled="$store.getters.state==1" label="图书馆名称：" prop="name">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="图书馆地址：" prop="location">
                    <el-input v-model="formData.location"></el-input>
                </el-form-item>
                <el-form-item label="图书馆电话：" prop="phone">
                    <el-input v-model="formData.phone"></el-input>
                </el-form-item>
                <el-form-item label="图书馆描述：" prop="description">
                    <el-input type="textarea" :rows="5" v-model="formData.description"></el-input>
                </el-form-item>
                <el-form-item label="管理员姓名：" prop="admin_name">
                    <el-input v-model="formData.admin_name"></el-input>
                </el-form-item>
                <el-form-item label="管理员手机号：">
                    <el-input disabled v-model="formData.admin_phone"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div class="fragment">
                    <el-button type="primary" @click="submitForm()" :loading="loading">提 交</el-button>
                    <el-button type="default" @click="dialogVisible =false">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </el-row>
</template>
<script>
import { requiredValidator, integerValidator, phoneValidator } from '../utils/validate.js'
import { updateUserInfoById } from '../api/index.js';

// 图表横坐标：最近7天的日期
var date = [];
var now = new Date().getTime();
for (let i = 0; i < 7; i++) {
    let time = new Date(now - i * 24 * 3600 * 1000);
    date.unshift([time.getFullYear(), time.getMonth() + 1, time.getDate()].join('/'));
}

export default {
    data: () => {
        return {
            dialogVisible: false,
            loading: false,
            formData: {}, // 图书馆信息表单数据

            rules: {
                admin_name: [requiredValidator('请输入负责人姓名')],
                name: [requiredValidator('请输入图书馆名称')],
                location: [requiredValidator('请输入图书馆地址')],
                phone: [requiredValidator('请输入图书馆电话')],
                description: [requiredValidator('请输入图书馆描述')]
            },

            // 图表配置
            schema: {
                tooltip: {
                    trigger: 'axis'
                },
                //图例配置
                legend: {
                    top: '20%',
                    y: "bottom"
                },
                // 工具箱配置
                toolbox: {
                    show: true,
                    formatter: function(params) {
                        params = params[0];
                        var date = new Date(params.name);
                        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                    },
                    right: 25,
                    feature: {
                        saveAsImage: {
                            name: "近七日借阅统计"
                        }
                    }
                },
                calculable: true,
                //x轴配置
                xAxis: [{
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    axisTick: {
                        alignWithLabel: true,
                        inside: true,
                        interval: 1
                    },
                    boundaryGap: false,
                    data: date,
                    name: "日期" // ** x轴配置:name
                }],
                // Y轴配置
                yAxis: [{
                    type: 'value',
                    name: "借书量/本"
                }],
                color: [
                    '#20A0FF'
                ]
            }
        }
    },
    computed: {
        libraryId() {
            return this.$store.state.userInfo.id;
        },
        libraryData() {
            return this.$store.state.userInfo;
        },
    },
    mounted() {
        this.formData = Object.assign({}, this.libraryData);
        this.$refs.chart.mergeOptions({
            series: [{
                name: "借书量",
                type: 'line',
                data: this.libraryData.recent_lending_records,
                smooth: true
            }]
        });
    },
    methods: {
        reset() {
            this.$refs.form.resetFields();
        },
        submitForm() {
            const self = this;
            self.$refs.form.validate((valid) => {
                if (valid) {
                    self.loading = true;
                    self.$store.dispatch('UPDATE_USER_INFO', self.formData).then(() => {
                        self.loading = false;
                        self.dialogVisible = false;
                        self.$message("修改成功");
                    });
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
.content-title {
    font-size: 22px;
}

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

.card .el-form-item.is-error {
    margin-bottom: 20px;
}

.fragment {
    padding: 20px;
    border-top: 1px solid #d1dbe5;
}

.fragment:first-child {
    border-top: 0
}

.fragment>div {
    margin-bottom: 16px;
}

.fragment>div>div {
    width: 100px;
    display: inline-block;
}

.fragment>div:last-child {
    margin-bottom: 0;
}
</style>