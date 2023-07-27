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
      <el-button
        v-if="arrData.length>0"
        v-permission="['equip_down_summary_table','export']"
        style="margin-bottom:10px;margin-left:85%"
        type="primary"
        @click="download"
      >下载各机台图表</el-button>
      <el-row
        id="echartsBox"
        v-loading="loadingDialog"
      >
        <el-col
          v-for="(d,i) in arrData"
          :key="i"
          :span="8"
        >
          <div
            :id="'equipEchart'+i"
            style="width: 100%;height:400px;margin-top:8px"
          />
        </el-col>

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
        style="float:right;margin-bottom:10px;margin-top:10px;"
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
import html2canvas from 'html2canvas'
import { equipDownSummaryTable, equipDownSummaryTableDown } from '@/api/jqy'
import { getEquip } from '@/api/banburying-performance-manage'
import * as echarts from 'echarts'
import { exportExcel } from '@/utils/index'
import { setDate } from '@/utils'
export default {
  name: 'DownEcharts',
  components: {},
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
          data: ['分钟数', '百分比']
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
            data: [],
            axisLabel: {
              interval: 0
            }
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
            name: '',
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
            name: '百分比',
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
                  return params.value + '%'
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
          data: ['分钟数', '百分比']
        },
        toolbox: {
          show: true
        },
        calculable: true,
        grid: {
          x: 60,
          y: 100,
          x2: 60,
          y2: 100
        },
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: [],
            axisLabel: {
              formatter: function(data) {
                if (data.length > 7) {
                  return data.substr(0, 7) + '...'
                } else {
                  return data
                }
              },
              interval: 0,
              rotate: 40
            }
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
            name: '',
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
            name: '百分比',
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
            data: [],
            axisLabel: {
              interval: 0
            }
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
          this.list2.unshift({ down_reason: '停机原因所占比例(%)' })
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
      html2canvas(document.querySelector('#echartsBox')).then(canvas => {
        // 新增代码 返回图片的URL,设置为png格式
        var dataURL = canvas.toDataURL('image/png')
        const creatDom = document.createElement('a')
        document.body.appendChild(creatDom)
        creatDom.href = dataURL
        creatDom.download = '各机台图表(TOP10)'
        creatDom.click()
        document.body.removeChild(creatDom)
      })
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
        data.results.forEach((d, _i) => {
          ops.push(deepClone(this.option1))
          ops[_i].title.text = d.equip_no + '密炼机TOP10停机原因汇总(总' + (d.times ? d.times : 0) + 'min)'
          ops[_i].xAxis[0].data = d.titles || []
          ops[_i].series[0].data = d.details || []
          ops[_i].series[1].data = d.ratios || []
          const a = 'equipEchart' + _i
          this.$nextTick(() => {
            this.chartHistoryBar = echarts.init(document.getElementById(a))
            this.chartHistoryBar.setOption(ops[_i])
          })
        })
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

function deepClone(obj) {
  let newObj = null // 声明一个对象来存储拷贝之后的内容
  // 判断数据类型是否是复杂的数据类型，如果是则调用自己，如果不是则直接赋值即可！
  // 由于null不可以循环但是他的类型又是object，所以这个需要对null进行判断
  if (typeof (obj) === 'object' && obj !== null) {
    // 声明一个变量用以存储拷贝出来的值，根据参数的具体数据类型声明不同的类型来存储
    newObj = obj instanceof Array ? [] : {}
    // 循环obj的每一项，如果里面还有复杂的数据类型的话，则直接利用递归函数再次调用。
    for (var i in obj) {
      newObj[i] = deepClone(obj[i])
    }
  } else {
    newObj = obj
  }
  return newObj // 函数没有返回的值的话，则为undefined
}
</script>

<style lang="scss">

</style>
