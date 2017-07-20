<template>
    <div class="content">
        <el-form inline>
            <el-form-item>
                <el-input v-model="searchOptions.orderId" placeholder="订单号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchOptions.phone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="searchOptions.startDate" align="right" type="date" placeholder="起始日期" :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="searchOptions.endDate" align="right" type="date" format="yyyy-MM-dd" placeholder="结束日期" :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchOptions.states" multiple placeholder="订单状态">
                    <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch()">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetTable()">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="orderTableLoading" :data="orderData" stripe style="width: 100%">
            <el-table-column type="expand">
                <template scope="props">
                    <el-form label-position="left" label-width="120px">
                        <el-form-item label="订单创建日期：">
                            <span>{{ props.row.create_time }}</span>
                        </el-form-item>
                        <el-form-item label="订单结束日期：">
                            <span>{{ props.row.create_time }}</span>
                        </el-form-item>
                        <el-form-item label="借书开始日期：">
                            <span>{{ props.row.actual_take_time }}</span>
                        </el-form-item>
                        <el-form-item label="续借次数：">
                            <span>{{ props.row.renew_count }}</span>
                        </el-form-item>
                        <el-form-item label="应还日期：">
                            <span>{{ props.row.should_return_time }}</span>
                        </el-form-item>
                        <el-form-item label="实际归还日期：">
                            <span>{{ props.row.actual_return_time }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="订单id" width="100">
            </el-table-column>
            <el-table-column prop="user.name" label="借阅人" width="100">
            </el-table-column>
            <el-table-column prop="user.phone" label="手机号">
            </el-table-column>
            <el-table-column prop="book_brief.title" label="书名">
            </el-table-column>
            <el-table-column prop="book_brief.isbn" label="ISBN">
            </el-table-column>
            <el-table-column label="订单状态" width="120">
                <template scope="scope">
                    <el-tag :type="scope.row.stateColor">{{scope.row.stateTitle}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page.sync="currentPage" @current-change="fetchData">
        </el-pagination>
        <div>一共{{total}}条订单数据</div>
        <el-dialog title="设置馆藏" :visible.sync="dialogFormVisible" @close="resetFields">
            <el-form label-width="120px" label-position="left" :model="dialogData">
                <el-form-item label="订单id">
                    <el-input disabled :value="dialogData.id"></el-input>
                </el-form-item>
                <el-form-item label="借阅人">
                    <el-input disabled :value="dialogData.user.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input disabled :value="dialogData.user.phone"></el-input>
                </el-form-item>
                <el-form-item label="图书名称">
                    <el-input disabled :value="dialogData.book_brief.title"></el-input>
                </el-form-item>
                <el-form-item label="ISBN">
                    <el-input disabled :value="dialogData.book_brief.isbn"></el-input>
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-select v-model="dialogStateValue" :placeholder="dialogData.stateTitle">
                        <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-popover ref="confirmPopover" placement="top" width="160" v-model="popoverVisible">
                    <p>删除此订单可能影响该图书的可借数量，确定删除吗？</p>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="popoverVisible = false">取消</el-button>
                        <el-button type="text" size="mini" @click="handleDelete()">确定</el-button>
                    </div>
                </el-popover>
                <el-button class="deleteBtn" type="danger" v-popover:confirmPopover :loading="dialogDeleteBtnLoading">删除此订单</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" :loading="dialogSubmitBtnLoading" @click="handleSubmit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data: () => {
        return {
            orderData: [],
            total: undefined,
            pageSize: 20,
            currentPage: 1,
            currentTableType: 'all', // all || search
            dialogData: {
                id: null,
                state: null,
                user: {
                    name: null,
                    phone: null
                },
                book_brief: {
                    title: null,
                    isbn: null
                }
            },
            dialogStateValue: "", // 选择的订单状态

            dialogFormVisible: false,
            popoverVisible: false,
            orderTableLoading: false,
            dialogSubmitBtnLoading: false,
            dialogDeleteBtnLoading: false,


            stateOptions: [{
                value: 1001,
                label: "预约中"
            }, {
                value: 1002,
                label: "可取书"
            }, {
                value: 1004,
                label: "借阅中"
            }, {
                value: 1005,
                label: "已超期"
            }, {
                value: 1011,
                label: "已归还"
            }],

            searchOptions: {
                orderId: undefined,
                phone: undefined,
                startDate: undefined,
                endDate: undefined,
                states: []
            },

            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
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
        this.fetchData(1);
    },
    methods: {
        handleEdit(row) {
            this.dialogData = row;
            this.dialogFormVisible = true;
        },
        handleSubmit() {
            if (!this.dialogStateValue) 
                return this.dialogFormVisible = false;

            const self = this;
            self.$axios.post('/api/orders/' + self.dialogData.id, {
                state: self.dialogStateValue
            }).then(res => {
                self.dialogSubmitBtnLoading = false;
                if (res.data.code == 200) {
                    self.dialogFormVisible = false;
                    self.$message.success("修改成功");
                    self.fetchData(self.currentPage);
                } else {
                    self.$message.error("修改失败");
                }
            })

        },
        handleDelete() {
            this.popoverVisible = false;
            this.dialogDeleteBtnLoading = true;

            const self = this;
            self.$axios.delete("/api/orders/" + self.dialogData.id).then(res => {
                self.dialogDeleteBtnLoading = false;
                if (res.data.code == 200) {
                    self.dialogFormVisible = false;
                    self.$message.success("删除订单成功");

                    // 从数组中删除订单
                    self.orderData.splice(self.orderData.findIndex(i => i.id == self.dialogData.id), 1);
                } else {
                    self.$message.error("删除订单失败：" + res.data.errmsg);
                }
            }).catch(_ => {
                self.dialogDeleteBtnLoading = false;
                self.$message.error("删除订单失败");
            });
        },
        handleSearch() {
            this.currentTableType = 'search';
            if (this.currentPage == 1)
                this.fetchData(1);
            else this.currentPage = 1;
        },
        resetTable() {
            this.searchOptions = {
                phone: undefined,
                startDate: undefined,
                endDate: undefined,
                states: []
            };
            this.currentTableType = 'all';
            if (this.currentPage == 1)
                this.fetchData(1);
            else this.currentPage = 1;
        },
        resetFields() {
            this.dialogStateValue = "";
        },
        fetchData(p) {
            var start = (p - 1) * this.pageSize;
            var self = this;
            var url = '/api/orders/libraries/' + this.libraryId + '?start=' + start;
            var params = {};
            if (this.currentTableType == 'search') {
                url = '/api/orders/libraries/' + this.libraryId + '?start=' + start;

                if (this.searchOptions.orderId) params.order_id = this.searchOptions.orderId;
                if (this.searchOptions.phone) params.phone = this.searchOptions.phone;
                if (this.searchOptions.startDate) params.start_date = this.searchOptions.startDate
                if (this.searchOptions.endDate) params.end_date = this.searchOptions.endDate;
                if (this.searchOptions.states) {
                    params.states = [];
                    if (this.searchOptions.states.includes(1001))
                        params.states.push(1001);
                    if (this.searchOptions.states.includes(1002))
                        params.states.push(1002, 1003);
                    if (this.searchOptions.states.includes(1004))
                        params.states.push(1004);
                    if (this.searchOptions.states.includes(1005))
                        params.states.push(1005);
                    if (this.searchOptions.states.includes(1011))
                        params.states.push(1011, 1012, 1013, 1014, 1015);
                }
            }
            self.orderTableLoading = true;
            self.$axios.get(url, {
                params: params
            }).then(res => {
                self.orderTableLoading = false;
                if (res.data.code == 200) {
                    //根据订单状态，设置tag颜色与内容
                    res.data.data.subjects.forEach((i, index) => {
                        if (i.state > 1010) {
                            res.data.data.subjects[index]['stateColor'] = 'gray';
                            res.data.data.subjects[index]['stateTitle'] = '已归还';
                        }
                        if (i.state == 1001) {
                            res.data.data.subjects[index]['stateColor'] = 'warning';
                            res.data.data.subjects[index]['stateTitle'] = '预约中';
                        }
                        if (i.state == 1002 || i.state == 1003) {
                            res.data.data.subjects[index]['stateColor'] = 'primary';
                            res.data.data.subjects[index]['stateTitle'] = '可取书';
                        }
                        if (i.state == 1004) {
                            res.data.data.subjects[index]['stateColor'] = 'success';
                            res.data.data.subjects[index]['stateTitle'] = '借阅中';
                        }
                        if (i.state == 1005) {
                            res.data.data.subjects[index]['stateColor'] = 'danger';
                            res.data.data.subjects[index]['stateTitle'] = '已超期';
                        }
                    })
                    self.orderData = res.data.data.subjects;
                    if (start == 0)
                        self.total = res.data.data.total;
                } else {
                    self.$message.error("获取订单列表失败：" + res.data.errmsg);
                }
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

.el-table .el-form-item {
    margin: 0;
}

.dialog-footer > .deleteBtn {
    float: left;
}
</style>
