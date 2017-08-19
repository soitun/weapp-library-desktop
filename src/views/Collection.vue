<template>
    <div>
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
            <el-button type="text" style="float: right" @click="showTip()">查看提示</el-button>
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
                <el-button type="primary" :loading="collectionFormLoading" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>
        <el-table class="collection-table" v-loading="collectionTableLoading" :data="collectionData" stripe style="width: 100%" @row-click="navigate">
            <el-table-column prop="book_brief.title" label="书名">
            </el-table-column>
            <el-table-column prop="book_brief.isbn" label="ISBN">
            </el-table-column>
            <el-table-column prop="total_num" label="图书总数" width="150">
            </el-table-column>
            <el-table-column prop="available_num" label="可借数目" width="150">
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template scope="scope">
                    <el-button size="small" @click.stop="handleEdit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page.sync="currentPage" @current-change="fetchData">
        </el-pagination>
        <div>一共{{total}}条馆藏数据</div>
    </div>
</template>
<script>
import { requiredValidator, integerValidator } from '../utils/validate.js'
import { getCollections, updateCollection } from '../api/index.js';

export default {
    data: () => {
        return {
            // 馆藏信息
            collectionData: [],
            total: undefined,
            pageSize: 20,
            currentPage: 1,
            currentTableType: 'all', // all || search

            // 搜索输入框
            searchInput: '',

            // 设置馆藏 表单
            collcetionForm: {
                isbn: "",
                total_num: null,
                available_num: null
            },
            collectionRules: {
                isbn: [requiredValidator("请输入isbn")],
                total_num: [requiredValidator("请输入图书总数"), {
                    validator: integerValidator
                }],
                available_num: [requiredValidator("请输入图书可借数目"), {
                    validator: integerValidator
                }]
            },

            collectionFormLoading: false,
            collectionTableLoading: true,
            dialogFormVisible: false,
        }
    },
    computed: {
        libraryId() {
            return this.$store.getters.id;
        }
    },
    mounted: function() {
        this.fetchData(1);
        if (!this.$store.getters.showTip) {
            this.showTip();
            this.$store.commit('SET_SHOW_TIP', true);
        }
    },
    methods: {
        // 重置“设置馆藏”表单
        resetFields() {
            this.collcetionForm = {
                isbn: "",
                total_num: null,
                available_num: null
            }
        },
        // 编辑某一行馆藏信息
        handleEdit(row) {
            this.collcetionForm.isbn = row.book_brief.isbn;
            this.collcetionForm.total_num = row.total_num;
            this.collcetionForm.available_num = row.available_num;
            this.dialogFormVisible = true
        },
        // 清空搜索条件，重置表格
        resetTable() {
            this.searchInput = '';
            this.currentTableType = 'all';

            // currentPage为1时，设置total不会改变currentPage
            if (this.currentPage == 1)
                this.fetchData(1);
            else this.currentPage = 1;
        },
        // 搜索馆藏
        handleSearch() {
            this.currentTableType = 'search';
            if (this.currentPage == 1)
                this.fetchData(1);
            else this.currentPage = 1;
        },
        // 获取数据
        fetchData(p) {
            this.collectionTableLoading = true;
            var start = (p - 1) * this.pageSize;
            getCollections(this.libraryId, {
                start: start,
                isbn: this.currentTableType == 'search' ? this.searchInput : undefined
            }).then(res => {
                this.collectionData = res.subjects;
                if (start == 0) {
                    // total改变时，currentPage也会改变，会触发current-change事件
                    // 只在第一页刷新total
                    this.total = res.total;
                }
            }).finally(_ => {
                this.collectionTableLoading = false;
            })
        },
        // 添加馆藏
        submitForm() {
            this.$refs.collcetionForm.validate((valid) => {
                if (valid) {
                    this.collectionFormLoading = true;
                    updateCollection(this.libraryId, this.collcetionForm).then((res) => {
                        // 提示
                        this.$message({
                            type: 'success',
                            message: "设置馆藏成功：《" + res.book_brief.title + "》 总数：" + res.total_num + " 可借：" + res.available_num,
                            duration: 10000,
                            showClose: true
                        });
                        // 刷新数据
                        this.fetchData(this.currentPage);
                        this.dialogFormVisible = false;
                    }).catch((res) => {
                        if(res.code && res.code == '400') {
                            const h = this.$createElement;
                            this.$msgbox({
                                title: '消息',
                                type: 'error',
                                message: h('p', null, [
                                    "ISBN不存在，您可前往",
                                    h('a', { attrs: { href: 'https://api.mymoonlight.cn/wiki/', target: "blank" } }, 'Wiki系统'),
                                    "创建图书条目"
                                ]),
                                confirmButtonText: '确定'
                            });
                        }
                    }).finally(() => {
                        this.collectionFormLoading = false;
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 显示提示信息
        showTip() {
            const h = this.$createElement;
            this.$notify.info({
                title: '提示',
                message: h('div', null, [
                    h('div', null, [
                        '您可在',
                        h('a', { attrs: { href: 'https://api.mymoonlight.cn/wiki/', target: "blank" } }, '图书Wiki系统'),
                        '中添加、编辑图书信息;'
                    ]),
                    h('div', null, '点击列表某一行可查看该图书的详细信息;'),
                    h('div', null, '首次访问Wiki系统时会下载约4M应用文件，请耐心等待。'),
                ]),
                //duration: 0
            });
        },
        // 跳转到图书详情页
        navigate: function(row) {
            window.open("https://api.mymoonlight.cn/wiki/#/book/" + row.book_brief.id);
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
<style>
.el-notification {
    z-index: 10001 !important;
}

.collection-table.el-table tr:hover {
    cursor: pointer;
}
</style>