<template>
  <el-row>
    <el-col :xs="24" :sm="24" :md="24" :lg="24">
      <div id="dialogRateBar" style="width: 100%; height: 400px" />
    </el-col>
  </el-row>
</template>

<script>
import echarts from 'echarts'
// import dayjs from 'dayjs'

export default {
  props: {
    dataList: {
      type: Array,
      default() {
        return {}
      }
    },
    headers: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  watch: {
    dataList(val) {
      if (val) {
        this.drawLine()
      }
    }
  },
  created() {
    console.log('this.dayTableData', this.dataList)
  },
  mounted() {
    this.$nextTick(function() {
      this.drawLine()
    })
    // this.drawLine()
  },
  methods: {
    drawLine() {
      const option = {
        legend: {},
        tooltip: {
          trigger: 'axis',
          confine: true,
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          top: '12%',
          left: '5%',
          right: '8%',
          containLabel: true
        },
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 100
          }
        ],
        dataset: {
          source: [['一次', '流变', '综合']]
        },
        xAxis: { type: 'category', name: '月份' },
        yAxis: [
          {
            type: 'value',
            name: '合格率'
          }
        ],
        series: []
      }

      // 数据采集
      const datas = this.dataList.map((item) => {
        const { date, classes, equips } = item
        // const a = dayjs(date).format('YYYY-MM')
        const c = classes[0]
        const e = equips[0]
        return [
          // a
          date,
          parseFloat(item.yc_percent_of_pass || 0),
          parseFloat(item.lb_percent_of_pass || 0),
          parseFloat(item.zh_percent_of_pass || 0),
          parseFloat(e.yc_percent_of_pass || 0),
          parseFloat(e.lb_percent_of_pass || 0),
          parseFloat(e.zh_percent_of_pass || 0),
          parseFloat(c.yc_percent_of_pass || 0),
          parseFloat(c.lb_percent_of_pass || 0),
          parseFloat(c.zh_percent_of_pass || 0)
        ]
      })
      option.dataset.source.push(...datas)

      // 名称排序
      const dataList = this.dataList[0]
      const title = option.dataset.source[0]
      const equipsNames = title.map(
        (item) => dataList.equips[0].production_equip_no + item
      )
      const classesgNames = title.map(
        (item) => dataList.classes[0].production_class + item
      )
      option.dataset.source[0] = [
        '类型',
        ...title,
        ...equipsNames,
        ...classesgNames
      ]

      // 添加series
      const type = []
      for (let i = 1; i < option.dataset.source[0].length; i++) {
        type.push({ type: 'bar' })
      }
      option.series.push(...type)

      // 图表初始化
      this.$nextTick(() => {
        this.chartDialogRateBar = echarts.init(
          document.getElementById('dialogRateBar')
        )
        this.chartDialogRateBar.setOption(option)
      })
    }
  }
}
</script>
