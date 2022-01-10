<template>
  <div>
    <!-- 月产量统计汇总 -->
    <el-form :inline="true">
      <el-form-item label="起止日期:">
        <el-date-picker
          v-model="valueDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%"
      border
      show-summary
    >
      <el-table-column
        prop="date"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="吨数"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="车数"
        min-width="20"
      />
      <el-table-column
        prop="date"
        label="机台目标值"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="机台最高值"
        min-width="20"
      />
      <el-table-column
        label="段数"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-link
            type="primary"
            @click="repairDialog(row)"
          >{{ row.aaaa }}</el-link>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="月产量统计汇总 明细"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-form :inline="true">
        <el-form-item label="机台:">
          //
        </el-form-item>
        <el-form-item label="规格:">
          <el-input
            v-model="search.equip_repair_standard"
            clearable
            @input="changeDebounce"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData1"
        style="width: 100%"
        border
        show-summary
      >
        <el-table-column
          prop="date"
          label="规格"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="机台"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="日期"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="车数"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="吨数"
          min-width="20"
        />
        <el-table-column
          prop="date"
          label="占比"
          min-width="20"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
export default {
  name: 'OutputStatisticsSummary',
  data() {
    return {
      valueDate: [],
      tableData: [{ aaaa: 1 }],
      tableData1: [],
      search: {},
      btnExportLoad: false,
      dialogVisible: false
    }
  },
  methods: {
    async getList() {
      try {
        // const data = await banbury_plan_url('get', { params: this.getParams })
        // this.tableData = data.data
      } catch (e) { throw new Error(e) }
    },
    async getDialogList() {
      try {
        // const data = await banbury_plan_url('get', { params: this.getParams })
        // this.tableData = data.data
      } catch (e) { throw new Error(e) }
    },
    changeDate() {
      this.getList()
    },
    exportTable() {

    },
    repairDialog(row) {
      this.dialogVisible = true
    },
    handleClose(done) {
      done()
    },
    changeDebounce() {
      debounce(this, 'getDialogList')
    }
  }
}
</script>

<style>

</style>
