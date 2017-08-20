<template>
    <el-row>
        <el-col :span="14">
            <div class="content-title">近期借阅统计</div>
            <el-card>
                <div id="orderChart"></div>
            </el-card>
            <el-row>
                <el-col :span="24" :lg="12">
                    <el-card>
                        <div id="pastRankChart"></div>
                    </el-card>
                </el-col>
                <el-col :span="24" :lg="12">
                    <el-card>
                        <div id="recentRankChart"></div>
                    </el-card>
                </el-col>
                <el-col v-if="libraryData.qualification_image_urls && libraryData.qualification_image_urls.length" :span="24">
                    <el-card>
                        <div class="fragment-title">资质证明文件</div>
                        <el-carousel :interval="4000" type="card" height="200px">
                            <el-carousel-item v-for="item in libraryData.qualification_image_urls" :key="item">
                                <img :src="item" style="max-height: 200px" @click="handlePictureCardPreview({url: item})">
                            </el-carousel-item>
                        </el-carousel>
                    </el-card>
                </el-col>
            </el-row>
        </el-col>
        <el-col :span="10" class="library-info">
            <div class="content-title">图书馆信息</div>
            <el-card>
                <el-form class="fragment" label-position="left" label-width="100px">
                    <el-form-item label="图书馆名称：">
                        {{libraryData.name}}
                    </el-form-item>
                    <el-form-item label="图书馆地址：">
                        {{libraryData.location}}
                    </el-form-item>
                    <el-form-item label="图书馆电话：">
                        {{libraryData.phone}}
                    </el-form-item>
                    <el-form-item label="图书馆描述：">
                        {{libraryData.description}}
                    </el-form-item>
                    <el-form-item label="管理员姓名：">
                        {{libraryData.admin_name}}
                    </el-form-item>
                    <el-form-item label="管理员手机号：" label-width="110px">
                        {{libraryData.admin_phone}}
                    </el-form-item>
                    <el-form-item label="认证状态：">
                        <el-tooltip placement="top">
                            <div slot="content" style="max-width: 250px;">
                                <template v-if="libraryData.state == 0">您的账号正在审核中，您可提供更详细的信息以完成认证，认证通过后您的账号将拥有认证标志，并且其他图书馆将不能使用和你相同的名称</template>
                                <template v-else-if="libraryData.state == 1">您的账号已通过认证，拥有认证标志与唯一名称</template>
                                <template v-else-if="libraryData.state == 2">您的账号未通过审核，原因是：{{libraryData.reason}}。您可提供更详细的信息以完成认证，认证通过后您的账号将拥有认证标志，并且其他图书馆将不能使用和你相同的名称</template>
                            </div>
                            <el-tag v-if="libraryData.state == 0" type="warning">审核中</el-tag>
                            <el-tag v-else-if="libraryData.state == 1" type="success">已认证</el-tag>
                            <el-tag v-else-if="libraryData.state == 2" type="danger">未通过</el-tag>
                        </el-tooltip>
                    </el-form-item>
                </el-form>
                <el-form class="fragment" label-position="left">
                    <el-form-item label="图书种类数：">
                        {{libraryData.book_kind_number}}
                    </el-form-item>
                    <el-form-item label="图书馆馆藏：">
                        {{libraryData.book_total_number}}
                    </el-form-item>
                    <el-form-item label="历史借阅总次数：">
                        {{libraryData.order_total_number}}
                    </el-form-item>
                </el-form>
                <div v-if="libraryData.image_urls && libraryData.image_urls.length" class="fragment">
                    <div class="fragment-title">图书馆照片</div>
                    <el-carousel :autoplay="false" type="card" height="200px">
                        <el-carousel-item v-for="item in libraryData.image_urls" :key="item">
                            <img :src="item" style="max-height: 200px" @click="handlePictureCardPreview({url: item})">
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="fragment">
                    <el-button type="default" @click="dialogVisible=true">修改图书馆资料</el-button>
                </div>
            </el-card>
        </el-col>
        <el-dialog title="修改图书馆资料" :visible.sync="dialogVisible" size="full" @open="reset">
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
                <el-form-item label="图书馆照片">
                    <el-upload action="/api/libraries/upload" name="picture" :file-list="imageList" list-type="picture-card" accept="image/jpeg, image/jpg, image/png" :on-preview="handlePictureCardPreview" :before-upload="beforePictureUpload" :on-change="handlePictureChange" :on-remove="handlePictureChange" :httpRequest="httpRequest">
                        <div slot="tip" class="el-upload__tip">最多上传9张照片，每张照片不超过2MB</div>
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="资质证明文件">
                    <el-upload v-if="libraryData.state != 1" action="/api/libraries/upload" name="picture" :file-list="qualificationImageList" list-type="picture-card" accept="image/jpeg, image/jpg, image/png" :on-preview="handlePictureCardPreview" :before-upload="beforePictureUpload2" :on-change="handlePictureChange2" :on-remove="handlePictureChange2" :httpRequest="httpRequest">
                        <div slot="tip" class="el-upload__tip">资质证明文件包括：图书馆经营许可证、法人身份证件等；最多上传9张照片，每张照片不超过2MB</div>
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <div v-else>您已完成认证，无法修改认证资料。如有问题，请通过“意见反馈”联系管理员。</div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="dialogVisible =false">取 消</el-button>
                <el-button type="primary" @click="submitForm()" :loading="loading">提 交</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="previewDialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </el-row>
