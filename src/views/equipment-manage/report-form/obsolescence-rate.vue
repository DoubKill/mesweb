<template>
  <div>
    <!-- 交旧率报表 -->
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
          v-permission="['equip_old_rate','export']"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="component_type_code"
        label="部件代码"
        min-width="20"
      />
      <el-table-column
        prop="component_type_name"
        label="部件名称"
        min-width="20"
      />
      <el-table-column
        prop="apply_count"
        label="领用数量"
        min-width="20"
      />
      <el-table-column
        prop="old_count"
        label="交旧数量"
        min-width="20"
      />
      <el-table-column
        prop="old_rate"
        label="交旧率(%)"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import { equipOldRate } from '@/api/jqy'
import { exportExcel } from '@/utils/index'
export default {
  name: 'EquipmentReportFormObsolescenceRate',
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
        const data = await equipOldRate('get', null, { params: this.search })
        this.tableData = data
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      this.getList()
    },
    exportTable() {
      exportExcel('交旧率报表')
    }
  }
}
</script>

<style>

</style>
