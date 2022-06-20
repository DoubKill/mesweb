<template>
  <div>
    <!-- 称量物料消耗汇总表 -->
    <el-form :inline="true">
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
      <el-form-item label="称量设备">
        <equipSelect
          :equip_no_props="search.s_equip_no"
          equip-type="称量设备"
          @changeSearch="equipSearch"
        />
      </el-form-item>
      <el-form-item label="配方">
        <el-input v-model="search.product_no" clearable placeholder="配方" />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input v-model="search.material_name" clearable placeholder="物料名称" />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['equip_statement','export']"
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width:60%"
    >
      <el-table-column
        prop="s_equip_no"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="recipe"
        label="配方"
        min-width="40"
      />
      <el-table-column
        prop="material"
        label="物料名称"
        min-width="40"
      />
      <el-table-column
        prop="material_total_weight"
        label="实际重量（kg）"
        min-width="20"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { xlReportWeightStatics } from '@/api/base_w_five'
import Page from '@/components/page'
import equipSelect from '@/components/select_w/equip'
export default {
  name: 'MaterialStatistics',
  components: { Page, equipSelect },
  data() {
    return {
      search: {
        s_equip_no: '',
        t_report_flag: 1,
        page: 1,
        page_size: 10
      },
      tableData: [],
      loading: false,
      searchDate: [getDay(-1) + ' ' + '8:00:00', getDay(0) + ' ' + '8:00:00'],
      total: 0,
      btnExportLoad: false
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.search.st = this.searchDate ? this.searchDate[0] : ''
    this.search.et = this.searchDate ? this.searchDate[1] : ''
  },
  methods: {
    async getList() {
      try {
        if (getDaysBetween(this.search.st, this.search.et) >= 1) {
          this.$message('查询日期间隔不得超过15天')
          return
        }
        this.loading = true
        this.tableData = []
        const data = await xlReportWeightStatics('get', null, { params: this.search })
        this.tableData = data.page_result
        this.total = data.total_data
      } catch (e) {
        //
      }
      this.loading = false
    },
    equipSearch(val) {
      this.search.s_equip_no = val
    //   this.getList()
    },
    changeDate(date) {
      this.search.st = date ? date[0] : ''
      this.search.et = date ? date[1] : ''
    //   this.getList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      xlReportWeightStatics('get', null, { responseType: 'blob', params: obj })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '称量物料消耗汇总表.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
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
function getDaysBetween(dateString1, dateString2) {
  var startDate = Date.parse(dateString1)
  var endDate = Date.parse(dateString2)
  if (startDate > endDate) {
    return 0
  }
  var days = (endDate - startDate) / (15 * 24 * 60 * 60 * 1000)
  return days
}
</script>

<style>

</style>
