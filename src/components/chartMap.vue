<script setup>
import * as echarts from 'echarts'
let chart = ref()

onMounted(() => {
  const myChart = echarts.init(chart.value)
  let options = {
    title: {
      text: '预约状态',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['已预约', '已挂号', '治疗中', '治疗完成', '已离店'],
    },
    series: [
      {
        name: '预约状态',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          { value: 335, name: '已预约' },
          { value: 310, name: '已挂号' },
          { value: 234, name: '治疗中' },
          { value: 135, name: '治疗完成' },
          { value: 1548, name: '已离店' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: '#efefef',
          },
        },
      },
    ],
  }
  myChart.setOption(options)
})
</script>

<template>
  <div id="myEchart" ref="chart" style="width: 100%; height: 400px"></div>
</template>

<style scoped>
.chart {
  height: 400px;
}
</style>
