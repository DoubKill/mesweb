<template>
  <div class="fault-day-statistics">
    <el-date-picker
      v-model="searchDate"
      type="date"
      placeholder="选择日期"
      value-format="yyyy-MM-dd"
      style="margin-bottom:20px"
      :clearable="false"
      @change="datePicker"
    />
    <!-- 设备别故障日统计 -->
    <div style="display:flex">
      <div style="width:65%">
        <el-table
          :data="tableData"
          border
        >
          <el-table-column
            prop="machine"
            label="设备名称"
            min-width="20"
          />
          <el-table-column v-for="(item,index) in classList" :key="index" :label="item">
            <el-table-column
              label="故障时间"
              min-width="20"
              prop="error_time"
            >
              <template slot-scope="{row}">
                {{ row.error_time[index] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="error_percent"
              label="故障率"
              min-width="20"
            >
              <template slot-scope="{row}">
                {{ row.error_percent[index] *100 }}%
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div style="width:30%;text-align:center">
        <h3 style="margin-top: 0;">炼胶工程设备故障占比</h3>
        <ve-pie
          style="width:100%;"
          :data="chartData2"
          :extend="extend"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { setDate } from '@/utils'
import { dayErrorStatistics } from '@/api/base_w_three'
export default {
  name: 'FaultDayStatistics',
  data() {
    this.extend = {
      series: {
        animation: false
      }
    }
    return {
      searchDate: setDate(),
      classList: [],
      tableData: [],
      chartData2: {
        columns: ['global_name', 'global_no'],
        rows: []
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      try {
        const data = await dayErrorStatistics('get', null, { params: { day_time: this.searchDate }})
        const arr = []
        const chartData = []
        for (const iterator in data) {
          data[iterator].machine = iterator
          arr.push(data[iterator])
        }
        this.tableData = arr || []
        const error_percentArr = []
        const error_timeArr = []
        this.tableData.forEach((D, index) => {
          D.error_percent.forEach((d, i) => {
            if (!error_percentArr[i]) {
              error_percentArr[i] = 0
            }
            error_percentArr[i] += d
          })
          D.error_time.forEach((d, i) => {
            if (!error_timeArr[i]) {
              error_timeArr[i] = 0
            }
            error_timeArr[i] += d
          })

          chartData[index] = {
            global_name: D.machine,
            global_no: D.error_percent[D.error_percent.length - 1] * 100
          }
        })
        this.tableData.push({
          class_name: this.tableData[0].class_name,
          error_percent: error_percentArr,
          error_time: error_timeArr,
          machine: '合计'
        })
        this.classList = arr[0].class_name
        this.total = data.count

        this.chartData2.rows = chartData
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    datePicker(val) {
      if (!val) {
        this.$message.info('请选择日期')
        return
      }
      this.getList()
    }
  }
}
</script>

<style>
/* .fault-day-statistics{
} */
</style>
