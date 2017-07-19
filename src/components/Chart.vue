<template>
    <div class="chart">
        <div class="content-title">近期借阅统计</div>
        <chart ref="chart" :options="schema"></chart>
    </div>
</template>

<script>
export default {
    props: ['xaxis', 'yaxis'],
    data: function() {
        return {
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
                    data: this.xaxis,
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
    mounted: function(){
        // 不能写在created事件里，created还没有创建子组件
        // 如果没数据，显示加载
        this.$refs.chart.showLoading('default', {
            color: '#20a0ff',
            text: '加载中'
        });
    },
    watch: {
        yaxis: function() {
            this.$refs.chart.hideLoading();
            // 在这里合并选项，设置数据，不是在schema里，否则不会出现smooth动画
            this.$refs.chart.mergeOptions({
                series: [{
                    name: '借书量', // **
                    type: 'line',
                    data: this.yaxis,
                    smooth: true
                }]
            });
        }
    }
}
</script>
