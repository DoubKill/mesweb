<template>
  <div>
    <!-- 切换时间管控 -->
    <h3>{{ type==='明细'?'切换时间管控':'规格切换时间汇总' }}</h3>
    <el-form :inline="true">
      <el-form-item label="工厂时间">
        <el-date-picker
          v-model="dateValue"
          type="datetimerange"
          :clearable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="班次:">
        <class-select
          style="width: 150px;"
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="班组">
        <el-select
          v-model="search.group"
          style="width: 150px;"
          clearable
          placeholder="请选择"
          @change="groupChanged"
          @visible-change="getClassGroup"
        >
          <el-option
            v-for="group in groups"
            :key="group.id"
            :label="group.global_name"
            :value="group.global_name"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="时间:">
        <el-date-picker
          v-model="search.st"
          type="date"
          placeholder="日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item> -->
      <!-- <el-form-item>
        <el-radio-group v-model="search.radio">
          <el-radio :label="1">自然日</el-radio>
          <el-radio :label="2">工厂时间</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <br> -->
      <!-- <el-form-item label="时间跨度:">
        <time-span-select
          :equip_no_props.sync="search.equip_no"
          @changeSearch="timeSpanChanged"
        />
      </el-form-item> -->
      <el-form-item
        v-if="type==='明细'"
        label="机台"
      >
        <equip-select
          :equip_no_props.sync="search.equip_no"
          :is-created="true"
          @changeSearch="equipChanged"
        />
      </el-form-item>
      <!-- <el-form-item label="时间单位:">
        <el-select v-model="timeUnit" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button
          :loading="btnExportLoad"
          type="primary"
          @click="changeType"
        >{{ type==='汇总'?'查看明细':'查看汇总' }}</el-button>
        <el-button
          :loading="btnExportLoad"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button
          v-if="type==='汇总'"
          type="primary"
          @click="lookAll(1)"
        >按机台查看图表</el-button>
        <el-button
          v-if="type==='汇总'"
          type="primary"
          @click="lookAll(2)"
        >按班次查看图表</el-button>
        <el-button
          v-if="type==='汇总'"
          type="primary"
          @click="lookAll(3)"
        >按日期查看图表</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-form v-show="type==='明细'" :inline="true">
      <el-form-item
        :label="'总耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.sum_time }}</span>
        <span v-else>{{ allData.sum_time |setTimeMin }}</span>
      </el-form-item>
      <el-form-item
        :label="'最小耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.min_time }}</span>
        <span v-else>{{ allData.min_time |setTimeMin }}</span>
      </el-form-item>
      <el-form-item
        :label="'最大耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.max_time }}</span>
        <span v-else>{{ allData.max_time |setTimeMin }}</span>
      </el-form-item>
      <el-form-item
        :label="'平均耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.avg_time }}</span>
        <span v-else>{{ allData.avg_time |setTimeMin }}</span>
      </el-form-item>
    </el-form> -->
    <div v-show="type==='明细'">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
      >
        <el-table-column
          type="index"
          label="No"
        />
        <el-table-column
          prop="time"
          label="时间"
          width="100"
        />
        <el-table-column
          prop="equip_no"
          label="设备编码"
          width="80"
        />
        <el-table-column
          prop="plan_classes_uid_age"
          label="切换前计划号"
          width="260"
        />
        <el-table-column
          prop="plan_classes_uid_later"
          label="切换后计划号"
          width="260"
        />
        <el-table-column
          prop="cut_ago_product_no"
          label="切换前胶料编码"
        />
        <el-table-column
          prop="cut_later_product_no"
          label="切换后胶料编码"
        />
        <el-table-column
          prop="standard_time"
          label="切换时间规格标准"
        />
        <el-table-column
          sortable
          prop="normal_cut_time_consumer"
          label="切换规格耗时/秒"
        />
        <!-- <el-table-column
          :label="'切换规格耗时/'+(timeUnit==='秒'?'秒':'min')"
        >
          <template slot-scope="{row}">
            <span v-if="timeUnit==='秒'">{{ row.time_consuming }}</span>
            <span v-else>{{ row.time_consuming |setTimeMin }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          sortable
          prop="err_cut_time_consumer"
          label="异常时间(秒)"
          width="120"
        />
        <el-table-column
          sortable
          prop="rate"
          label="切换时间规格完成率"
          width="180"
        />
      </el-table>
      <page
        :old-page="false"
        :total="total"
        :current-page="search.page"
        @currentChange="currentChange"
      />
    </div>

    <div v-show="type==='汇总'">
      <el-table
        id="out-table"
        v-loading="loading"
        max-height="650px"
        :data="tableData1"
        border
      >
        <el-table-column
          prop="factory_date"
          label="日期"
          width="90"
        />
        <el-table-column
          prop="classes"
          label="班次"
          width="60"
        />
        <el-table-column
          prop="group"
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
              :prop="d+'normal_cut_time_consumer'"
              label="换规格时间(秒)"
              width="70"
            >
              <template slot-scope="{row}">
                <span>{{ row[d+'normal_cut_time_consumer']*10!==0?row[d+'normal_cut_time_consumer']:null }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :prop="d+'err_cut_time_consumer'"
              label="异常耗时(秒)"
              width="60"
            >
              <template slot-scope="{row}">
                <span>{{ row[d+'err_cut_time_consumer']*10!==0?row[d+'err_cut_time_consumer']:null }}</span>
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
            prop="true"
            label="换规格时间(秒)"
            width="70"
          >
            <template slot-scope="{row}">
              <span>{{ row.true*10!==0?row.true:null }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="error"
            label="异常耗时(秒)"
            width="60"
          >
            <template slot-scope="{row}">
              <span>{{ row.error*10!==0?row.error:null }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>

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
        id="echartsBox"
        v-loading="loadingDialog"
      >
        <el-col
          :span="24"
        >
          <div
            id="equipEchart0"
            style="width: 100%;height:300px;margin-top:8px"
          />
        </el-col>
      </el-row>
      <el-row
        v-else
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
import equipSelect from '@/components/select_w/equip'
import classSelect from '@/components/ClassSelect'
import page from '@/components/page'
import { cutTimeCollectSummary, cutTimeAnalysis } from '@/api/jqy'
import { cutTimeCollect, globalCodesUrl } from '@/api/base_w'
// import timeSpanSelect from '@/components/select_w/timeSpan'
import { exportExcel, setDate } from '@/utils/index'
export default {
  name: 'SpecsSwitchSummary',
  components: { page, equipSelect, classSelect },
  data() {
    return {
      type: '明细',
      groups: [],
      equipList: ['Z01', 'Z02', 'Z03', 'Z04', 'Z05', 'Z06', 'Z07', 'Z08', 'Z09', 'Z10', 'Z11', 'Z12', 'Z13', 'Z14', 'Z15'],
      dateValue: [setDate() + ' 08:00:00', getNextDate(setDate(), 1) + ' 08:00:00'],
      total: 0,
      historyDialogVisible: false,
      loadingDialog: false,
      arrData: [],
      lookType: 1,
      loading: false,
      search: {
        page: 1,
        equip_no: ''
      },
      allData: {},
      tableData: [],
      tableData1: [],
      btnExportLoad: false,
      options: ['秒', '分钟'],
      timeUnit: '秒',
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
          data: ['标准切换时间', '实际切换时间']
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
            name: '秒',
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
            name: '标准切换时间',
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
            name: '实际切换时间',
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
    // this.getList()
  },
  methods: {
    changeType() {
      if (this.type === '明细') {
        delete this.search.page
        delete this.search.equip_no
        this.type = '汇总'
        this.getList1()
      } else {
        this.search.page = 1
        this.type = '明细'
      }
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
    classChanged(val) {
      this.search.classes = val
      if (this.type === '明细') {
        this.search.page = 1
        this.getList()
      } else {
        delete this.search.page
        delete this.search.equip_no
        this.getList1()
      }
    },
    groupChanged() {
      if (this.type === '明细') {
        this.search.page = 1
        this.getList()
      } else {
        delete this.search.page
        delete this.search.equip_no
        this.getList1()
      }
    },
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
        const data = await cutTimeAnalysis('get', null, { params: obj })
        this.arrData = data
        var ops = []
        data.forEach((d, _i) => {
          ops.push(JSON.parse(JSON.stringify(this.option)))
          ops[_i].title.text = d.title
          ops[_i].xAxis[0].data = d.axis || []
          ops[_i].series[0].data = d.standard || []
          ops[_i].series[1].data = d.actual || []
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
    exportTable() {
      if (this.type === '明细') {
        this.btnExportLoad = true
        const obj = Object.assign({ export: 1 }, this.search)
        cutTimeCollect('get', null, { params: obj, responseType: 'blob' })
          .then(res => {
            const link = document.createElement('a')
            const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            link.download = `切换时间管控${setDate('', true)}.xlsx` // 下载的文件名
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            this.btnExportLoad = false
          }).catch(e => {
            this.btnExportLoad = false
          })
      } else {
        exportExcel('切换时间管控')
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await cutTimeCollect('get', null, { params: this.search })
        this.total = data.count
        // this.allData = data.results.pop() || {}
        this.tableData = data.results || []
        if (this.tableData.length > 0) {
          this.tableData.push({
            time: '平均',
            err_cut_time_consumer: data.avg_error,
            normal_cut_time_consumer: data.avg_normal,
            rate: data.avg_rate + '%'
          })
        }
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    async getList1() {
      try {
        this.loading = true
        const data = await cutTimeCollectSummary('get', null, { params: this.search })
        this.tableData1 = data || []
        if (this.tableData1.length > 0) {
          this.tableData1.forEach((d, index) => {
            this.tableData1[index].true = 0
            var i = 0
            this.tableData1[index].error = 0
            var k = 0
            Object.keys(this.tableData1[index]).forEach(d => {
              if (d.indexOf('normal_cut_time_consumer') !== -1) {
                if (this.tableData1[index][d] !== null) {
                  this.tableData1[index].true += this.tableData1[index][d]
                  i++
                }
              }
              if (d.indexOf('err_cut_time_consumer') !== -1) {
                if (this.tableData1[index][d] !== null) {
                  this.tableData1[index].error += this.tableData1[index][d]
                  k++
                }
              }
            })
            this.tableData1[index].true = (i !== 0 ? (this.tableData1[index].true / i).toFixed(0) : null)
            this.tableData1[index].error = (k !== 0 ? (this.tableData1[index].error / k).toFixed(0) : null)
          })
        }
        if (this.tableData1.length > 0) {
          this.tableData1.push({
            factory_date: '平均值',
            true: (sum(this.tableData1, 'true') / (sumNull(this.tableData1, 'true'))).toFixed(0),
            error: (sum(this.tableData1, 'error') / (sumNull(this.tableData1, 'error'))).toFixed(0)
          })
          const index = this.tableData1.length
          this.equipList.forEach(d => {
            this.tableData1[index - 1][d + 'normal_cut_time_consumer'] = (sum(this.tableData1, [d] + 'normal_cut_time_consumer') / (sumNull(this.tableData1, [d] + 'normal_cut_time_consumer'))).toFixed(0)
            this.tableData1[index - 1][d + 'err_cut_time_consumer'] = (sum(this.tableData1, [d] + 'err_cut_time_consumer') / (sumNull(this.tableData1, [d] + 'err_cut_time_consumer'))).toFixed(0)
          })
        }
        this.loading = false
      } catch (error) {
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
      if (this.type === '明细') {
        this.search.page = 1
        this.getList()
      } else {
        delete this.search.page
        delete this.search.equip_no
        this.getList1()
      }
    },
    equipChanged(val) {
      this.search.equip_no = val
      this.search.page = 1
      this.getList()
    }
  }
}
function getNextDate(date, day) {
  var dd = new Date(date)
  dd.setDate(dd.getDate() + day)
  var y = dd.getFullYear()
  var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1
  var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
  return y + '-' + m + '-' + d
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

<style>

</style>
