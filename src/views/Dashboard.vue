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
                        <el-form-item label="联系电话">
                            <el-input disabled v-model="libraryFormData.admin_phone" size="small"></el-input>
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
import { requiredValidator, integerValidator, phoneValidator } from '../utils/validate.js'

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

            editing: false, // 是否编辑图书馆信息
            libraryFormData: {}, // 图书馆信息表单数据

            libraryRules: {
                admin_name: [requiredValidator('请输入负责人姓名')],
                name: [requiredValidator('请输入图书馆名称')],
                location: [requiredValidator('请输入图书馆地址')],
                phone: [requiredValidator('请输入图书馆电话'), { validator: phoneValidator }],
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
        this.libraryFormData = Object.assign({}, this.libraryData);
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
            self.$axios.post('/api/libraries/' + self.libraryId, self.libraryFormData).then(res => {
                self.libraryLoading = false;
                if (res.data.code == 200) {
                    self.dialogFormVisible = false;
                    self.$message("修改成功");
                    self.editing = false;
                    self.$store.commit('SET_USER_INFO', self.libraryFormData);
                } else {
                    self.$message.error("修改失败");
                }
            }).catch(_ => {
                self.libraryLoading = false;
                self.$message.error("服务器错误")
            })
        }
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