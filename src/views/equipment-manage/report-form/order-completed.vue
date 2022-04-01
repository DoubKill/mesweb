<template>
  <div>
    <!-- 工单按时完成率报表 -->
    <el-form :inline="true">
      <el-form-item label="起止日期">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['equip_finishing_rate','export']"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      :row-class-name="tableRowClassName"
      border
    >
      <el-table-column
        prop="work_type"
        label="订单类别"
        min-width="20"
      />
      <el-table-column
        prop="total_orders"
        label="总工单数"
        min-width="20"
      />
      <el-table-column
        prop="completed_in_time"
        label="按时完成工单数"
        min-width="20"
      />
      <el-table-column
        prop="completed_overtime"
        label="超期完成工单数"
        min-width="20"
      />
      <el-table-column
        prop="uncompleted"
        label="未完成工单数"
        min-width="20"
      />
      <el-table-column
        prop="rate"
        label="工单完成率(%)"
        min-width="20"
      />
      <el-table-column
        prop="in_time_rate"
        label="工单按时完成率(%)"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import { equipFinishingRate } from '@/api/jqy'
import { exportExcel } from '@/utils/index'
export default {
  name: 'EquipmentReportFormOrderCompleted',
  data() {
    return {
      dateValue: [],
      search: {},
      loading: false,
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipFinishingRate('get', null, { params: this.search })
        this.tableData = data
        if (this.tableData.length > 0) {
          this.tableData.push({
            work_type: '合计',
            total_orders: sum(this.tableData, 'total_orders'),
            completed_in_time: sum(this.tableData, 'completed_in_time'),
            completed_overtime: sum(this.tableData, 'completed_overtime'),
            uncompleted: sum(this.tableData, 'uncompleted'),
            rate: rate((sum(this.tableData, 'completed_in_time') + sum(this.tableData, 'completed_overtime')), sum(this.tableData, 'total_orders')),
            in_time_rate: rate(sum(this.tableData, 'completed_in_time'), sum(this.tableData, 'total_orders'))
          })
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.work_type === '合计') {
        return 'summary-cell-style'
      }
    },
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      this.getList()
    },
    exportTable() {
      exportExcel('工单按时完成率报表')
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

function rate(arr, params) {
  if (params === 0) {
    return 0
  }
  const s = (arr / params * 100).toFixed(2)
  return s
}
</script>

<style>

</style>
