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
          :clearable="false"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['monthly_output_statistics_report','export']" type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :id="outTable?'out-table':'false'"
      :data="tableData"
      style="width: 100%"
      border
      :summary-method="getSummaries"
      show-summary
    >
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="weight"
        label="吨数"
        min-width="20"
      />
      <el-table-column
        prop="value"
        label="车数"
        min-width="20"
      />
      <el-table-column
        prop="settings_value"
        label="机台目标值"
        min-width="20"
      />
      <el-table-column
        prop="max_value"
        label="机台最高值"
        min-width="20"
      />
      <el-table-column
        label="段数"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-link
            v-if="row.name.indexOf('合计')===-1"
            type="primary"
            @click="repairDialog(row)"
          >{{ row.name }}</el-link>
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="stateValue"
        label="吨数"
        min-width="20"
      />
    </el-table>

    <el-dialog
      :title="`月产量统计汇总 ${search.state}明细`"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-form :inline="true">
        <el-form-item label="机台:">
          <el-select
            v-model="search.equip"
            placeholder="请选择机台"
            clearable
            @change="getDialogList"
          >
            <el-option
              v-for="item in machineList"
              :key="item.equip_no"
              :label="item.equip_no"
              :value="item.equip_no"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规格:">
          <el-input
            v-model="search.space"
            clearable
            @input="changeDebounce"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-permission="['monthly_output_statistics_report','export']" type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :id="outTable?'false':'out-table'"
        :data="tableData1"
        style="width: 100%"
        border
        show-summary
      >
        <el-table-column
          prop="space"
          label="规格"
          min-width="20"
        />
        <el-table-column
          prop="equip_no"
          label="机台"
          min-width="20"
        />
        <!-- <el-table-column
          prop="date"
          label="日期"
          min-width="20"
        /> -->
        <el-table-column
          prop="value"
          label="车数"
          min-width="20"
        />
        <el-table-column
          prop="weight"
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
import { debounce, setDate, exportExcel } from '@/utils'
import { equipUrl } from '@/api/base_w'
import { monthlyOutputStatisticsReport } from '@/api/base_w_five'
export default {
  name: 'OutputStatisticsSummary',
  data() {
    return {
      valueDate: [],
      tableData: [],
      tableData1: [],
      search: {},
      getParams: {},
      btnExportLoad: false,
      dialogVisible: false,
      machineList: [],
      outTable: true
    }
  },
  created() {
    this.valueDate = [setDate(), setDate()]
    this.getParams.st = setDate()
    this.getParams.et = setDate()
    this.getList()
    this.getMachineList()
  },
  methods: {
    async getList() {
      try {
        const data = await monthlyOutputStatisticsReport('get', null, { params: this.getParams })
        this.tableData = data.result || []
        const jl = data.jl || []
        const wl = data.wl || []
        const state = wl.concat(jl)

        state.forEach((d, i) => {
          if (d.name === 'jl') {
            d.name = '加硫合计'
          }
          if (d.name === 'wl') {
            d.name = '无硫合计'
          }
          if (this.tableData[i]) {
            this.tableData[i].name = d.name
            this.tableData[i].stateValue = d.value
          } else {
            this.tableData[i] = { name: d.name, stateValue: d.value }
          }
        })
      } catch (e) { throw new Error(e) }
    },
    async getDialogList() {
      try {
        this.search.st = this.getParams.st
        this.search.et = this.getParams.et
        const data = await monthlyOutputStatisticsReport('get', null, { params: this.search })
        this.tableData1 = data.result
      } catch (e) { throw new Error(e) }
    },
    async getMachineList() {
      try {
        const data = await equipUrl('get', { params: { all: 1, category_name: '密炼设备' }})
        this.machineList = data.results || []
        this.machineList.push({
          equip_no: 'E190'
        })
      } catch (e) { throw new Error(e) }
    },
    changeDate(arr) {
      this.getParams.st = arr ? arr[0] : ''
      this.getParams.et = arr ? arr[1] : ''
      this.getList()
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === this.tableData.length) {
          sums[index] = ''
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    exportTable() {
      const str = this.outTable ? '月产量统计汇总' : `月产量统计汇总 ${this.search.state}明细`
      exportExcel(str)
    },
    repairDialog(row) {
      this.dialogVisible = true
      this.outTable = false
      this.search.state = row.name
      this.getDialogList()
    },
    handleClose(done) {
      this.outTable = true
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
