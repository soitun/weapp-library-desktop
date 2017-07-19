<template>
    <div class="content">
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="searchInput" placeholder="图书ISBN"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="!searchInput" @click="handleSearch()">搜索馆藏</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="dialogFormVisible=true">添加馆藏</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetTable()">重置</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="设置馆藏" :visible.sync="dialogFormVisible" v-on:close="resetFields">
            <el-form :rules="collectionRules" label-width="120px" label-position="left" :model="collcetionForm" ref="collcetionForm">
                <el-form-item label="图书ISBN" prop="isbn">
                    <el-input v-model="collcetionForm.isbn"></el-input>
                </el-form-item>
                <el-form-item label="图书总数" prop="total_num">
                    <el-input v-model="collcetionForm.total_num"></el-input>
                </el-form-item>
                <el-form-item label="可借数目" prop="available_num">
                    <el-input v-model="collcetionForm.available_num"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" :loading="collectionFormLoading" @click="submitForm('collcetionForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-table v-loading="collectionTableLoading" :data="collectionData" stripe style="width: 100%">
            <el-table-column prop="book_brief.title" label="书名">
            </el-table-column>
            <el-table-column prop="book_brief.isbn" label="ISBN">
            </el-table-column>
            <el-table-column prop="total_num" label="图书总数" width="150">
            </el-table-column>
            <el-table-column prop="available_num" label="可借数目" width="150">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page.sync="currentPage" @current-change="fetchData">
        </el-pagination>
        <div>一共{{total}}条馆藏数据</div>
    </div>
</template>
<script>
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
            libraryId: localStorage.getItem('libraryId'),

            collcetionForm: {
                isbn: "",
                total_num: null,
                available_num: null
            },

            collectionData: [],
            total: undefined,
            pageSize: 20,
            currentPage: 1,
            currentTableType: 'all', // all || search

            searchInput: '',

            collectionFormLoading: false,
            collectionTableLoading: false,
            dialogFormVisible: false,


            collectionRules: {
                isbn: [{
                    required: true,
                    message: '请输入isbn',
                    trigger: 'blur'
                }],
                total_num: [{
                    required: true,
                    message: '请输入图书总数',
                    trigger: 'blur'
                }, {
                    validator: validator
                }],
                available_num: [{
                    required: true,
                    message: '请输入图书可借数目',
                    trigger: 'blur'
                }, {
                    validator: validator
                }]
            }
        }
    },
    created: function() {
        this.fetchData(1);
    },
    methods: {
        submitForm(formName) {
            const self = this;
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    if (formName == 'collcetionForm') {
                        self.submitCollectionForm();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        submitCollectionForm() {
            const self = this;
            self.collectionFormLoading = true;
            self.$axios.post('/api/libraries/' + this.libraryId + '/collections', self.collcetionForm).then(res => {
                self.collectionFormLoading = false;
                if (res.data.code == 200) {
                    const h = this.$createElement;
                    this.$message.success("设置馆藏成功：《" + res.data.data.book_brief.title + "》 总数：" + res.data.data.total_num + " 可借：" + res.data.data.available_num)
                    self.fetchData(self.currentPage);
                    self.dialogFormVisible = false;
                    self.resetFields();
                } else {
                    self.$message.error("添加失败：" + res.data.errmsg);
                }
            }).catch(_ => {
                self.collectionFormLoading = false;
                self.$message.error("服务器错误")
            })
        },
        resetFields() {
            this.collcetionForm = {
                isbn: "",
                total_num: null,
                available_num: null
            }
        },
        handleEdit(row) {
            this.collcetionForm.isbn = row.book_brief.isbn;
            this.collcetionForm.total_num = row.total_num;
            this.collcetionForm.available_num = row.available_num;
            this.dialogFormVisible = true
        },
        handleSearch() {
            this.currentTableType = 'search';
            if (this.currentPage == 1)
                this.fetchData(1);
            else this.currentPage = 1;
        },
        resetTable() {
            this.searchInput = '';
            this.currentTableType = 'all';

            //currentPage为1时，设置total不会改变currentPage
            if (this.currentPage == 1)
                this.fetchData(1);
            else this.currentPage = 1;
        },
        fetchData(p) {
            var start = (p - 1) * this.pageSize;
            var self = this;
            var url = '/api/libraries/' + this.libraryId + '/collections?start=' + start;
            if (this.currentTableType == 'search') {
                url = '/api/libraries/' + this.libraryId + '/collections?isbn=' + self.searchInput;
            }
            self.collectionTableLoading = true;
            self.$axios.get(url).then(res => {
                self.collectionTableLoading = false;
                if (res.data.code == 200) {
                    self.collectionData = res.data.data.subjects;

                    // total改变时，currentPage也会改变，会触发current-change事件
                    if (start == 0)
                        self.total = res.data.data.total;
                } else {
                    self.$message.error("获取馆藏信息失败：" + res.data.errmsg);
                }
            }).catch(_ => {
                self.collectionTableLoading = false;
                self.$message.error("服务器错误")
            })
        }
    }
}
</script>
<style scoped>
.el-pagination {
    margin-top: 20px;
    text-align: center;
}
</style>
