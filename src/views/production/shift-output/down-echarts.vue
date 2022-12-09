<template>
  <div class="downEcharts">
    <!-- 各机台停机原因分析图表 -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="searchDate"
        />
      </el-form-item>
      <el-form-item label="机台">
        <el-select
          v-model="search.equip_no"
          placeholder="请选择"
          clearable
          @change="getList"
        >
          <el-option
            v-for="item in optionsEquip"
            :key="item.id"
            :label="item.equip_no"
            :value="item.equip_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left:50px">
        <el-button
          v-permission="['equip_down_summary_table','export']"
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出各机台图表(TOP10)</el-button>
        <el-button
          type="primary"
          @click="lookAll"
        >查看各机台数据</el-button>
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="lookDown"
        >查看班别停机类型汇总</el-button>
      </el-form-item>
    </el-form>

    <div
      id="taskLine"
      v-loading="loading"
      style="width: 100%;height:550px;margin-top:100px"
    />

    <el-dialog
      title="各机台图表(TOP10)"
      :visible.sync="historyDialogVisible"
      width="80%"
      append-to-body
    >
      <!-- <el-button @click="download">123</el-button> -->
      <el-row v-loading="loadingDialog">
        <div id="echartsBox">
          <el-col v-for="(d,i) in arrData" :key="i" :span="8">
            <div
              :id="'historySpot'+i"
              style="width: 100%;height:300px;margin-top:8px"
            />
          </el-col>
        </div>
      </el-row>
    </el-dialog>

    <el-dialog
      title="班别停机类型汇总"
      :visible.sync="dialogVisible"
      width="80%"
      append-to-body
    >
      <div
        id="tableTop"
        v-loading="loadingDialog"
        style="width: 100%;height:300px;margin-top:8px"
      />
      <el-table
        v-loading="loadingDialog"
        :max-height="450"
        :data="tableDataTop"
        border
      >
        <el-table-column
          align="center"
          label="班组"
          prop="group"
        />
        <el-table-column
          v-for="(d,index) in headerTop"
          :key="index"
          align="center"
          :label="d"
          :prop="d"
        />
      </el-table>
      <el-button
        v-permission="['equip_down_summary_table','export']"
        type="primary"
        @click="exportTableDialog"
      >导出班别停机类型汇总Excel</el-button>
      <el-table
        id="out-table"
        v-loading="loadingDialog"
        :max-height="450"
        :span-method="arraySpanMethod"
        :data="tableData"
        border
      >
        <el-table-column
          align="center"
          label="停机原因"
          prop="down_reason"
        />
        <el-table-column
          v-for="(d,index) in header"
          :key="index"
          align="center"
          :label="d"
          :prop="d"
        />
        <el-table-column
          align="center"
          label="总计"
          prop="总计"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { equipDownSummaryTable, equipDownSummaryTableDown } from '@/api/jqy'
