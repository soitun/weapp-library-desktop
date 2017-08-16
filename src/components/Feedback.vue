<template>
    <div>
        <el-dialog title="意见反馈" :visible.sync="dialogVisible" @close="reset">
            <div>
                <el-form :model="form" :rules="rules" ref="form">
                    <el-form-item prop="title" label="标题">
                        <el-input v-model="form.title" placeholder="请简要描述您遇到的问题"></el-input>
                    </el-form-item>
                    <el-form-item prop="body" label="正文">
                        <el-input type="textarea" :rows="5" placeholder="请详细描述您遇到的问题，如：页面内容有误/违反规定，页面卡顿等。我们会在第一时间为您解决。" v-model="form.body" @keyup.enter.native="submit()"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" :loading="loading" @click="submit()">提 交</el-button>
            </div>
        </el-dialog>
        <el-button class="feedback" type="success" @click="dialogVisible=true">
            <svg t="1502881630665" class="icon" style="" viewBox="0 0 1051 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="816" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25" style="display: inline-block; fill: #fff;">
                <path d="M55.351351 553.402811v110.924108a83.027027 83.027027 0 0 0 166.054054 0v-110.924108a83.027027 83.027027 0 0 0-166.054054 0z m763.101406 211.552865A137.852541 137.852541 0 0 1 774.918919 664.326919v-110.924108A138.378378 138.378378 0 0 1 912.328649 415.135135C898.131027 214.071351 730.499459 55.351351 525.837838 55.351351 321.148541 55.351351 153.544649 214.071351 139.347027 415.135135A138.461405 138.461405 0 0 1 276.756757 553.402811v110.924108a138.378378 138.378378 0 0 1-276.756757 0v-110.924108a138.378378 138.378378 0 0 1 83.303784-126.865297C91.883243 189.523027 286.72 0 525.837838 0s433.954595 189.523027 442.534054 426.537514A138.461405 138.461405 0 0 1 1051.675676 553.402811v110.924108a138.378378 138.378378 0 0 1-184.790487 130.269405 470.763243 470.763243 0 0 1-188.858811 121.21946A96.809514 96.809514 0 0 1 580.912432 1010.162162h-82.528864c-53.690811 0-97.113946-43.174054-97.113946-96.864865 0-53.607784 43.284757-96.864865 97.141621-96.864865h82.473514c34.954378 0 65.536 18.265946 82.639567 45.803244a415.273514 415.273514 0 0 0 154.900757-97.28zM830.27027 553.402811v110.924108a83.027027 83.027027 0 0 0 166.054054 0v-110.924108a83.027027 83.027027 0 0 0-166.054054 0zM498.438919 954.810811h82.473513c23.302919 0 41.79027-18.487351 41.790271-41.513514 0-23.053838-18.570378-41.513514-41.790271-41.513513h-82.473513c-23.302919 0-41.79027 18.487351-41.79027 41.513513 0 23.053838 18.570378 41.513514 41.79027 41.513514z" p-id="817"></path>
            </svg>
        </el-button>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            loading: false,
            dialogVisible: false,
            form: {
                title: "",
                body: "",
            },
            rules: {
                title: { required: true, trigger: 'blur', message: "请填写标题" },
                body: { required: true, trigger: 'blur', message: "请详细描述您遇到的问题" }
            }
        }
    },
    methods: {
        submit() {
            this.$refs.form.validate(valid => {
                if (!valid) return;
                this.loading = true;
                axios.post('/api/messages', {
                    senderType: 2,
                    senderId: this.$store.getters.id,
                    title: this.form.title,
                    body: this.form.body
                }).then((res) => {
                    if (res.data.code == '200') {
                        this.$message.success("反馈成功，我们会尽快处理您的问题，请您耐心等待");
                        this.dialogVisible = false;
                    } else {
                        console.log(res.data);
                        this.$message.error("提交失败");
                    }
                }).catch(e => {
                    console.log(e);
                    this.$message.error("提交失败");
                }).finally(() => this.loading = false);
            })
        },
        reset() {
            // 清除错误提示
            var title = this.form.title;
            var body = this.form.body;
            this.$refs.form.resetFields();
            this.form.title = title;
            this.form.body = body;
        }
    }
}
</script>
<style scoped>
.feedback {
    z-index: 1001;
    background-color: #EA354A;
    position: fixed;
    right: 30px;
    bottom: 30px;
    width: 50px;
    height: 50px;
    padding: 10px;
    border: 0;
    border-radius: 25px;
    box-shadow: 2px 2px 10px 2px rgba(44, 44, 44, .5);
}

.feedback:hover {
    background-color: rgba(234, 53, 74, .9);
    box-shadow: 2px 2px 10px 2px rgba(99, 99, 99, .5);
}

.feedback:active {
    background-color: rgb(234, 37, 60);
}
</style>