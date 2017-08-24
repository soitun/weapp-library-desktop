<template>
  <el-row :gutter="20">
    <el-col :span="24" :lg="12">
      <el-card>
        <pie-chart ref="pieChart1" id="past-book-lending-rank" :data="libraryData.past_lending_books_ranking" title="图书借阅量总排行" item-name="借书量" :on-click="handlePieItemClick" formatter="{a} <br/>{b} : {c} 本"></pie-chart>
      </el-card>
    </el-col>
    <el-col :span="24" :lg="12">
      <el-card>
        <pie-chart ref="pieChart2" id="recent-book-lending-rank" :data="libraryData.recent_lending_books_ranking" title="近七天图书借阅量排行" item-name="借书量" :on-click="handlePieItemClick" formatter="{a} <br/>{b} : {c} 本"></pie-chart>
      </el-card>
    </el-col>
    <el-col :span="24" :lg="12">
      <el-card>
        <line-chart ref="lineChart" :title="LineChartParams.title" :formatter="LineChartParams.formatter" :x-axis="LineChartParams.xAxis" :y-axis="LineChartParams.yAxis" :data="LineChartParams.data"></line-chart>
      </el-card>
    </el-col>
    <el-col :span="24" :lg="12">
      <el-card>
        <liquid-chart ref="liquidChart" title="订单占比" :height="300" :data="libraryData.order_proportion"></liquid-chart>
      </el-card>
    </el-col>
    <el-col :span="24" :lg="12">
      <el-card>
        <div class="title">&nbsp</div>
        <multi-chart ref="multiChart"></multi-chart>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import MultiChart from '../components/MultiChart.vue';
import LiquidChart from '../components/LiquidChart.vue';
import PieChart from '../components/PieChart.vue';
import LineChart from '../components/LineChart.vue';

var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
require('echarts/lib/chart/pie');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
import chartTheme from '../assets/theme.js';

// 图表横坐标：最近7天的日期
var date = [];
var now = new Date().getTime();
for (let i = 0; i < 7; i++) {
  let time = new Date(now - i * 24 * 3600 * 1000);
  date.unshift([time.getFullYear(), time.getMonth() + 1, time.getDate()].join('/'));
}

export default {
  components: {
    MultiChart,
    LiquidChart,
    PieChart,
    LineChart
  },
  data: function() {
    return {
      handlePieItemClick: (params) => {
        window.open("https://api.mymoonlight.cn/wiki/#/book/" + params.data.id)
      },
    }
  },
  computed: {
    libraryData() {
      return this.$store.state.userInfo;
    },
    LineChartParams() {
      return {
        title: '近期借阅统计',
        formatter: (params) => {
          params = params[0];
          var date = new Date(params.name);
          return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
        },
        xAxis: {
          name: '日期',
          data: date
        },
        yAxis: {
          name: '借书量/本'
        },
        data: {
          name: '借书量',
          data: this.libraryData.recent_lending_records
        }
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.$refs.liquidChart.render();
      this.$refs.multiChart.render();
      this.$refs.pieChart1.render();
      this.$refs.pieChart2.render();
      this.$refs.lineChart.render();
    });
  }
}

</script>
<style scoped>
#orderChart {
  height: 300px;
}

#pastRankChart,
#recentRankChart {
  height: 200px;
}

.title {
  font-size: 14px;
}

.el-card {
  margin-bottom: 20px;
}

</style>
