<template>
  <div>
    <!-- 称量机台物料统计 -->
    <el-form :inline="true">
      <el-form-item label="称量机台">
        <equipSelect
          :equip_no_props="search.equip_no"
          equip-type="称量设备"
          :is-created="true"
          @changeSearch="equipSearch"
        />
      </el-form-item>
      <el-form-item label="起止时间:">
        <el-date-picker
          v-model="searchDate"
          type="datetimerange"
          :clearable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['08:00:00', '08:00:00']"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['equip_statement','export']"
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
      border
      show-summary
      style="width:60%"
    >
      <el-table-column
        prop="id"
        label="机台"
        min-width="20"
      >
        <template>{{ search.equip_no }}</template>
      </el-table-column>
      <el-table-column
        prop="material"
        label="物料名称"
        min-width="40"
      />
      <el-table-column
        prop="material_total_weight"
        label="消耗重量"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
import equipSelect from '@/components/select_w/equip'
import { exportExcel } from '@/utils/index'
import { xlReportWeightStatics } from '@/api/base_w_five'
export default {
  name: 'MaterialStatistics',
  components: { equipSelect },
  data() {
    return {
      search: {
        equip_no: ''
      },
      tableData: [],
      loading: false,
      searchDate: [getDay(-1) + ' ' + '08:00:00', getDay(0) + ' ' + '08:00:00']
    }
  },
  created() {
  },
  mounted() {
    this.search.st = this.searchDate ? this.searchDate[0] : ''
    this.search.et = this.searchDate ? this.searchDate[1] : ''
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        this.tableData = []
        const data = await xlReportWeightStatics('get', null, { params: this.search })
        this.tableData = data.results
      } catch (e) {
        //
      }
      this.loading = false
    },
    equipSearch(val) {
      this.search.equip_no = val
      this.getList()
    },
    changeDate(date) {
      this.search.st = date ? date[0] : ''
      this.search.et = date ? date[1] : ''
      this.getList()
    },
    exportTable() {
      exportExcel('称量机台物料统计')
    }
  }
}
function getDay(day) {
  var today = new Date()
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(targetday_milliseconds)
  var tYear = today.getFullYear()
  var tMonth = today.getMonth()
  var tDate = today.getDate()
  tMonth = doHandleMonth(tMonth + 1)
  tDate = doHandleMonth(tDate)
  return tYear + '-' + tMonth + '-' + tDate
}
function doHandleMonth(month) {
  var m = month
  if (month.toString().length === 1) {
    m = '0' + month
  }
  return m
}
</script>

<style>

</style>
