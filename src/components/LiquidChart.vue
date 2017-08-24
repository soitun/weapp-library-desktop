<template>
  <div :id="id" :style="{height: height + 'px'}"></div>
</template>
<script>
import echarts from 'echarts';
require('echarts-liquidfill');
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 200
    },
    id: {
      type: String,
      default: 'liquid-chart'
    },
    data: {
      type: Number,
      default: 0.6
    }
  },
  methods: {
    render() {
      var option = {
        series: [{
          type: 'liquidFill',
          data: [this.data, this.data * 3 / 4, this.data / 2, this.data / 4],
          radius: '80%'
        }]
      };
      if (this.title) {
        option = Object.assign(option, {
          title: {
            text: this.title,
            textStyle: {
              fontSize: 16
            },
          }
        });
      }
      var chart = echarts.init(document.getElementById(this.id));
      chart.setOption(option);
    }
  }
}

</script>