</template>
<script>
import { requiredValidator, integerValidator, phoneValidator } from '../utils/validate.js'
import httpRequest from '../utils/httpRequest';
import { updateUserInfoById } from '../api/index.js';
import echarts from 'echarts';
import chartTheme from '../assets/theme.js';

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
            loading: false, // 上传按钮是否Loading
            dialogVisible: false,
            dialogImageUrl: '',
            previewDialogVisible: false,
            formData: {
                image_urls: [], // 图书馆照片，只保存链接
                qualification_image_urls: [] // 资质证明文件，只保存链接
            }, // 图书馆信息表单数据
            imageList: [], // 图书馆照片的信息对象列表
            qualificationImageList: [], // 资质证明文件

            rules: {
                admin_name: [requiredValidator('请输入负责人姓名')],
                name: [requiredValidator('请输入图书馆名称')],
                location: [requiredValidator('请输入图书馆地址')],
                phone: [requiredValidator('请输入图书馆电话')],
                description: [requiredValidator('请输入图书馆描述')]
            },
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
        this.$nextTick().then(() => {
            this.drawOrderChart(this.libraryData.recent_lending_records);
            this.drawRankChart('pastRankChart', '图书借阅量总排行', this.libraryData.past_lending_books_ranking);
            this.drawRankChart('recentRankChart', '近七天图书借阅量排行', this.libraryData.recent_lending_books_ranking);
        });
    },
    methods: {
        // 重置编辑信息模态框内容，包括文字与图片链接
        reset() {
            // 将初始的图片URL包装为对象，添加response属性，以和新插入的file对象的属性相对应
            if (this.libraryData.image_urls) {
                this.imageList = this.libraryData.image_urls.map((i) => {
                    return { name: '', url: i, status: 'success', response: { data: i } };
                });
            } else {
                this.imageList = [];
            }
            if (this.libraryData.qualification_image_urls) {
                this.qualificationImageList = this.libraryData.qualification_image_urls.map((i) => {
                    return { name: '', url: i, status: 'success', response: { data: i } };
                });
            } else {
                this.qualificationImageList = [];
            }
            this.formData = Object.assign({}, this.libraryData);
        },
        handlePictureChange(file, fileList) {
            this.imageList = fileList;
        },
        beforePictureUpload(file) {
            if (this.imageList.length > 9) {
                this.$message.error('最多只能上传9张图片');
                return false;
            }
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB');
            }
            return isJPG && isLt2M;
        },
        handlePictureChange2(file, fileList) {
            this.qualificationImageList = fileList;
        },
        beforePictureUpload2(file) {
            if (this.qualificationImageList.length > 9) {
                this.$message.error('最多只能上传9张图片');
                return false;
            }
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG/PNG 格式');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB');
            }
            return isJPG && isLt2M;
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.imageList.some((i) => !i.response) || this.qualificationImageList.some((i) => !i.response)) {
                        return this.$message.error('请等待所有图片上传完成')
                    }
                    this.loading = true;
                    this.formData.image_urls = this.imageList.map((i) => i.response.data);
                    this.formData.qualification_image_urls = this.qualificationImageList.map((i) => i.response.data);
                    this.$store.dispatch('UPDATE_USER_INFO', this.formData).then(() => {
                        this.loading = false;
                        this.dialogVisible = false;
                        this.$message.success("修改成功");
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.previewDialogVisible = true;
        },
        httpRequest: httpRequest,
        drawOrderChart(data) {
            var chartLine = echarts.init(document.getElementById('orderChart'));
            chartLine.setOption({
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
                series: [{
                    name: "借书量",
                    type: 'line',
                    data: data,
                    smooth: true
                }],
                color: [
                    '#20A0FF'
                ]
            });
        },
        drawRankChart(id, title, data) {
            var chartPie = echarts.init(document.getElementById(id));
            chartPie.setOption({
                title: {
                    text: title,
                    left: 'center',
                    top: 20,
                },
                // 图表形状颜色, ecahrts依次选择颜色渲染
                color: chartTheme.color,
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} 本"
                },
                series: [{
                    name: '借阅量',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function(idx) {
                        return Math.random() * 200;
                    }
                }]
            });
            chartPie.on('click', (params) => {
                window.open("https://api.mymoonlight.cn/wiki/#/book/" + params.data.id)
            })
        },
    }
}
</script>
<style scoped>
.content-title {
    font-size: 22px;
}

#orderChart {
    height: 400px;
}

#pastRankChart,
#recentRankChart {
    height: 250px;
}

.el-card {
    margin-top: 20px;
    margin-right: 20px;
}

.fragment {
    padding: 20px;
    border-top: 1px solid #d1dbe5;
}

.fragment:first-child {
    border-top: 0
}

.fragment-title {
    font-size: 14px;
    color: #48576a;
    line-height: 1;
    margin-bottom: 20px;
}

.fragment .el-form-item {
    margin: 0;
}
</style>
<style>
.library-info .el-card>.el-card__body {
    padding: 0;
}

.el-carousel__item {
    text-align: center;
}
</style>