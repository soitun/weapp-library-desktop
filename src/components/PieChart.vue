<template>
  <div :id="id" :style="{height: height + 'px'}"></div>
</template>
<script>
import echarts from 'echarts';
import chartTheme from '../assets/theme.js';
export default {
  props: {
    height: {
      type: Number,
      default: 200
    },
    id: {
      type: String,
      default: 'pie-chart'
    },
    itemName: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: []
    },
    formatter: {
      type: String,
      default: "{a} <br/>{b} : {c}"
    },
    title: {
      type: String,
      default: ''
    },
    onClick: {
      type: Function,
      default: () => {}
    },
  },
  methods: {
    render() {
      var chart = echarts.init(document.getElementById(this.id));
      chart.setOption({
        title: {
          text: this.title,
          left: 'center',
          top: 0,
          textStyle: {
            fontSize: 16
          },
        },
        // 图表形状颜色, ecahrts依次选择颜色渲染
        color: chartTheme.color,
        tooltip: {
          trigger: 'item',
          formatter: this.formatter
        },
        series: [{
          name: this.itemName,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.data,
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
      chart.on('click', this.onClick)
    }
  }
}

</script>
