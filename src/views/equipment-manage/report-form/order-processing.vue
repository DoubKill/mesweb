<template>
  <div>
    <!-- 期间别处理时间分析报表 -->
    <el-form :inline="true">
      <el-form-item>
        <el-radio-group v-model="search.type" @change="resetTime">
          <el-radio label="day">日报</el-radio>
          <el-radio label="week">周报</el-radio>
          <el-radio label="month">月报</el-radio>
          <el-radio label="year">年报</el-radio>
        </el-radio-group>
      </el-form-item>
      <br>
      <el-form-item label="作业类型">
        <el-select
          v-model="search.work_type"
          placeholder="请选择"
          clearable
          @change="getList"
        >
          <el-option
            v-for="item in ['巡检','保养','维修','润滑','标定']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日/周/月/年">
        <el-date-picker
          v-if="type==='day'"
          key="1"
          v-model="search.time"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeList"
        />
        <el-date-picker
          v-if="type==='week'"
          key="2"
          v-model="search.time"
          type="week"
          :picker-options="{firstDayOfWeek:1}"
          format="yyyy第WW周"
          value-format="yyyy-MM-dd"
          placeholder="选择周"
          @change="changeList"
        />
        <el-date-picker
          v-if="type==='month'"
          key="3"
          v-model="search.time"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM-dd"
          placeholder="选择月"
          @change="changeList"
        />
        <el-date-picker
          v-if="type==='year'"
          key="4"
          v-model="search.time"
          type="year"
          format="yyyy"
          value-format="yyyy-MM-dd"
          placeholder="选择年"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      :row-class-name="tableRowClassName"
      border
    >
      <el-table-column
        prop="time"
        label="时间"
        min-width="20"
      />
      <el-table-column
        prop="work_type"
        label="作业类别"
        min-width="20"
      />
      <el-table-column
        prop="派单时间"
        label="派单平均时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="接单时间"
        label="接单平均时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="维修时间"
        label="维修平均时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="验收时间"
        label="验收平均时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="开机时间"
        label="开机平均时间（分钟）"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import { equipPeriodStatement } from '@/api/jqy'
import { exportExcel } from '@/utils/index'
import { setDate } from '@/utils'
export default {
  name: 'EquipmentReportFormOrderProcessing',
  data() {
    return {
      search: { time: setDate(), type: 'day' },
      loading: false,
      tableData: [],
      type: 'day'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipPeriodStatement('get', null, { params: this.search })
        this.tableData = data
        if (this.tableData.length > 0) {
          this.tableData.push({
            time: '合计',
            派单时间: handleDecimalPoint(sum(this.tableData, '派单时间') / this.tableData.length),
            接单时间: handleDecimalPoint(sum(this.tableData, '接单时间') / this.tableData.length),
            维修时间: handleDecimalPoint(sum(this.tableData, '维修时间') / this.tableData.length),
            验收时间: handleDecimalPoint(sum(this.tableData, '验收时间') / this.tableData.length),
            开机时间: handleDecimalPoint(sum(this.tableData, '开机时间') / this.tableData.length)
          })
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.time === '合计') {
        return 'summary-cell-style'
      }
    },
    changeList() {
      this.getList()
    },
    resetTime() {
      this.search.time = setDate()
      this.type = this.search.type
      this.getList()
    },
    exportTable() {
      exportExcel('期间别处理时间报表')
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
function handleDecimalPoint(value) {
  value = +value
  if (!value) return 0
  if (!Number.isInteger(value)) {
    value = +value.toFixed(2)
  }
  return value
}
</script>

<style>

</style>
