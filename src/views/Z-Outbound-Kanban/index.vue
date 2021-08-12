<template>
  <div class="kanban-style">
    <!-- 出库看板 大屏 -->
    <h2 class="head-style">{{ obj.warehouse_name }}-运行综合看板</h2>
    <div class="top-center">
      {{ obj.warehouse_name }}
      出库口:
      <el-select v-model="obj.station_id" placeholder="请选择" @visible-change="visibleChangeStation" @change="changeStation">
        <el-option
          v-for="item in optionsStation"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <span class="top-right-style">
        <span>总入库数：{{ obj1.total_inbound_count }}</span>
        <span>总出库数：{{ obj1.total_outbound_count }}</span>
        <span>{{ dataTime }}</span>
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
              prop="finish_time"
              label="出库时间"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop=""
              label="出库员"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="production_info.production_info"
              label="生产日期"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="production_info.classes"
              label="班次"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="production_info.equip_no"
              label="机台"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="memo"
              label="车次"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="material_no"
              label="胶料编码"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="pallet_no"
              label="托盘号"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="inventory_reason"
              label="品质"
              min-width="20"
              align="center"
            />
            <el-table-column
              prop="order_type"
              label="出库类型"
              align="center"
              min-width="20"
            />
            <el-table-column
              prop="destination"
              label="目标去向"
              min-width="20"
              align="center"
            />
          </el-table-column>
        </el-table>
      </div>
      <el-row :gutter="20" style="margin-top: 20px;overflow:hidden">
        <el-col :span="13">
          <el-table
            :data="obj1.data"
            border
            style="width: 100%;"
            :span-method="objectSpanMethod"
          >
            <el-table-column :label="`${dataTime.split(' ')[0]}（24小时）入出库统计信息`" align="center">
              <el-table-column
                prop="tunnel"
                label="巷道"
                min-width="10"
                align="center"
              />
              <el-table-column
                prop="in_bound_count"
                label="入库"
                min-width="10"
                align="center"
              />
              <el-table-column
                prop="out_bound_count"
                label="出库"
                min-width="10"
                align="center"
              />
              <el-table-column
                prop="all"
                label="入库率（胶料入库数/生产数）"
                min-width="20"
                align="center"
              />
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="11">
          <div style="width:100%;height:34vh;display:flex">
            <div v-for="(item,i) in listPie" :id="'tunnel'+i" :key="i" style="width:100%;height:100%" />
          </div>
        </el-col>
        <!-- <el-col :span="6"><div class="bar-right-style">
          <div id="barTunnel" style="width:100%;height:100%" />
        </div></el-col> -->
      </el-row>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { stationInfo } from '@/api/warehouse'
import { outBoundTasks, inoutBoundSummary } from '@/api/base_w_four'
import { setDate } from '@/utils'
export default {
  data() {
    return {
      // '1':'终炼出库运行看板
    //   '2': 混炼出库运行看板
      obj: { station_id: '' },
      tableData: [],
      obj1: {},
      listPie: [{}, {}, {}],
      optionsStation: [],
      dataTime: setDate(null, true),
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
          top: 'bottom',
          left: '2%'
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
            center: ['50%', '40%'],
            labelLine: {
              show: false
            },
            data: []
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
    // console.log(this.$route.params)
    this.obj = { warehouse_name: '混炼胶库' }
    if (this.$route.params.id === '1') {
      this.obj = { warehouse_name: '终炼胶库' }
    }
    this.getStation()
    this._setInterval = setInterval(() => {
      this.getOutBoundTasks()
      this.getInoutBoundSummary()
    }, 10000)
  },
  mounted() {
  },
  destroyed() {
    clearInterval(this._setInterval)
  },
  methods: {
    async getStation(bool) {
      try {
        const data = await stationInfo({ all: 1, warehouse_name: this.obj.warehouse_name })
        this.optionsStation = data
        this.$set(this.obj, 'station_id', data[0].id)

        this.getOutBoundTasks()
        this.getInoutBoundSummary()
      } catch (e) {
        //
      }
    },
    visibleChangeStation(bool) {
      if (bool) {
        // this.getStation(true)
      }
    },
    changeStation() {
      this.getOutBoundTasks()
      this.getInoutBoundSummary()
    },
    async getOutBoundTasks() {
      try {
        this.obj.page_size = 50
        const data = await outBoundTasks('get', null, { params: this.obj })
        this.tableData = data.results || []
      } catch (e) {
        //
      }
    },
    async getInoutBoundSummary() {
      try {
        const data = await inoutBoundSummary('get', null, { params: this.obj })
        const a = data
        let b = 0
        if (a.production_count && a.total_inbound_count) {
          b = (a.total_inbound_count / a.production_count * 100).toFixed(2)
        }
        const all = a.total_inbound_count + ' / ' + a.production_count + ' / ' + b + '%'

        this.obj1 = JSON.parse(JSON.stringify(data))

        this.obj1.data[0].all = all
        this.obj1.data.push({ tunnel: '合计(24小时)', in_bound_count: data.total_inbound_count,
          out_bound_count: data.total_outbound_count })

        const arr = []
        const arr1 = []
        const arr2 = []
        data.data.forEach(d => {
          arr.push({ value: d.in_bound_count, name: d.tunnel })
          arr1.push({ value: d.out_bound_count, name: d.tunnel })
        })

        const no_out = data.production_count - data.total_inbound_count
        arr2.push({ value: no_out, name: '未入库' },
          { value: data.total_inbound_count, name: '已入库' })
        this.listPie = [arr, arr1, arr2]

        this.getEcharts()
      } catch (e) {
        //
      }
    },
    getEcharts() {
      this.$nextTick(() => {
        this.listPie.forEach((d, i) => {
          var chartDom = document.getElementById(`tunnel${i}`)
          var myChart = echarts.init(chartDom)
          this.option.title.text = i === 0 ? '入库' : i === 1 ? '出库' : '入库率'
          this.option.series[0].data = d
          myChart.setOption(this.option, true)
        })

        // var chartDom1 = document.getElementById(`barTunnel`)
        // var myChart1 = echarts.init(chartDom1)
        // myChart1.setOption(this.option1, true)
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label === '入库率（胶料入库数/生产数）') {
        return {
          rowspan: 999999,
          colspan: 1
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table{
        font-size: 1.1em;
}
.kanban-style{
    font-size: 16px;
    height: 100vh;
    overflow: hidden;
    span,div{
        font-size: 1.1em;
    }
    .el-table td, .el-table th{
        padding:  0.7em 0 !important;
    }
}
    .head-style{
        text-align: center;
        height:4vh;
        overflow: hidden;
    }
    .top-center{
       padding:0 1.5em;
    //    height:6vh;
       overflow: hidden;
       .top-right-style{
            float: right;
            align-items: center;
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
