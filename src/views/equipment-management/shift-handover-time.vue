<template>
  <div>
    <!-- 交接班时间管理 -->
    <el-form :inline="true">
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          :clearable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="班次:">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <!-- <el-form-item label="班组">
        <el-select
          v-model="search.group"
          clearable
          placeholder="请选择"
          @change="getList"
          @visible-change="getClassGroup"
        >
          <el-option
            v-for="group in groups"
            :key="group.id"
            :label="group.global_name"
            :value="group.global_name"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          @click="exportTable()"
        >导出Excel</el-button>
        <el-button
          type="primary"
          @click="lookAll(1)"
        >按机台查看图表</el-button>
        <el-button
          type="primary"
          @click="lookAll(2)"
        >按班次查看图表</el-button>
        <el-button
          type="primary"
          @click="lookAll(3)"
        >按日期查看图表</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :span-method="arraySpanMethod"
      :data="tableData"
      border
    >
      <el-table-column
        prop="factory_date"
        align="center"
        label="日期"
        width="90"
      />
      <el-table-column
        prop="classes"
        align="center"
        label="班次"
        width="60"
      />
      <el-table-column
        prop="group"
        align="center"
        label="班组"
        width="60"
      />
      <template>
        <el-table-column
          v-for="(d,index) in equipList"
          :key="index"
          align="center"
          :label="d"
          min-width="20"
        >
          <el-table-column
            :prop="d"
            align="center"
            label="交接班耗时(分)"
            width="70"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.factory_date==='交接班时间标准'">{{ scope.row[d+'_time_consuming']*100!==0?scope.row[d+'_time_consuming']:null }}</span>
              <el-link v-if="scope.row.factory_date!=='平均值'&&scope.row.factory_date!=='交接班时间标准'" type="primary" @click="dialog(scope)">{{ scope.row[d+'_time_consuming'] }}</el-link>
              <span v-if="scope.row.factory_date==='平均值'">{{ scope.row[d+'_time_consuming']*100!==0?scope.row[d+'_time_consuming']:null }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :prop="d"
            align="center"
            label="异常耗时(分)"
            width="70"
          >
            <template slot-scope="scope">
              <el-link v-if="scope.row.factory_date!=='平均值'" type="primary" @click="dialog(scope)">{{ scope.row[d+'_time_abnormal'] }}</el-link>
              <span v-else>{{ scope.row[d+'_time_abnormal']*100!==0?scope.row[d+'_time_abnormal']:null }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            :prop="d"
            label="交接班时间标准"
            width="70"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.factory_date!=='平均值'" type="primary">{{ scope.row[d+'_standard_time'] }}</span>
              <span v-else>{{ scope.row[d+'_standard_time']*100!==0?scope.row[d+'_standard_time']:null }}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            :prop="d"
            align="center"
            label="交接班时间完成率"
            width="70"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.factory_date!=='平均值'" type="primary">{{ scope.row[d+'_rate']?scope.row[d+'_rate'] +'%':null }}</span>
              <span v-else>{{ scope.row[d+'_rate']*100!==0?scope.row[d+'_rate']+'%':null }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </template>
      <el-table-column
        prop="count"
        align="center"
        label="班次平均"
        min-width="20"
      >
        <el-table-column
          align="center"
          label="交接班耗时(分)"
          width="70"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.consuming*100!==0?scope.row.consuming:null }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="异常耗时(分)"
          width="60"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.abnormal*100!==0?scope.row.abnormal:null }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      title="交接班时间明细"
      width="20%"
      :visible.sync="dialogVisible"
    >
      <el-table
        v-loading="loading1"
        :data="tableData1"
        border
      >
        <el-table-column
          prop="begin"
          label="开始时间"
          min-width="20"
        />
        <el-table-column
          prop="end"
          label="结束时间"
          min-width="20"
        />
      </el-table>
    </el-dialog>

    <el-dialog
      title="图表详情"
      :visible.sync="historyDialogVisible"
      width="80%"
      append-to-body
    >
      <el-button
        v-if="arrData.length>0"
        style="margin-bottom:10px;margin-left:85%"
        type="primary"
        @click="download"
      >下载图表</el-button>
      <el-row
        v-if="lookType===1"
        id="echartsShift"
        v-loading="loadingDialog"
      >
        <el-col
          :span="24"
        >
          <div
            id="shiftEchart0"
            style="width: 100%;height:300px;margin-top:8px"
          />
        </el-col>
      </el-row>
      <el-row
        v-else
        id="echartsShift"
        v-loading="loadingDialog"
      >
        <el-col
          v-for="(d,i) in arrData"
          :key="i"
          :span="8"
        >
          <div
            :id="'shiftEchart'+i"
            style="width: 100%;height:300px;margin-top:8px"
          />
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import html2canvas from 'html2canvas'
import { shiftTimeSummary, shiftTimeSummaryDetail, shiftTimeAnalysis } from '@/api/jqy'
import page from '@/components/page'
import classSelect from '@/components/ClassSelect'
import { globalCodesUrl } from '@/api/base_w'
import { exportExcel, setDate } from '@/utils/index'
export default {
  name: 'ShiftHandoverTime',
  components: { classSelect, page },
  data() {
    return {
      groups: [],
      historyDialogVisible: false,
      loadingDialog: false,
      arrData: [],
      lookType: 1,
      dateValue: [setDate(null, null, 'month') + '-01', setDate()],
      search: {
        page_size: 10,
        page: 1
      },
      total: 0,
      date: null,
      equipList: ['Z01', 'Z02', 'Z03', 'Z04', 'Z05', 'Z06', 'Z07', 'Z08', 'Z09', 'Z10', 'Z11', 'Z12', 'Z13', 'Z14', 'Z15'],
      dialogVisible: false,
      loading: false,
      loading1: false,
      tableData: [],
      tableData1: [],
      chartHistoryBar: null,
      option: {
        color: ['#0000FF', '#ED7D31'],
        title: {
          left: 'center',
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '6%',
          orient: 'horizontal',
          data: ['标准交接班耗时', '实际交接班耗时']
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
          }
        ],
        series: [
          {
            barWidth: 20,
            barGap: '0%',
            name: '标准交接班耗时',
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
            name: '实际交接班耗时',
            type: 'line',
            yAxisIndex: 0,
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
      }
    }
  },
  created() {
    this.search.st = this.dateValue[0]
    this.search.et = this.dateValue[1]
    this.getList()
  },
  methods: {
    async lookAll(val) {
      this.lookType = val
      if (this.chartHistoryBar) {
        this.chartHistoryBar.dispose()
      }
      try {
        if (getDaysBetween(this.search.st, this.search.et) > 1) {
          this.$message('日期间隔不得大于31天')
          return
        }
        var obj = {
          st: this.search.st,
          et: this.search.et,
          analysis_type: val
        }
        this.historyDialogVisible = true
        this.loadingDialog = true
        const data = await shiftTimeAnalysis('get', null, { params: obj })
        this.arrData = data
        var ops = []
        data.forEach((d, _i) => {
          ops.push(JSON.parse(JSON.stringify(this.option)))
          ops[_i].title.text = d.title
          ops[_i].xAxis[0].data = d.axis || []
          ops[_i].series[0].data = d.standard || []
          ops[_i].series[1].data = d.actual || []
          const a = 'shiftEchart' + _i
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
    download() {
      html2canvas(document.querySelector('#echartsShift')).then(canvas => {
        // 新增代码 返回图片的URL,设置为png格式
        var dataURL = canvas.toDataURL('image/png')
        const creatDom = document.createElement('a')
        document.body.appendChild(creatDom)
        creatDom.href = dataURL
        creatDom.download = '图表'
        creatDom.click()
        document.body.removeChild(creatDom)
      })
    },
    classChanged(val) {
      this.search.classes = val
      this.getList()
    },
    getClassGroup(val) {
      if (val) {
        globalCodesUrl('get', {
          params: {
            class_name: '班组'
          }
        }).then((response) => {
          this.groups = response.results
        }).catch(function() {
        })
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await shiftTimeSummary('get', null, { params: this.search })
        this.tableData = data.results
        if (this.tableData.length > 0) {
          this.tableData.forEach
          this.tableData.push({
            factory_date: '平均值',
            consuming: (sum(this.tableData, 'consuming') / (sumNull(this.tableData, 'consuming'))).toFixed(2),
            abnormal: (sum(this.tableData, 'abnormal') / (sumNull(this.tableData, 'abnormal'))).toFixed(2)
          })
          const index = this.tableData.length
          this.equipList.forEach(d => {
            this.tableData[index - 1][d + '_time_abnormal'] = (sum(this.tableData, [d] + '_time_abnormal') / (sumNull(this.tableData, [d] + '_time_abnormal'))).toFixed(2)
            this.tableData[index - 1][d + '_time_consuming'] = (sum(this.tableData, [d] + '_time_consuming') / (sumNull(this.tableData, [d] + '_time_consuming'))).toFixed(2)
            this.tableData[index - 1][d + '_rate'] = (sum(this.tableData, [d] + '_rate') / (sumNull(this.tableData, [d] + '_rate'))).toFixed(2)
          })
          this.tableData.unshift({
            factory_date: '交接班时间标准'
          })
          this.equipList.forEach(d => {
            this.tableData[0][d + '_time_consuming'] = data.equip_sts_time[d]
          })
        }
        this.total = data.total_data
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    changeDate(arr) {
      this.search.st = arr ? arr[0] : ''
      this.search.et = arr ? arr[1] : ''
      this.getList()
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex / 2 === 0) {
        if (columnIndex < 48) {
          if (columnIndex % 3 === 0) {
            return {
              rowspan: 1,
              colspan: 3
            }
          } else {
            return {
              rowspan: 1,
              colspan: 0
            }
          }
        }
      }
    },
    async dialog(scope) {
      const obj = {
        factory_date: scope.row.factory_date,
        classes: scope.row.classes,
        equip_no: scope.column.property
      }
      this.dialogVisible = true
      try {
        this.loading1 = true
        const data = await shiftTimeSummaryDetail('get', null, { params: obj })
        this.tableData1 = [data.results]
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
      }
    },
    exportTable() {
      exportExcel('交接班时间统计')
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
function sumNull(arr, params) {
  var s = 0
  arr.forEach(d => {
    if (d[params]) {
      s++
    }
  })
  s = s > 0 ? s : 1
  return s
}
function getDaysBetween(dateString1, dateString2) {
  var startDate = Date.parse(dateString1)
  var endDate = Date.parse(dateString2)
  if (startDate > endDate) {
    return 0
  }
  if (startDate === endDate) {
    return 1
  }
  var days = (endDate - startDate) / (31 * 24 * 60 * 60 * 1000)
  return days
}
</script>

<style  lang="scss">
</style>