import { getEquip } from '@/api/banburying-performance-manage'
import * as echarts from 'echarts'
import { exportExcel } from '@/utils/index'
import { setDate } from '@/utils'
export default {
  name: 'DownEcharts',
  components: { },
  data() {
    return {
      search: {},
      list1: [],
      list2: [],
      header: [],
      dateValue: [setDate(), setDate()],
      btnExportLoad: false,
      loading: false,
      headerTop: [],
      tableDataTop: [],
      arrData: [],
      loadingDialog: false,
      dialogVisible: false,
      optionsEquip: [],
      tableData: [],
      exportTableShow: false,
      historyDialogVisible: false,
      option: {
        color: ['#0000FF', '#ED7D31'],
        title: {
          left: 'center',
          text: '密炼机TOP10停机原因汇总'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '6%',
          orient: 'horizontal',
          data: ['分钟数', '累计百分比']
        },
        toolbox: {
          show: true
        },
        calculable: true,
        grid: {
          x: 60,
          y: 100,
          x2: 60,
          y2: 30
        },
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '分',
            splitLine: {
              show: false
            },
            nameGap: 20
          },
          {
            type: 'value',
            name: '%',
            splitLine: {
              show: false
            },
            nameGap: 20
          }
        ],
        series: [
          {
            barWidth: 20,
            barGap: '0%',
            name: '分钟数',
            type: 'bar',
            yAxisIndex: 0,
            data: [],
            label: {
              color: '#F5FFFF',
              backgroundColor: '#C00000',
              show: true,
              formatter: function(params) {
                if (params.value === 0 || params.value === '0') {
                  return ''
                } else {
                  return params.value
                }
              }
            }
          },
          {
            name: '累计百分比',
            type: 'line',
            yAxisIndex: 1,
            data: [],
            label: {
              position: 'top',
              color: 'black',
              backgroundColor: '#FFFF00',
              show: true,
              formatter: function(params) {
                if (params.value === 0 || params.value === '0') {
                  return ''
                } else {
                  return params.value
                }
              }
            }
          }
        ]
      },
      option1: {
        color: ['#0000FF', '#ED7D31'],
        title: {
          left: 'center',
          text: '密炼机TOP10停机原因汇总'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '6%',
          orient: 'horizontal',
          data: ['分钟数', '累计百分比']
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        calculable: true,
        grid: {
          x: 60,
          y: 100,
          x2: 60,
          y2: 30
        },
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '分',
            splitLine: {
              show: false
            },
            nameGap: 20
          },
          {
            type: 'value',
            name: '%',
            splitLine: {
              show: false
            },
            nameGap: 20
          }
        ],
        series: [
          {
            barWidth: 20,
            barGap: '0%',
            name: '分钟数',
            type: 'bar',
            yAxisIndex: 0,
            data: [],
            label: {
              color: '#F5FFFF',
              backgroundColor: '#C00000',
              show: true,
              formatter: function(params) {
                if (params.value === 0 || params.value === '0') {
                  return ''
                } else {
                  return params.value
                }
              }
            }
          },
          {
            name: '累计百分比',
            type: 'line',
            yAxisIndex: 1,
            data: [],
            label: {
              position: 'top',
              color: 'black',
              backgroundColor: '#FFFF00',
              show: true,
              formatter: function(params) {
                if (params.value === 0 || params.value === '0') {
                  return ''
                } else {
                  return params.value
                }
              }
            }
          }
        ]
      },
      option2: {
        color: ['#5B9BD5', '#ED7D31', '#A5A5A5'],
        title: {
          left: 'center',
          text: '停机类型汇总'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '8%',
          orient: 'horizontal',
          data: []
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        calculable: true,
        grid: {
          x: 60,
          y: 100,
          x2: 60,
          y2: 30
        },
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '分',
            splitLine: {
              show: false
            },
            nameGap: 20
          }
        ],
        series: []
      },
      historySpot: {
        title: [{
          text: "Anscombe's quartet"
        }],
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        legend: {
          top: '6%',
          orient: 'horizontal',
          data: ['分钟数', '累计百分比']
        },
        grid: [
          { left: '7%', top: '7%', width: '38%', height: '38%' }
        ],
        xAxis: [
          { gridIndex: 0 },
          { gridIndex: 1 }
        ],
        yAxis: [
          { gridIndex: 0 },
          { gridIndex: 1 }
        ],
        tooltip: {
          trigger: 'axis'
        },
        // tooltip: {
        //   triggerOn: 'click'
        // },
        series: [
          {
            name: 'I',
            type: 'scatter',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: []
          },
          {
            name: 'II',
            type: 'scatter',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: []
          }
        ]
      }
    }
  },
  created() {
    this.search.st = setDate()
    this.search.et = setDate()
    this.getList()
    this.visibleChange()
  },
  methods: {
    visibleChange() {
      const obj = { all: 1, category_name: '密炼设备' }
      getEquip(obj).then(response => {
        this.optionsEquip = response.results
      })
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipDownSummaryTable('get', null, { params: this.search })
        this.option.title.text = (this.search.equip_no ? this.search.equip_no : '') + '密炼机TOP10停机原因汇总(总' + (data.results.times ? data.results.times : 0) + 'min)'
        this.option.xAxis[0].data = data.results.titles || []
        this.option.series[0].data = data.results.details || []
        this.option.series[1].data = data.results.ratios || []
        this.$nextTick(() => {
          const chartBar = echarts.init(document.getElementById('taskLine'))
          chartBar.setOption(this.option)
        })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async lookDown() {
      try {
        if (document.getElementById('tableTop')) {
          echarts.init(document.getElementById('tableTop')).dispose()
        }
        this.tableData = []
        this.dialogVisible = true
        this.loadingDialog = true
        var equip = ''
        this.optionsEquip.forEach(d => {
          equip += d.equip_no + ','
        })
        equip = equip.substring(0, equip.lastIndexOf(','))
        var obj = {
          st: this.search.st,
          et: this.search.et,
          equip_no: this.search.equip_no ? this.search.equip_no : equip,
          group_flag: 1
        }
        const data = await equipDownSummaryTable('get', null, { params: obj })
        this.option2.xAxis[0].data = data.results.titles || []
        this.option2.legend.data = data.results.groups || []
        var _series = []
        this.headerTop = data.results.titles
        this.tableDataTop = data.results.details
        this.header = data.results.groups
        data.results.groups.forEach(d => {
          _series.push(
            {
              barWidth: 20,
              barGap: '0%',
              name: d,
              type: 'bar',
              data: data.results[d],
              label: {
                show: true,
                formatter: function(params) {
                  if (params.value === 0 || params.value === '0') {
                    return ''
                  } else {
                    return params.value
                  }
                }
              }
            })
        })
        this.option2.series = _series
        this.$nextTick(() => {
          const chartBar = echarts.init(document.getElementById('tableTop'))
          chartBar.setOption(this.option2)
        })
        this.list1 = data.results.reason
        if (this.list1.length > 0) {
          this.list1.unshift({ down_reason: '班别停机原因时长(min)' })
          this.list1.push({
            down_reason: '总计',
            '总计': sum(this.list1, '总计')
          })
          this.header.forEach(d => {
            this.list1[this.list1.length - 1][d] = sum(this.list1, d)
          })
        }
        this.list2 = data.results.ratio
        if (this.list2.length > 0) {
          this.list2.unshift({ down_reason: '停机类型所占比例(%)' })
        }
        this.tableData = this.list1.concat(this.list2)
        this.loadingDialog = false
      } catch (e) {
        this.loadingDialog = false
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 || rowIndex === this.list1.length) {
        if (columnIndex === 0) {
          return [1, this.header.length + 2]
        }
      }
    },
    searchDate(arr) {
      this.search.st = arr ? arr[0] : ''
      this.search.et = arr ? arr[1] : ''
      this.getList()
    },
    download() {
      // var canvas = document.getElementsByTagName('canvas')
      const canvasList = document.getElementsByTagName('canvas')
      const newCanvas = document.createElement('canvas')
      newCanvas.width = 1000
      newCanvas.height = 1000
      const context = newCanvas.getContext('2d')
      canvasList.forEach(item => {
        context.drawImage(item, 0, 0, 200, 200)
        context.globalCompositeOperation = 'xor'
      })
      const exportPdfImg = { url: newCanvas.toDataURL('image/png'), imageWidthHeightRatio: 1000 / 1000 }
      // if (canvas && canvas.length > 0) {
      // console.log(canvas)
      // 创建标签
      var oA = document.createElement('a')
      // 设置下载名称
      oA.download = 'Echarts图表' + '.png'
      // 设置地址以及文件类型
      oA.href = exportPdfImg.url
      document.body.appendChild(oA)
      // 触发下载事件
      oA.click()
      // 移除元素
      oA.remove()
      // }
    },
    exportTableDialog() {
      exportExcel('各班机台停机时间汇总', '综合合格率汇总')
    },
    async lookAll() {
      try {
        this.historyDialogVisible = true
        this.loadingDialog = true
        var equip = ''
        this.optionsEquip.forEach(d => {
          equip += d.equip_no + ','
        })
        equip = equip.substring(0, equip.lastIndexOf(','))
        var obj = {
          st: this.search.st,
          et: this.search.et,
          equip_no: equip,
          table_flag: 1
        }
        const data = await equipDownSummaryTable('get', null, { params: obj })
        this.arrData = data.results
        var ops = []
        // this.arrData.forEach(d => {
        //   ops.push(this.option1)
        // })
        // const _x = []
        // const _y = []
        // const _title = []
        // const _grid = []
        // const _series = []
        // // const _legend = []
        // const _num = Math.ceil(data.results.length / 2) + 3.1
        // const _height = (1 / _num * 100).toFixed(0) + '%'
        // const _height1 = (1 / _num * 100 + 3).toFixed(0)
        data.results.forEach((d, _i) => {
          ops.push(JSON.parse(JSON.stringify(this.option1)))
          //   // if (_i === 0) {
          //   //   _i = 0
          //   // } else {
          //   //   _i = _i + 1
          //   // }
          //   _x.push({
          //     gridIndex: _i,
          //     data: d.titles,
          //     type: 'category'
          //   })
          //   _y.push({
          //     gridIndex: _i,
          //     type: 'value',
          //     name: '分',
          //     splitLine: {
          //       show: false
          //     },
          //     nameGap: 20
          //   },{
          //     gridIndex: _i,
          //     type: 'value',
          //     name: '分',
          //     splitLine: {
          //       show: false
          //     },
          //     nameGap: 20
          //   }
          //   // ,{
          //   //   gridIndex: _i + 1,
          //   //   type: 'value',
          //   //   name: '%',
          //   //   splitLine: {
          //   //     show: false
          //   //   },
          //   //   nameGap: 20
          //   // }
          //   )
          //   if (_i % 2 === 0 || _i === 0) {
          //     const _top1 = (_i / 2) * _height1 + 3 + '%'
          //     const _topTitle1 = (_i / 2) * _height1 + 2 + '%'
          //     _title.push({ text: d.equip_no, left: '40%', top: _topTitle1 })
          //     _grid.push({ left: '3%', top: _top1, width: '40%', height: _height })
          //     // _legend.push({ top: _topTitle1, orient: 'horizontal', data: ['分钟数', '累计百分比'] })
          //   } else {
          //     const _top2 = ((_i - 1) / 2) * _height1 + 3 + '%'
          //     const _topTitle2 = ((_i - 1) / 2) * _height1 + 2 + '%'
          //     _title.push({ text: d.equip_no, right: '8%', top: _topTitle2 })
          //     _grid.push({ right: '7%', top: _top2, width: '40%', height: _height })
          //     // _legend.push({ top: _topTitle2, orient: 'horizontal', data: ['分钟数', '累计百分比'] })
          //   }
          //   _series.push({
          //     name: '分钟',
          //     barGap: '0%',
          //     barWidth: 15,
          //     type: 'bar',
          //     xAxisIndex: _i,
          //     yAxisIndex: _i,
          //     data: d.details
          //   }
          //   , {
          //     name: '百分比',
          //     type: 'line',
          //     xAxisIndex: _i,
          //     yAxisIndex: _i,
          //     data: d.ratios
          //   }
          //   )
          ops[_i].title.text = d.equip_no + '密炼机TOP10停机原因汇总(总' + (d.times ? d.times : 0) + 'min)'
          ops[_i].xAxis[0].data = d.titles || []
          ops[_i].series[0].data = d.details || []
          ops[_i].series[1].data = d.ratios || []
          const a = 'historySpot' + _i
          this.$nextTick(() => {
            this.chartHistoryBar = echarts.init(document.getElementById(a))
            this.chartHistoryBar.setOption(ops[_i])
          })
        })
        // ops.forEach((d, _i) => {
        //   const a = 'historySpot' + _i
        //   const b = 'historySpot' + _i
        //   this.$nextTick(() => {
        //     this.chartHistoryBar = echarts.init(document.getElementById(a))
        //     this.chartHistoryBar.setOption(ops[_i])
        //   })
        // })
        // this.historySpot.xAxis = _x || []
        // this.historySpot.yAxis = _y || []
        // this.historySpot.title = _title || []
        // // this.historySpot.legend = _legend || []
        // this.historySpot.grid = _grid || []
        // this.historySpot.series = _series || []
        // console.log(_series)
        // console.log(_y)

        this.loadingDialog = false
      } catch (e) {
        this.loadingDialog = false
      }
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = { export: 1, st: this.search.st, et: this.search.et }
      const _api = equipDownSummaryTableDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = `各机台图表(TOP10)${setDate('', true)}.xlsx` // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    }
  }
}
function sum(arr, params) {
  var s = 0
  arr.forEach(function(val, idx, arr) {
    const a = val[params] ? Number(val[params]) : 0
    s += a
  }, 0)
  s = Math.round(s * 100) / 100
  return s
}
</script>

<style lang="scss">

</style>
