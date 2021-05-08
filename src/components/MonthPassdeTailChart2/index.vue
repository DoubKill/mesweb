<template>
  <el-row>
    <el-col :xs="24" :sm="24" :md="24" :lg="24">
      <div ref="myChart" :style="{width:'100%',height:'400px'}" />
    </el-col>
  </el-row>

</template>

<script>
import echarts from 'echarts'
import dayjs from 'dayjs'
export default {
  props: {
    dayTableData: {
      type: Array,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      option: {
        title: {
          // text: '未来一周气温变化'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        // legend: {
        //   data: ['一次', '流变', '综合', 'TC90+', 'TC90-', 'TC90-', 'TC90+']
        // },
        // dataZoom: {
        //   show: true, // 为true 滚动条出现
        //   realtime: true,
        //   type: 'slider', // 有type这个属性，滚动条在最下面，也可以不行，写y：36，这表示距离顶端36px，一般就是在图上面。
        //   height: 20, // 表示滚动条的高度，也就是粗细
        //   start: 20, // 表示默认展示20%～80%这一段。
        //   end: 80
        // },
        xAxis: {
          type: 'category',
          // boundaryGap: false,
          boundaryGap: true,
          // data: ['2020-11-05', '2020-11-06', '2020-11-07', '2020-11-08', '2020-11-09', '2020-11-10'],
          data: [],
          axisPointer: {
            type: 'shadow'
          },
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '合格率%'
        //   axisLabel: {
        //     formatter: '{value} °C'
        //   }
        },
        dataZoom: [
          {
            show: true,
            start: 80,
            end: 100
          }
        ],
        series: [
          {
            name: '一次',
            type: 'bar',
            barWidth: 10,
            // data: [10.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            data: []
          },
          {
            name: '流变',
            type: 'bar',
            barWidth: 10,
            data: []

          },
          {
            name: '综合',
            type: 'bar',
            barWidth: 10,
            data: []
          },
          {
            name: 'Z01一次',
            type: 'bar',
            barWidth: 10,
            data: []

          },
          {
            name: 'Z01流变',
            type: 'bar',
            barWidth: 10,
            data: []
          },
          {
            name: 'Z01综合',
            type: 'bar',
            barWidth: 10,
            data: []
          },
          {
            name: '早班一次',
            type: 'bar',
            barWidth: 10,
            data: []
          },
          {
            name: '早班流变',
            type: 'bar',
            barWidth: 10,
            data: []
          },
          {
            name: '早班综合',
            type: 'bar',
            barWidth: 10,
            data: []
          }
        ]
      }
    }
  },
  watch: {
    dayTableData: {
      deep: true, // true 深度监听
      handler() {
        this.drawLine()
        const myChart = echarts.init(this.$refs.myChart)
        myChart.setOption(this.option)
      }
    }

  },

  created() {
    // console.log('this.dayTableData', this.dayTableData)
    // console.log('this.option', this.option)
  },
  mounted() {
    this.$nextTick(function() {
      this.drawLine()
      const myChart = echarts.init(this.$refs.myChart)
      myChart.setOption(this.option)
    })
  },
  methods: {
    drawLine() {
      const Array = this.dayTableData
      const daydatas = []
      const yici = []
      const liubian = []
      const zonghe = []

      const Zyici = []
      const Zliubian = []
      const Zzonghe = []

      const Zbyici = []
      const Zbliubian = []
      const Zbzonghe = []
      Array.forEach(item => {
        const day = dayjs(item.date).format('YYYY-MM')
        const D = item.yc_percent_of_pass ? item.yc_percent_of_pass.replace(/%/g, '') : '' // 一次
        const E = item.lb_percent_of_pass ? item.lb_percent_of_pass.replace(/%/g, '') : '' // 流变
        const F = item.zh_percent_of_pass ? item.zh_percent_of_pass.replace(/%/g, '') : '' // 综合
        daydatas.push(day)
        yici.push(D)
        liubian.push(E)
        zonghe.push(F)
        item.equips.map(item2 => {
          if (item2.production_equip_no === 'Z01') {
            const Z = item2.yc_percent_of_pass ? item2.yc_percent_of_pass.replace(/%/g, '') : '' // 一次
            const ZL = item2.lb_percent_of_pass ? item2.lb_percent_of_pass.replace(/%/g, '') : '' // 流变
            const ZZ = item2.zh_percent_of_pass ? item2.zh_percent_of_pass.replace(/%/g, '') : '' // 综合
            Zyici.push(Z)
            Zliubian.push(ZL)
            Zzonghe.push(ZZ)
          }
        })
        item.classes.map(item3 => {
          if (item3.production_class === '早班') {
            const Zb = item3.yc_percent_of_pass ? item3.yc_percent_of_pass.replace(/%/g, '') : '' // 一次// 一次
            const Zbz = item3.lb_percent_of_pass ? item3.lb_percent_of_pass.replace(/%/g, '') : ''// 流变
            const zbz = item3.zh_percent_of_pass ? item3.zh_percent_of_pass.replace(/%/g, '') : ''// 综合
            Zbyici.push(Zb)
            Zbliubian.push(Zbz)
            Zbzonghe.push(zbz)
          }
        })
      })
      this.option.xAxis.data = daydatas
      this.option.series[0].data = yici
      this.option.series[1].data = liubian
      this.option.series[2].data = zonghe

      this.option.series[3].data = Zyici
      this.option.series[4].data = Zliubian
      this.option.series[5].data = Zzonghe

      this.option.series[6].data = Zbyici
      this.option.series[7].data = Zbliubian
      this.option.series[8].data = Zbzonghe
      console.log('this.option.series[0].data', this.option.series[0].data)
    }
  }
}
</script>
<style scoped lang='less'>

</style>
