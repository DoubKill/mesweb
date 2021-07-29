<template>
  <div class="kanban-style">
    <!-- 出库看板 大屏 -->
    <h2 class="head-style">{{ id==='1'?'终炼库':'混炼库' }}-运行综合看板</h2>
    <div class="top-center">
      混炼胶立库  1层库前出库口
      <span class="top-right-style">
        <span>总入库数：111</span>
        <span>总出库数：333</span>
        <span>2021-07-19 10:20:30</span>
      </span>
    </div>
    <div class="center-style">
      <div class="tableData-style">
        <el-table
          :data="tableData"
          style="width: 100%;margin-top:10px"
          border
        >
          <el-table-column label="出库履历信息" align="center">
            <el-table-column
              prop="date"
              label="出库时间"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="date"
              label="出库员"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="date"
              label="生产日期"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="date"
              label="班次"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="date"
              label="机台"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="date"
              label="车次"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="date"
              label="胶料编码"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="date"
              label="托盘号"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="date"
              label="品质"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="date"
              label="出库类型"
              align="center"
              min-width="20"
            />
            <el-table-column
              prop="date"
              label="目标去向"
              min-width="20"
              align="center"
            />
          </el-table-column>
        </el-table>
      </div>
      <el-row :gutter="20" style="margin-top: 20px;overflow:hidden">
        <el-col :span="11">
          <el-table
            :data="tableData1"
            border
            :summary-method="getSummaries"
            show-summary
            style="width: 100%;"
          >
            <el-table-column label="出库履历信息" align="center">
              <el-table-column
                prop="id"
                label="巷道"
                min-width="10"
                align="center"
              />
              <el-table-column
                prop="id"
                label="入库"
                min-width="10"
                align="center"
              />
              <el-table-column
                prop="id"
                label="出库"
                min-width="10"
                align="center"
              />
              <el-table-column
                prop="id"
                label="入库率（胶料入库数/生产数）"
                min-width="20"
                align="center"
              />
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="7"><div style="width:100%;height:30vh;display:flex">
          <div v-for="(item,i) in listPie" :id="'tunnel'+i" :key="i" style="width:100%;height:100%" />
        </div></el-col>
        <el-col :span="6"><div class="bar-right-style">
          <div id="barTunnel" style="width:100%;height:100%" />
        </div></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      // '1':'终炼出库运行看板1、2、3、4四个巷道'; '2':混炼出库运行看板3、4两个巷道
    //   '3': 混炼出库运行看板1、2巷道
      id: '1',
      tableData: [],
      tableData1: [],
      listPie: [{}, {}, {}, {}],
      option: {
        title: {
          text: '1巷道',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          top: 'bottom'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['30%', '70%'],
            label: {
              normal: {
                formatter: '{c}',
                position: 'inside'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: '搜索引擎' },
              { value: 735, name: '直接访问' }
            ]
          }
        ]
      },
      option1: {
        title: {
          text: '入库率',
          left: 'center'
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', '11', '44']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 120, 200],
          type: 'bar'
        }]
      }
    }
  },
  created() {
    console.log(this.$route.params)
  },
  destroyed() {
    window.clearInterval(this._setInterval)
  },
  mounted() {
    this.getEcharts()
    this._setInterval = setInterval(() => {
      this.getEcharts()
    }, 10000)
  },
  methods: {
    getSummaries() {
      return 111
    },
    getEcharts() {
      this.$nextTick(() => {
        this.listPie.forEach((d, i) => {
          var chartDom = document.getElementById(`tunnel${i}`)
          var myChart = echarts.init(chartDom)
          this.option.title.text = i + 1 + '巷道'
          myChart.setOption(this.option, true)
        })

        var chartDom1 = document.getElementById(`barTunnel`)
        var myChart1 = echarts.init(chartDom1)
        myChart1.setOption(this.option1, true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.kanban-style{
    font-size: 16px;
    height: 100vh;
    overflow: hidden;
}
    .head-style{
        text-align: center;
        height:4vh;
        overflow: hidden;
    }
    .top-center{
       padding:0 1.5em;
       height:3vh;
       overflow: hidden;
       .top-right-style{
            float: right;
            span{
                margin-left:1.5em;
            }
        }
    }
    .center-style{
        padding:0 1.5em;
        .tableData-style{
           height: 50vh;
            overflow: hidden;
        }
        .bar-right-style{
            height:30vh;
            border:1px solid #eee;
            width:100%;
        }
    }
</style>
