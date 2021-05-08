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
    chartsdata: {
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
          text: '月快检合格率'
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
          // type: 'value',
          name: '合格率%/数量'
          // axisLine: {
          //   show: false // y轴线消失
          // },
          // axisTick: {
          //   show: false // y轴坐标点消失

          // }
        },
        dataZoom: [
          {
            show: true,
            start: 94,
            end: 100
          }
        ],
        series: [
          {
            name: '一次',
            type: 'bar',

            // data: [10.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            data: []
          },
          {
            name: '流变',
            type: 'bar',

            data: []
          },
          {
            name: '综合',
            type: 'bar',
            fontSize: '10',
            data: []
          },
          {
            name: 'ML1+4',
            type: 'bar',

            data: []
          },
          {
            name: 'ML1-4',
            type: 'bar',

            data: []
          },
          {
            name: 'MH+',
            type: 'bar',

            data: []
          },
          {
            name: 'MH-',
            type: 'bar',

            data: []
          },
          {
            name: 'TC10+',
            type: 'bar',

            data: []
          },
          {
            name: 'TC10-',
            type: 'bar',

            data: []
          },
          {
            name: 'TC50+',
            type: 'bar',
            fontSize: '10',
            data: []
          },
          {
            name: 'TC50-',
            type: 'bar',

            data: []
          },
          {
            name: 'TC90+',
            type: 'bar',

            data: []
          },
          {
            name: 'TC90-',
            type: 'bar',

            data: []
          },
          {
            name: '比重值+',
            type: 'bar',
            data: []
          },
          {
            name: '比重值-',
            type: 'bar',
            data: []
          },
          {
            name: '硬度值+',
            type: 'bar',

            data: []
          },
          {
            name: '硬度值-',
            type: 'bar',

            data: []
          },
          {
            name: 'ML14+',
            type: 'line',
            data: []
          },
          {
            name: 'ML14-',
            type: 'line',
            data: []
          },
          {
            name: 'MH+',
            type: 'line',
            data: []
          },
          {
            name: 'MH-',
            type: 'line',
            data: []
          },
          {
            name: 'TC10+',
            type: 'line',
            data: []
          },
          {
            name: 'TC10-',
            type: 'line',
            data: []
          },
          {
            name: 'TC50+',
            type: 'line',
            data: []
          },
          {
            name: 'TC50-',
            type: 'line',
            data: []
          },
          {
            name: 'TC90+',
            type: 'line',
            data: []
          },
          {
            name: 'TC90-',
            type: 'line',
            data: []
          },
          {
            name: '比重值+',
            type: 'line',
            data: []
          },
          {
            name: '比重值-',
            type: 'line',
            data: []
          },
          {
            name: '硬度值+',
            type: 'line',
            data: []
          },
          {
            name: '硬度值-',
            type: 'line',
            data: []
          }
        ]
      }
    }
  },
  watch: {
    chartsdata: {
      deep: true, // true 深度监听
      handler() {
        this.drawLine()
        const myChart = echarts.init(this.$refs.myChart)
        myChart.setOption(this.option)
      }
    }

  },
  created() {
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
      const array = this.chartsdata
      const daydatas = []
      const yici = []
      const liubian = []
      const zonghe = []
      const ML1ad = []
      const ML1Lower = []
      const MHad = []
      const MHLower = []
      const TCad = []
      const TCLower = []
      const TCWad = []
      const TCWLower = []
      const TCJad = []
      const TCJLower = []
      const BZZad = []
      const BZZLower = []
      const YDZad = []
      const YDZLower = []
      // 折现
      const zMLad = []
      const zMLLower = []

      const zMHad = []
      const zMHLower = []

      const zTCad = []
      const zTCLower = []

      const zTCWad = []
      const zTCWLower = []

      const zTCJad = []
      const zTCJLower = []
      const zBZZad = []
      const zBZZLower = []
      const zYDZad = []
      const zYDZLower = []
      array.forEach(item => {
        const day = dayjs(item.date).format('YYYY-MM')
        const D = item.yc_percent_of_pass ? item.yc_percent_of_pass.replace(/%/g, '') : '' // 一次
        const E = item.lb_percent_of_pass ? item.lb_percent_of_pass.replace(/%/g, '') : '' // 流变
        const F = item.zh_percent_of_pass ? item.zh_percent_of_pass.replace(/%/g, '') : '' // 综合

        daydatas.push(day)
        yici.push(D)
        liubian.push(E)
        zonghe.push(F)
        item.points.forEach(item2 => {
          // console.log('item2', item2)
          if (item2.name === 'ML1+4') {
            const G = item2.upper_limit_percent ? item2.upper_limit_percent.replace(/%/g, '') : '' // ML1+4
            const H = item2.lower_limit_percent ? item2.lower_limit_percent.replace(/%/g, '') : '' // ML1-4
            ML1ad.push(G)
            ML1Lower.push(H)
            //  折现
            const zml = item2.upper_limit_count
            const zmll = item2.lower_limit_count // ML1-4
            zMLad.push(zml)
            zMLLower.push(zmll)
          } else if (item2.name === 'MH') {
            const M = item2.upper_limit_percent ? item2.upper_limit_percent.replace(/%/g, '') : ''
            const Ml = item2.lower_limit_percent ? item2.lower_limit_percent.replace(/%/g, '') : ''
            MHad.push(M)
            MHLower.push(Ml)
            //  折现
            const zM = item2.upper_limit_count
            const zMl = item2.lower_limit_count
            zMHad.push(zM)
            zMHLower.push(zMl)
          } else if (item2.name === 'TC10') {
            const TC = item2.upper_limit_percent ? item2.upper_limit_percent.replace(/%/g, '') : ''
            const TCl = item2.lower_limit_percent ? item2.lower_limit_percent.replace(/%/g, '') : ''
            TCad.push(TC)
            TCLower.push(TCl)
            //  折现
            const zTC = item2.upper_limit_percent ? item2.upper_limit_percent.replace(/%/g, '') : ''
            const zTCl = item2.lower_limit_percent ? item2.lower_limit_percent.replace(/%/g, '') : ''
            zTCad.push(zTC)
            zTCLower.push(zTCl)
          } else if (item2.name === 'TC50') {
            const TCw = item2.upper_limit_percent ? item2.upper_limit_percent.replace(/%/g, '') : ''
            const TCwL = item2.lower_limit_percent ? item2.lower_limit_percent.replace(/%/g, '') : ''
            TCWad.push(TCw)
            TCWLower.push(TCwL)
            //  折现
            const zTCw = item2.upper_limit_count
            const zTCwL = item2.lower_limit_count
            zTCWad.push(zTCw)
            zTCWLower.push(zTCwL)
          } else if (item2.name === 'TC90') {
            const TCj = item2.upper_limit_percent ? item2.upper_limit_percent.replace(/%/g, '') : ''
            const TCJl = item2.lower_limit_percent ? item2.lower_limit_percent.replace(/%/g, '') : ''
            TCJad.push(TCj)
            TCJLower.push(TCJl)
            //  折现
            const zTCj = item2.upper_limit_count
            const zTCJl = item2.lower_limit_count
            zTCJad.push(zTCj)
            zTCJLower.push(zTCJl)
          } else if (item2.name === '比重值') {
            const bzz = item2.upper_limit_percent ? item2.upper_limit_percent.replace(/%/g, '') : ''
            const bzzL = item2.lower_limit_percent ? item2.lower_limit_percent.replace(/%/g, '') : ''
            BZZad.push(bzz)
            BZZLower.push(bzzL)
            //  折现
            const zbzz = item2.upper_limit_count
            const zbzzL = item2.lower_limit_count
            zBZZad.push(zbzz)
            zBZZLower.push(zbzzL)
          } else if (item2.name === '硬度值') {
            const ydz = item2.upper_limit_percent ? item2.upper_limit_percent.replace(/%/g, '') : ''
            const ydzL = item2.lower_limit_percent ? item2.lower_limit_percent.replace(/%/g, '') : ''
            YDZad.push(ydz)
            YDZLower.push(ydzL)
            //  折现
            const zydz = item2.upper_limit_count
            const zydzL = item2.lower_limit_count
            zYDZad.push(zydz)
            zYDZLower.push(zydzL)
          }
        })
      })
      // console.log('day', daydatas)
      this.option.xAxis.data = daydatas
      this.option.series[0].data = yici
      this.option.series[1].data = liubian
      this.option.series[2].data = zonghe
      this.option.series[3].data = ML1ad
      this.option.series[4].data = ML1Lower
      this.option.series[5].data = MHad
      this.option.series[6].data = MHLower
      this.option.series[7].data = TCad
      this.option.series[8].data = TCLower
      this.option.series[9].data = TCWad
      this.option.series[10].data = TCWLower
      this.option.series[11].data = TCJad
      this.option.series[12].data = TCJLower
      this.option.series[13].data = BZZad
      this.option.series[14].data = BZZLower
      this.option.series[15].data = YDZad
      this.option.series[16].data = YDZLower

      this.option.series[17].data = zMLad
      this.option.series[18].data = zMLLower
      this.option.series[19].data = zMHad
      this.option.series[20].data = zMHLower
      this.option.series[21].data = zTCad
      this.option.series[22].data = zTCLower
      this.option.series[23].data = zTCWad
      this.option.series[24].data = zTCWLower
      this.option.series[25].data = zTCJad
      this.option.series[26].data = zTCJLower
      this.option.series[27].data = zBZZad
      this.option.series[28].data = zBZZLower
      this.option.series[29].data = zYDZad
      this.option.series[30].data = zYDZLower
      console.log('this.option.series[18].data', this.option.series[18].data)
    }
  }
}
</script>
<style scoped lang='less'>

</style>
