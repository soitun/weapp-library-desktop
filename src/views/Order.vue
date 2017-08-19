<template>
    <div>
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
                    <el-tag :type="scope.row | type ">{{scope.row | title}}</el-tag>
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
        <el-dialog title="编辑订单" :visible.sync="dialogFormVisible" @close="resetFields">
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
                    <el-select v-model="dialogStateValue" :placeholder="dialogData | title">
                        <el-option v-for="item in stateOptions" :label="item.label" :value="item.value">
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
import { getOrdersByLibraryId, updateOrderStateById, deleteOrderById } from '../api/index.js';
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
    filters: {
        type(row) {
            if (row.state > 1010) {
                return 'gray';
                res.data.data.subjects[index]['stateTitle'] = '已归还';
            }
            if (row.state == 1001) {
                return 'warning';
                res.data.data.subjects[index]['stateTitle'] = '预约中';
            }
            if (row.state == 1002 || row.state == 1003) {
                return 'primary';
                res.data.data.subjects[index]['stateTitle'] = '可取书';
            }
            if (row.state == 1004) {
                return 'success';
                res.data.data.subjects[index]['stateTitle'] = '借阅中';
            }
            if (row.state == 1005) {
                return 'danger';
                res.data.data.subjects[index]['stateTitle'] = '已超期';
            }
        },
        title(row) {
            if (row.state > 1010) {
                return '已归还';
            }
            if (row.state == 1001) {
                return '预约中';
            }
            if (row.state == 1002 || row.state == 1003) {
                return '可取书';
            }
            if (row.state == 1004) {
                return '借阅中';
            }
            if (row.state == 1005) {
                return '已超期';
            }
        }
    },
    computed: {
        libraryId() {
            return this.$store.getters.id;
        }
    },
    created: function() {
        this.fetchData(1);
    },
    methods: {
        fetchData(p) {
            this.orderTableLoading = true;
            var start = (p - 1) * this.pageSize;
            var params = {
                start: start
            };
            if (this.currentTableType == 'search') {
                params = {
                    start: (p - 1) * this.pageSize,
                    order_id: this.searchOptions.orderId,
                    phone: this.searchOptions.phone,
                    start_date: this.searchOptions.startDate,
                    end_date: this.searchOptions.endDate,
                    states: this.searchOptions.states.concat()
                }
                if (params.states.includes(1002)) // 可取书订单包括：预约取书、预订取书
                    params.states.push(1003);
                if (params.states.includes(1011)) // 已归还订单包括所有结束订单
                    params.states.push(1012, 1013, 1014, 1015);
            }
            getOrdersByLibraryId(this.libraryId, params).then(res => {
                this.orderData = res.subjects;
                if (start == 0)
                    this.total = res.total;
            }).finally(() => {
                this.orderTableLoading = false;
            })
        },
        // 修改订单状态
        handleSubmit() {
            // 订单状态没变化时直接退出
            if (!this.dialogStateValue) {
                return this.dialogFormVisible = false;
            }
            this.dialogSubmitBtnLoading = true;
            updateOrderStateById(this.dialogData.id, this.dialogStateValue).then(() => {
                this.dialogFormVisible = false;
                this.$message.success("修改成功");
                this.fetchData(this.currentPage); // 刷新页面
            }).finally(() => {
                this.dialogSubmitBtnLoading = false;
            })
        },
        handleDelete() {
            this.popoverVisible = false;
            this.dialogDeleteBtnLoading = true;
            deleteOrderById(this.dialogData.id).then(() => {
                this.dialogFormVisible = false;
                this.$message.success("删除订单成功");
                this.orderData.splice(this.orderData.findIndex(i => i.id == this.dialogData.id), 1); // 从数组中删除订单
            }).finally(_ => {
                this.dialogDeleteBtnLoading = false;
            });
        },
        handleEdit(row) {
            this.dialogData = row;
            this.dialogFormVisible = true;
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

.dialog-footer>.deleteBtn {
    float: left;
}
</style>