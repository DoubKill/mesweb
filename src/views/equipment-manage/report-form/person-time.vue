<template>
  <div>
    <!-- 人员别处理时间报表 -->
    <el-form :inline="true">
      <el-form-item label="起止日时">
        <el-date-picker
          v-model="dateValue"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日时"
          end-placeholder="结束日时"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="人员">
        <el-input v-model="search.username" clearable @input="debounceList" />
      </el-form-item>
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
      <el-form-item>
        <el-button
          v-permission="['equip_user_statement','export']"
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
        prop="receiving_user"
        label="人员"
        min-width="20"
      />
      <el-table-column
        prop="work_type"
        label="作业类别"
        min-width="20"
      />
      <el-table-column
        prop="派单时间"
        label="派单平均时间(分钟)"
        min-width="20"
      />
      <el-table-column
        prop="接单时间"
        label="接单平均时间(分钟)"
        min-width="20"
      />
      <el-table-column
        prop="维修时间"
        label="维修平均时间(分钟)"
        min-width="20"
      />
      <el-table-column
        prop="验收时间"
        label="验收平均时间(分钟)"
        min-width="20"
      />
      <el-table-column
        prop="开机时间"
        label="开机平均时间(分钟)"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import { equipUserStatement } from '@/api/jqy'
import { exportExcel } from '@/utils/index'
import { debounce } from '@/utils'
export default {
  name: 'EquipmentReportFormPerson',
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
        const data = await equipUserStatement('get', null, { params: this.search })
        this.tableData = data
        if (this.tableData.length > 0) {
          this.tableData.push({
            receiving_user: '合计',
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
    debounceList() {
      debounce(this, 'getList')
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.receiving_user === '合计') {
        return 'summary-cell-style'
      }
    },
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      this.getList()
    },
    exportTable() {
      exportExcel('人员别处理时间报表')
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
