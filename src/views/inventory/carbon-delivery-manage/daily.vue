<template>
  <div>
    <!-- 出库日报 -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-if="currentRouter==='CarbonDeliveryDaily'"
          v-model="datetimerange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
        <el-date-picker
          v-if="currentRouter==='CarbonDeliveryMonthly'"
          v-model="datetimerangeMonth"
          type="month"
          placeholder="选择月"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
        <el-date-picker
          v-if="currentRouter==='CarbonDeliveryYearly'"
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
      <el-form-item v-if="currentRouter==='CarbonDeliveryDaily'" label="批次号">
        <el-input v-model="search.BatchNo" clearable placeholder="请输入内容" @input="getDebounce" />
      </el-form-item>
      <el-form-item v-if="currentRouter==='CarbonDeliveryDaily'" label="巷道">
        <el-select v-model="search.TunnelName" filterable clearable placeholder="请选择" @change="changeDate">
          <el-option
            v-for="item in TunnelNameList"
            :key="item.id"
            :label="item.tunnelName"
            :value="item.tunnelName"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="currentRouter==='CarbonDeliveryDaily'" label="站台">
        <el-select v-model="search.EntranceName" filterable clearable placeholder="请选择" @change="changeDate">
          <el-option
            v-for="item in EntranceList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
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
      />
      <el-table-column
        prop="batchNo"
        label="批次号"
        min-width="20"
      />
      <el-table-column
        prop="weightOfActual"
        label="总重量（kg）"
        min-width="20"
      />
    </el-table>
    <page
      v-if="!loading"
      :total="total"
      :current-page="search.pageNo"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import request from '@/utils/request-zc-th'
import page from '@/components/page'
import { debounce } from '@/utils'
import * as echarts from 'echarts'
export default {
  name: 'CarbonDeliveryDaily',
  components: { page },
  data() {
    return {
      tableData: [],
      search: {
        pageSize: 10,
        pageNo: 1
      },
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
          text: `${this.$route.name === 'CarbonDeliveryYearly' ? '当年'
            : this.$route.name === 'CarbonDeliveryMonthly' ? '当月' : '当日'}出库物资编码数量统计`,
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
          text: `${this.$route.name === 'CarbonDeliveryYearly' ? '当年'
            : this.$route.name === 'CarbonDeliveryMonthly' ? '当月' : '当日'}出库任务数量统计`,
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
      }
    }
  },
  created() {
    this.getDownTaskCountByTodayCount()
    this.getMaterialList()
    this.getTunnelNameList()
    this.getEntranceList()
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.tableData = []
      const _api = this.currentRouter === 'CarbonDeliveryDaily'
        ? '/stockOutTask/FindDownTaskReportByDay'
        : this.currentRouter === 'CarbonDeliveryMonthly' ? '/stockOutTask/FindDownTaskReportByMonth'
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
      const _api = this.currentRouter === 'CarbonDeliveryDaily'
        ? '/stockOutTask/GetDownTaskCountByTodayCount'
        : this.currentRouter === 'CarbonDeliveryMonthly' ? '/stockOutTask/GetDownTaskCountByMonthCount'
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
      const _api1 = this.currentRouter === 'CarbonDeliveryDaily'
        ? '/stockOutTask/GetMaterialCodeCountByTodayCount'
        : this.currentRouter === 'CarbonDeliveryMonthly' ? '/stockOutTask/GetMaterialCodeCountByMonthCount'
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

      if (this.currentRouter === 'CarbonDeliveryMonthly') {
        this.search.StartTime = this.datetimerangeMonth
      }
      if (this.currentRouter === 'CarbonDeliveryYearly') {
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
    }
  }
}
</script>

<style>

</style>
