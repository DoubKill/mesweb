<template>
  <div class="app-container  month_pass_detail">
    <!-- 胶料月合格率统计 -->
    <el-form :inline="true">
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="beginTime"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择日期"
          @change="dateChange"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="endTime"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择日期"
          @change="dateChange"
        />
      </el-form-item>
      <el-form-item label="合格率类型">
        <el-select v-model="value1" multiple placeholder="请选择" @change="changeSearch">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div v-loading="loading">
      <div v-if="value1.length == 0 || value1.indexOf('综合合格率') > -1">
        <el-table
          :data="tableData1"
          size="mini"
          border
          :max-height="(value1.length === 0 || value1.length === 3) ? 200 : value1.length === 1 ? 600 : 280"
          style="width: 100%"
        >
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <span style="padding-right:20px">综合合格率</span>
              <el-select v-model="product_no_value1" multiple size="mini" placeholder="请选择" clearable filterable @change="changeTableData1">
                <el-option
                  v-for="item in tableData"
                  :key="item.product_no"
                  :label="item.product_no"
                  :value="item.product_no"
                />
              </el-select>
              <el-button style="margin-left:20px" type="primary" size="mini" @click="clickChart(1)">图表</el-button>
              <span v-if="false">{{ scope }}</span>
            </template>
            <el-table-column fixed type="index" label="No" align="center" />
            <el-table-column fixed label="胶料编码" min-width="130" align="center">
              <template slot-scope="scope">
                <el-link type="primary" :underline="false" @click="monthPassClick(scope.row.product_no)">{{ scope.row.product_no }}</el-link>
              </template>
            </el-table-column>
            <el-table-column v-for="(value,index) in headers" :key="index" min-width="58" :label="dateFormat(value)" align="center">
              <template slot-scope="scope">
                <span
                  v-if="(scope.row.dates.filter(d=>d.date === value)).length>0"
                  :style="getStyle((scope.row.dates.filter(d=>d.date === value))[0].zh_percent_of_pass)"
                >
                  {{ (scope.row.dates.filter(d=>d.date === value))[0].zh_percent_of_pass }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <div
          v-if="comprehensiveBarShow"
          id="comprehensiveBar"
          style="width: 100%;height:300px"
        />
      </div>
      <div v-if="value1.length == 0 || value1.indexOf('一次合格率') > -1">
        <el-table
          :data="tableData2"
          border
          size="mini"
          :max-height="(value1.length === 0 || value1.length === 3) ? 200 : value1.length === 1 ? 600 : 280"
          style="width: 100%"
        >
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <span style="padding-right:20px">一次合格率</span>
              <el-select v-model="product_no_value2" multiple size="mini" placeholder="请选择" clearable filterable @change="changeTableData2">
                <el-option
                  v-for="item in tableData"
                  :key="item.product_no"
                  :label="item.product_no"
                  :value="item.product_no"
                />
              </el-select>
              <span v-if="false">{{ scope }}</span>
              <el-button style="margin-left:20px" type="primary" size="mini" @click="clickChart(2)">图表</el-button>
            </template>
            <el-table-column fixed type="index" label="No" align="center" />
            <el-table-column fixed label="胶料编码" min-width="130" align="center">
              <template slot-scope="scope">
                <el-link type="primary" :underline="false" @click="monthPassClick(scope.row.product_no)">{{ scope.row.product_no }}</el-link>
              </template>
            </el-table-column>
            <el-table-column v-for="(value,index) in headers" :key="index" min-width="58" :label="dateFormat(value)" align="center">
              <template slot-scope="scope">
                <span
                  v-if="(scope.row.dates.filter(d=>d.date === value)).length>0"
                  :style="getStyle((scope.row.dates.filter(d=>d.date === value))[0].yc_percent_of_pass)"
                >
                  {{ (scope.row.dates.filter(d=>d.date === value))[0].yc_percent_of_pass }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <div
          v-if="firstRateBarShow"
          id="firstRateBar"
          style="width: 100%;height:300px"
        />
      </div>
      <div v-if="value1.length == 0 || value1.indexOf('流变合格率') > -1">
        <el-table
          :data="tableData3"
          border
          size="mini"
          :max-height="(value1.length === 0 || value1.length === 3) ? 200 : value1.length === 1 ? 600 : 280"
          style="width: 100%"
        >
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <span style="padding-right:20px">流变合格率</span>
              <el-select v-model="product_no_value3" multiple size="mini" placeholder="请选择" clearable filterable @change="changeTableData3">
                <el-option
                  v-for="item in tableData"
                  :key="item.product_no"
                  :label="item.product_no"
                  :value="item.product_no"
                />
              </el-select>
              <span v-if="false">{{ scope }}</span>
              <el-button style="margin-left:20px" type="primary" size="mini" @click="clickChart(3)">图表</el-button>
            </template>
            <el-table-column fixed type="index" label="No" align="center" />
            <el-table-column fixed label="胶料编码" min-width="130" align="center">
              <template slot-scope="scope">
                <el-link type="primary" :underline="false" @click="monthPassClick(scope.row.product_no)">{{ scope.row.product_no }}</el-link>
              </template>
            </el-table-column>
            <el-table-column v-for="(value,index) in headers" :key="index" min-width="58" :label="dateFormat(value)" align="center">
              <template slot-scope="scope">
                <span
                  v-if="(scope.row.dates.filter(d=>d.date === value)).length>0"
                  :style="getStyle((scope.row.dates.filter(d=>d.date === value))[0].lb_percent_of_pass)"
                >
                  {{ (scope.row.dates.filter(d=>d.date === value))[0].lb_percent_of_pass }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <div
          v-if="rheologyRateBarShow"
          id="rheologyRateBar"
          style="width: 100%;height:300px"
        />
      </div>
    </div>
    <el-dialog
      :close-on-press-escape="false"
      width="95%"
      title="胶料月合格率详情"
      :visible.sync="dialogShow"
    >
      <!-- :close-on-click-modal="false" -->
      <div v-loading="dialogLoading" class="table_data">
        <el-button type="primary" style="margin-bottom:5px" @click="clickCharts">图表</el-button>
        <el-table
          :data="detailData"
          border
          :cell-style="cellStyle"
          style="width: 100%"
        >
          <el-table-column fixed type="index" width="14" label="No" />
          <el-table-column fixed label="月份" width="46" align="center">
            <template slot-scope="scope">
              {{ dateFormat(scope.row.date) }}
            </template>
          </el-table-column>
          <el-table-column fixed width="96" label="规格名称" align="center">
            {{ getParams.product_no }}
          </el-table-column>
          <el-table-column fixed label="产量(车)" min-width="32" prop="train_count" align="center" />
          <el-table-column fixed label="一次合格率%" min-width="46" prop="yc_percent_of_pass" align="center" />
          <el-table-column fixed label="流变合格率%" min-width="46" prop="lb_percent_of_pass" align="center" />
          <el-table-column fixed label="综合合格率%" min-width="46" prop="zh_percent_of_pass" align="center" />
          <el-table-column v-for="(value,index) in detailHeaders.points" :key="index" :label="value" align="center">
            <el-table-column label="+" align="center" min-width="25">
              <template slot-scope="scope">
                <span
                  v-if="(scope.row.points.filter(d=>d.name === value)).length>0"
                >
                  {{ (scope.row.points.filter(d=>d.name === value))[0].upper_limit_count }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="%" align="center" min-width="46">
              <template slot-scope="scope">
                <span
                  v-if="(scope.row.points.filter(d=>d.name === value)).length>0"
                  :style="getStyle((scope.row.points.filter(d=>d.name === value))[0].upper_limit_percent)"
                >
                  {{ (scope.row.points.filter(d=>d.name === value))[0].upper_limit_percent }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="-" align="center" min-width="25">
              <template slot-scope="scope">
                <span
                  v-if="(scope.row.points.filter(d=>d.name === value)).length>0"
                >
                  {{ (scope.row.points.filter(d=>d.name === value))[0].lower_limit_count }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="%" align="center" min-width="46">
              <template slot-scope="scope">
                <span
                  v-if="(scope.row.points.filter(d=>d.name === value)).length>0"
                  :style="getStyle((scope.row.points.filter(d=>d.name === value))[0].lower_limit_percent)"
                >
                  {{ (scope.row.points.filter(d=>d.name === value))[0].lower_limit_percent }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      width="95%"
      title="胶料月合格率"
      :visible.sync="dialogChartsShow"
    >
      <div
        v-if="dialogChartsShow"
        id="dialogRateBar"
        style="width: 100%;height:400px"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getBatchProductNoMonthStatistics, getStatisticHeaders } from '@/api/passStatistics'
import dayjs from 'dayjs'
import * as echarts from 'echarts'

export default {
  components: { },
  data() {
    return {
      beginTime: dayjs().startOf('year').format('YYYY-MM'),
      endTime: dayjs().endOf('month').format('YYYY-MM'),
      getParams: { all: 1 },
      headers: [],
      detailHeaders: {},
      dialogShow: false,
      tableData: [],
      detailData: [],
      options: ['综合合格率', '一次合格率', '流变合格率'],
      value1: [],
      loading: true,
      dialogLoading: false,
      product_no_value1: null,
      product_no_value2: null,
      product_no_value3: null,
      tableData1: [],
      tableData2: [],
      tableData3: [],
      comprehensiveBarShow: false,
      firstRateBarShow: false,
      rheologyRateBarShow: false,
      optionBar1: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: (params) => { return this.formatterFun(params) },
          extraCssText: 'white-space: normal; word-break: break-all;'
        },
        grid: {
          top: '12%',
          left: '3%',
          right: '4%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            name: '月份',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '合格率%'
          }
        ],
        dataZoom: [
          {
            show: true,
            start: 96,
            end: 100
          }
        ],
        series: []
      },
      optionBar2: {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'white-space: normal; word-break: break-all;',
          axisPointer: {
            type: 'cross'
          },
          formatter: (params) => { return this.formatterFun(params) }
        },
        grid: {
          top: '12%',
          left: '3%',
          right: '4%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            name: '月份',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '合格率%'
          }
        ],
        dataZoom: [
          {
            show: true,
            start: 90,
            end: 100
          }
        ],
        series: []
      },
      optionBar3: {
        tooltip: {
          trigger: 'axis',
          extraCssText: 'white-space: normal; word-break: break-all;',
          axisPointer: {
            type: 'cross'
          },
          formatter: (params) => { return this.formatterFun(params) }
        },
        grid: {
          top: '12%',
          left: '3%',
          right: '4%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            name: '月份',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '合格率%'
          }
        ],
        dataZoom: [
          {
            show: true,
            start: 94,
            end: 100
          }
        ],
        series: []
      },
      optionBar4: {
        legend: {
          data: ['产量', '一次合格率%', '流变合格率%', '综合合格率%']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: (params) => { return this.formatterFun(params) },
          extraCssText: 'white-space: normal; word-break: break-all;'
        },
        grid: {
          top: '12%',
          left: '5%',
          right: '8%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            name: '月份',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '合格率',
            axisLabel: {
              formatter: '{value} %'
            }
          },
          {
            type: 'value',
            name: '产量',
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '数量',
            offset: 80,
            axisLabel: {
              formatter: '{value}'
            }
          }
          // {
          //   type: 'value',
          //   name: '合格率%/数量'
          // }
        ],
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 100
          }
        ],
        series: []
      },
      dialogChartsShow: false
    }
  },
  created() {
    this.getTableData()
  },
  mounted() {

    // this.chartComprehensiveBar = echarts.init(document.getElementById('comprehensiveBar'))
    // this.chartComprehensiveBar.setOption(this.optionBar1)
  },
  methods: {
    getTableData() {
      this.getParams = { all: 1 }
      this.getParams.start_time = this.beginTime
      this.getParams.end_time = this.endTime
      this.loading = true
      getBatchProductNoMonthStatistics(this.getParams).then(response => {
        this.tableData = response
        this.tableData1 = response
        this.tableData2 = response
        this.tableData3 = response
        // this.total = response.count
        this.getHeaders()

        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    setChart(table, of_pass, option, chart) {
      const arr = []
      table.forEach(D => {
        const arr2 = []
        this.headers.forEach(d => {
          const arr1 = D.dates.filter(d1 => d1.date === d)
          if (arr1.length > 0) {
            const aa = arr1[0][of_pass] ? arr1[0][of_pass].replace(/%/g, '') : '0'
            arr2.push(aa)
          } else {
            arr2.push('0')
          }
        })

        arr.push({
          name: D.product_no,
          type: 'bar',
          barMaxWidth: 150,
          // label: {
          //   show: true,
          //   position: 'top'
          // },
          data: arr2
        })
      })
      this.$set(option, 'series', arr)
      chart.setOption(option, true)
    },
    formatterFun(params) {
      if (params instanceof Array) {
        let str = ''
        str += `${params[0].axisValue}<br/>`
        params.forEach((m, index) => {
          str += `<span class="chart-tooltip-color" style="display: inline-block; margin-right: 10px; background-color: ${m.color}; width: 10px; height: 10px; border-radius:100%; margin-right: 5px"></span>`
          str += `${m.seriesName}：${m.data}`
          str += `${index % 6 === 0 ? '<br/>' : '     '}` // 一排放几个可根据实际情况改变
        })
        return str
      }
    },
    dateFormat(date) {
      return dayjs(date).format('YYYY-MM')
    },
    dateChange() {
      if (this.beginTime) {
        this.beginTime = dayjs(this.beginTime).startOf('month').format('YYYY-MM')
      }
      if (this.endTime) {
        this.endTime = dayjs(this.endTime).endOf('month').format('YYYY-MM')
      }
      this.getTableData()
    },
    getDetailHeaders() {
      getStatisticHeaders().then(response => {
        this.detailHeaders = response
      })
    },
    getHeaders() {
      this.headers = []
      const headers = []
      this.tableData.forEach((product_no) => {
        product_no.dates.forEach((date) => {
          if (this.headers.indexOf(date.date) === -1) {
            this.headers.push(date.date)
            headers.push(dayjs(date.date).format('YYYY-MM'))
          }
        }
        )
      })
      this.optionBar1.xAxis[0].data = headers
      this.optionBar2.xAxis[0].data = headers
      this.optionBar3.xAxis[0].data = headers
      // this.optionBar1.xAxis[0].data = this.headers
      // this.chartComprehensiveBar.setOption(this.optionBar1)
    },
    monthPassClick(product_no) {
      this.dialogShow = true
      this.dialogLoading = true
      this.getDetailHeaders()
      this.getParams.product_no = product_no
      this.detailData = []
      getBatchProductNoMonthStatistics(this.getParams).then(response => {
        this.detailData = response[0].dates
        this.dialogLoading = false
        // this.total = response.count
      }).catch(e => {
        this.dialogLoading = false
      })
    },
    getHeight() {
      return (this.value1.length === 0 || this.value1.length === 3) ? 20 : this.value1.length === 1 ? 60 : 30
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      var cc = column.property
      if (row[cc] && cc !== 'train_count') {
        if (Number((row[cc]).replace('%', '')) < 96) {
          return 'color: #EA1B29'
        }
      }
    },
    getStyle(str) {
      if (str) {
        return Number(str.replace('%', '')) < 96 ? 'color: #EA1B29' : 'color: #1a1a1b'
      } else {
        return 'color: #EA1B29'
      }
    },
    changeSearch() {
    },
    changeTableData1(val) {
      if (val.length === 0 || !val) {
        this.tableData1 = this.tableData
      } else {
        const arr = []
        val.forEach(d => {
          const arr1 = this.tableData.filter(D => d === D.product_no)
          arr.push(...arr1)
        })
        this.tableData1 = arr
      }

      if (this.chartComprehensiveBar) {
        this.setChart(this.tableData1, 'zh_percent_of_pass', this.optionBar1, this.chartComprehensiveBar)
      }
    },
    changeTableData2(val) {
      if (val.length === 0 || !val) {
        this.tableData2 = this.tableData
      } else {
        const arr = []
        val.forEach(d => {
          const arr1 = this.tableData.filter(D => d === D.product_no)
          arr.push(...arr1)
        })
        this.tableData2 = arr
      }

      if (this.chartFirstRateBar) {
        this.setChart(this.tableData2, 'yc_percent_of_pass', this.optionBar2, this.chartFirstRateBar)
      }
    },
    changeTableData3(val) {
      if (val.length === 0 || !val) {
        this.tableData3 = this.tableData
      } else {
        const arr = []
        val.forEach(d => {
          const arr1 = this.tableData.filter(D => d === D.product_no)
          arr.push(...arr1)
        })
        this.tableData3 = arr
      }
      if (this.chartRheologyRateBar) {
        this.setChart(this.tableData3, 'lb_percent_of_pass', this.optionBar3, this.chartRheologyRateBar)
      }
    },
    clickChart(num) {
      if (num === 1) {
        this.comprehensiveBarShow = !this.comprehensiveBarShow
        if (!this.comprehensiveBarShow) return
        this.$nextTick(d => {
          this.chartComprehensiveBar = echarts.init(document.getElementById('comprehensiveBar'))
          this.setChart(this.tableData1, 'zh_percent_of_pass', this.optionBar1, this.chartComprehensiveBar)
        })
      } else if (num === 2) {
        this.firstRateBarShow = !this.firstRateBarShow
        if (!this.firstRateBarShow) return
        this.$nextTick(d => {
          this.chartFirstRateBar = echarts.init(document.getElementById('firstRateBar'))
          this.setChart(this.tableData2, 'yc_percent_of_pass', this.optionBar2, this.chartFirstRateBar)
        })
      } else if (num === 3) {
        this.rheologyRateBarShow = !this.rheologyRateBarShow
        if (!this.rheologyRateBarShow) return
        this.$nextTick(d => {
          this.chartRheologyRateBar = echarts.init(document.getElementById('rheologyRateBar'))
          this.setChart(this.tableData3, 'lb_percent_of_pass', this.optionBar3, this.chartRheologyRateBar)
        })
      }
    },
    clickCharts() {
      this.dialogChartsShow = true
      // 弹框折线柱形图 数据处理
      const headers = []
      const obj1 = {
        name: '产量',
        type: 'line',
        yAxisIndex: 1,
        data: []
      }
      const obj2 = {
        name: '一次合格率%',
        type: 'bar',
        data: []
      }
      const obj3 = {
        name: '流变合格率%',
        type: 'bar',
        data: []
      }
      const obj4 = {
        name: '综合合格率%',
        type: 'bar',
        data: []
      }
      const arr1 = []
      this.detailHeaders.points.forEach(D => {
        const _arr1 = []
        const _arr2 = []
        const _arr3 = []
        const _arr4 = []
        this.detailData.forEach(d => {
          const a1 = d.points.filter(d1 => d1.name === D)
          if (a1.length > 0) {
            _arr1.push(a1[0].upper_limit_percent ? a1[0].upper_limit_percent.replace(/%/g, '') : '')
            _arr2.push(a1[0].lower_limit_percent ? a1[0].lower_limit_percent.replace(/%/g, '') : '')
            _arr3.push(a1[0].upper_limit_count)
            _arr4.push(a1[0].lower_limit_count)
          } else {
            _arr1.push(0)
            _arr2.push(0)
            _arr3.push(0)
            _arr4.push(0)
          }
        })
        arr1.push({
          name: D + '% +',
          value: D,
          type: 'bar',
          data: _arr1
        })
        arr1.push({
          name: D + '% -',
          value: D,
          type: 'bar',
          data: _arr2
        })
        arr1.push({
          name: D + '+',
          value: D,
          type: 'line',
          yAxisIndex: 2,
          data: _arr3
        })
        arr1.push({
          name: D + '-',
          value: D,
          yAxisIndex: 2,
          type: 'line',
          data: _arr4
        })
      })
      this.detailData.forEach(D => {
        headers.push(dayjs(D.date).format('YYYY-MM'))
        obj1.data.push(D.train_count)
        obj2.data.push(D.yc_percent_of_pass ? D.yc_percent_of_pass.replace(/%/g, '') : '')
        obj3.data.push(D.lb_percent_of_pass ? D.lb_percent_of_pass.replace(/%/g, '') : '')
        obj4.data.push(D.zh_percent_of_pass ? D.zh_percent_of_pass.replace(/%/g, '') : '')
      })
      // console.log(this.detailData, 'this.detailData')
      // console.log(this.detailHeaders, 'this.detailHeaders')

      this.$nextTick(() => {
        this.chartDialogRateBar = echarts.init(document.getElementById('dialogRateBar'))

        const allArr = [obj1, obj2, obj3, obj4, ...arr1]
        this.optionBar4.xAxis[0].data = headers
        this.optionBar4.series = allArr
        this.chartDialogRateBar.setOption(this.optionBar4)
      })
    }
  }
}
</script>

<style>

</style>
