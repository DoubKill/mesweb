<template>
  <div>
    <!-- 机台别-生产量汇总 -->
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
      <el-form-item label="机台">
        <selectEquip :equip_no_props.sync="search.equip_no" @changeSearch="getList" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnExportLoad" @click="exportExcel">导出Excel</el-button>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      border
      show-summary
    >
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="实际产量（吨）"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="理论生产时间（h）"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="有效生产时间（h）"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="有效时间比率%"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="理论单车生产时间（秒）"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="实际单车生产时间（秒）"
        min-width="20"
      />
      <el-table-column
        prop="equip_no"
        label="效率%"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import selectEquip from '@/components/select_w/equip'
import { exportExcel } from '@/utils/index'
export default {
  name: 'ScheduleMachineType',
  components: { selectEquip },
  data() {
    return {
      dateValue: [],
      search: {},
      btnExportLoad: false,
      loading: false,
      tableData: []
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        // const data = await equipStatement('get', null, { params: this.search })
        // this.tableData = data
        // this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      this.getList()
    },
    exportExcel() {
      exportExcel('机台别-生产量汇总')
    }
  }
}
</script>

<style>

</style>
