<template>
  <div>
    <!-- 出库日报 -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-if="currentRouter==='DeliveryDaily'"
          v-model="datetimerange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
        <el-date-picker
          v-if="currentRouter==='DeliveryMonthly'"
          v-model="datetimerangeMonth"
          type="month"
          placeholder="选择月"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
        <el-date-picker
          v-if="currentRouter==='DeliveryYearly'"
          v-model="datetimerangeYear"
          type="year"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择年"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="物资名称">
        <el-input v-model="search.MaterialName" clearable placeholder="请输入内容" @input="getDebounce" />
      </el-form-item>
      <el-form-item label="物资组">
        <el-select v-model="search.MaterialGroupName" filterable clearable placeholder="请选择" @change="changeDate">
          <el-option
            v-for="item in MaterialList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="currentRouter==='DeliveryDaily'" label="批次号">
        <el-input v-model="search.BatchNo" clearable placeholder="请输入内容" @input="getDebounce" />
      </el-form-item>
      <el-form-item v-if="currentRouter==='DeliveryDaily'" label="巷道">
        <el-select v-model="search.TunnelName" filterable clearable placeholder="请选择" @change="changeDate">
          <el-option
            v-for="item in TunnelNameList"
            :key="item.id"
            :label="item.tunnelName"
            :value="item.tunnelName"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="currentRouter==='DeliveryDaily'" label="站台">
        <el-select v-model="search.EntranceName" filterable clearable placeholder="请选择" @change="changeDate">
          <el-option
            v-for="item in EntranceList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-button :loading="btnExportLoad" @click="Excel">导出Excel</el-button>
    </el-form>
    <el-row>
      <el-col :span="12">
        <div
          id="taskLine"
          style="width: 100%;height:200px"
        />
      </el-col>
      <el-col :span="12">
        <div
          id="codeLine"
          style="width: 100%;height:200px"
        />
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="id"
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column
        prop="materialCode"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        prop="materialName"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="materialGroupName"
        label="物资组"
        min-width="20"
      />
      <el-table-column
        prop="quantity"
        label="数量"
        min-width="8"
      >
        <template slot-scope="{row}">
          <el-link type="primary" @click.prevent="check_(row)">{{ row.quantity }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        v-if="currentRouter==='DeliveryDaily'"
        prop="batchNo"
        label="批次号"
        min-width="20"
      />
      <el-table-column
        prop="weightOfActual"
        label="总重量（kg）"
        min-width="20"
      />
      <el-table-column
        prop="sl"
        label="件数"
        min-width="20"
      />
      <el-table-column
        prop="zl"
        label="麦头重量"
        min-width="20"
      />
    </el-table>
    <page
      v-if="!loading"
      :total="total"
      :current-page="search.pageNo"
      @currentChange="currentChange"
    />
    <el-dialog
      title="出入库履历信息"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="handleClose"
    >
      <materialInoutRecord :dialog-search="dialogSearch" :is-dialog="true" :warehouse-name-props="'原材料库'" :show="dialogVisible" />
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request-zc'
import page from '@/components/page'
import { debounce, setDate } from '@/utils'
import * as echarts from 'echarts'
import materialInoutRecord from '@/views/inventory/rubber-warehouse/material_inout_record.vue'

export default {
  name: 'DeliveryDaily',
  components: { page, materialInoutRecord },
  data() {
    return {
      tableData: [],
      search: {
        pageSize: 10,
        pageNo: 1
      },
      search1: {},
      btnExportLoad: false,
      datetimerange: [],
      datetimerangeMonth: '',
      datetimerangeYear: '',
      loading: false,
      total: 0,
      MaterialList: [],
      TunnelNameList: [],
      EntranceList: [],
      currentRouter: this.$route.name,
      optionTaskLine: {
        title: {
          text: `${this.$route.name === 'DeliveryYearly' ? '当年'
            : this.$route.name === 'DeliveryMonthly' ? '当月' : '当日'}出库任务数量统计`,
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '20%'
        },
        xAxis: [
          {
            type: 'category',
            name: '',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: ''
          }
        ],
        series: [{
          data: [],
          type: 'line',
          smooth: true
        }]
      },
      optionCodeLine: {
        title: {
          text: `${this.$route.name === 'DeliveryYearly' ? '当年'
            : this.$route.name === 'DeliveryMonthly' ? '当月' : '当日'}出库物资编码数量统计`,
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '20%'
        },
        xAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [{
          data: [],
          type: 'line',
          smooth: true
        }]
      },
      dialogVisible: false,
      dialogSearch: {}
    }
  },
  created() {
    if (this.currentRouter === 'DeliveryDaily') {
      this.search.EndTime = setDate(null, true)
      this.search.StartTime = setDate() + ' 00:00:00'
      this.datetimerange = [this.search.StartTime, this.search.EndTime]
    } else if (this.currentRouter === 'DeliveryMonthly') {
      const a = new Date()
      const _year = a.getFullYear()
      const _month = a.getMonth()
      const firstDay = new Date(_year, _month, 1)
      delete this.search.EndTime
      this.search.StartTime = setDate(firstDay) + ' 00:00:00'
      this.datetimerangeMonth = setDate(firstDay) + ' 00:00:00'
    } else {
      const a = new Date()
      const _year = a.getFullYear()
      delete this.search.EndTime
      this.search.StartTime = _year + '-01-01' + ' 00:00:00'
      this.datetimerangeYear = _year + '-01-01' + ' 00:00:00'
    }
    this.getDownTaskCountByTodayCount()
    this.getMaterialList()
    this.getTunnelNameList()
    this.getEntranceList()
    this.getList()
  },
  methods: {
    Excel() {
      this.btnExportLoad = true
      this.search1 = JSON.parse(JSON.stringify(this.search))
      this.search1.pageSize = 999999999
      const _api = this.currentRouter === 'DeliveryDaily'
        ? '/stockOutTask/FindDownTaskReportByDay'
        : this.currentRouter === 'DeliveryMonthly' ? '/stockOutTask/FindDownTaskReportByMonth'
          : '/stockOutTask/FindDownTaskReportByYear'
      request({
        url: _api,
        method: 'get',
        params: this.search1
      }).then(data => {
        const a = data.datas
        this.btnExportLoad = false
        this.$router.push({
          path: '/excel',
          query: {
            table: a
          }})
      }).catch((e) => {
        this.btnExportLoad = false
      })
    },
    getList() {
      this.loading = true
      this.tableData = []
      const _api = this.currentRouter === 'DeliveryDaily'
        ? '/stockOutTask/FindDownTaskReportByDay'
        : this.currentRouter === 'DeliveryMonthly' ? '/stockOutTask/FindDownTaskReportByMonth'
          : '/stockOutTask/FindDownTaskReportByYear'
      request({
        url: _api,
        method: 'get',
        params: this.search
      }).then(data => {
        this.loading = false
        this.tableData = data.datas
        this.total = data.totalRecord
      }).catch((e) => {
        this.loading = false
      })
    },
    getMaterialList() {
      request({
        url: '/materialGroup/FindAll',
        method: 'get'
      }).then(data => {
        this.MaterialList = data.datas
      }).catch((e) => {
      })
    },
    getTunnelNameList() {
      request({
        url: '/tunnel/FindAll',
        method: 'get'
      }).then(data => {
        this.TunnelNameList = data.datas || []
      }).catch((e) => {
        console.log(e, 'zc获取失败')
      })
    },
    getEntranceList() {
      request({
        url: '/entrance/FindAll',
        method: 'get'
      }).then(data => {
        const arr = data.datas.filter(d => d.type === 2)
        this.EntranceList = arr || []
      }).catch((e) => {
        console.log(e, 'zc获取失败')
      })
    },
    getDownTaskCountByTodayCount() {
      const _api = this.currentRouter === 'DeliveryDaily'
        ? '/stockOutTask/GetDownTaskCountByTodayCount'
        : this.currentRouter === 'DeliveryMonthly' ? '/stockOutTask/GetDownTaskCountByMonthCount'
          : '/stockOutTask/GetDownTaskCountByYearCount'
      request({
        url: _api,
        method: 'get'
      }).then(data => {
        const xList = []
        const allArr = []
        data.datas.forEach(element => {
          xList.push(element.hour)
          allArr.push(element.quantity)
        })
        this.optionTaskLine.xAxis[0].data = xList
        this.optionTaskLine.series[0].data = allArr

        this.$nextTick(() => {
          const chartDialogRateBar = echarts.init(document.getElementById('taskLine'))
          chartDialogRateBar.setOption(this.optionTaskLine)
        })
      }).catch((e) => {
        console.log(e, 'zc获取失败')
      })
      const _api1 = this.currentRouter === 'DeliveryDaily'
        ? '/stockOutTask/GetMaterialCodeCountByTodayCount'
        : this.currentRouter === 'DeliveryMonthly' ? '/stockOutTask/GetMaterialCodeCountByMonthCount'
          : '/stockOutTask/GetMaterialCodeCountByYearCount'
      request({
        url: _api1,
        method: 'get'
      }).then(data => {
        const chartCodeLine = echarts.init(document.getElementById('codeLine'))
        const xList = []
        const allArr = []
        data.datas.forEach(element => {
          xList.push(element.hour)
          allArr.push(element.quantity)
        })
        this.optionCodeLine.xAxis[0].data = xList
        this.optionCodeLine.series[0].data = allArr
        chartCodeLine.setOption(this.optionCodeLine)
      }).catch((e) => {
        console.log(e, 'zc获取失败')
      })
    },
    changeDate() {
      this.search.StartTime = this.datetimerange ? this.datetimerange[0] : ''
      this.search.EndTime = this.datetimerange ? this.datetimerange[1] : ''
      this.search.tunnelCode = this.datetimerange ? this.datetimerange[1] : ''
      const obj = this.TunnelNameList.find(d => d.tunnelName === this.search.TunnelName)
      const obj1 = this.EntranceList.find(d => d.name === this.search.EntranceName)
      this.search.pageNo = 1
      this.search.tunnelCode = obj ? obj.tunnelCode : ''
      this.search.EntranceCode = obj1 ? obj1.entranceCode : ''

      if (this.currentRouter === 'DeliveryMonthly') {
        this.search.StartTime = this.datetimerangeMonth
      }
      if (this.currentRouter === 'DeliveryYearly') {
        this.search.StartTime = this.datetimerangeYear
      }
      this.getList()
    },
    getDebounce() {
      this.search.pageNo = 1
      debounce(this, 'getList')
    },
    currentChange(page) {
      this.search.pageNo = page
      this.getList()
    },
    check_(row) {
      this.dialogSearch = {
        e_material_no: row.materialCode,
        batch_no: row.batchNo || ''
      }
      if (this.currentRouter === 'DeliveryDaily') {
        this.dialogSearch.start_time = this.search.StartTime || ''
        this.dialogSearch.end_time = this.search.EndTime || ''
      } else if (this.currentRouter === 'DeliveryMonthly') {
        const a = new Date(this.datetimerangeMonth)
        const _year = a.getFullYear()
        const _month = a.getMonth()
        const firstDay = new Date(_year, _month, 1)
        const lastDay = new Date(_year, _month + 1, 0)

        this.dialogSearch.start_time = setDate(firstDay) + ' 00:00:00'
        this.dialogSearch.end_time = setDate(lastDay) + ' 23:59:59'
      } else {
        const a = new Date(this.datetimerangeYear)
        const _year = a.getFullYear()
        this.dialogSearch.start_time = _year + '-01-01' + ' 00:00:00'
        this.dialogSearch.end_time = _year + '-12-31' + ' 23:59:59'
      }
      this.dialogVisible = true
    },
    handleClose(done) {
      if (done) {
        done()
      }
    }
  }
}

</script>

<style>

</style>
