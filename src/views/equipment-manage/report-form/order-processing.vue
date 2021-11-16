<template>
  <div>
    <!-- 工单处理时间分析报表 -->
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
    >
      <el-table-column
        prop="order_id"
        label="计划编号"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="计划名称"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="工单编号"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="作业类别"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="派单时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="接单时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="维修时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="验收时间（分钟）"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="开机时间（分钟）"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'EquipmentReportFormOrderProcessing',
  data() {
    return {
      dateValue: [],
      btnExportLoad: false,
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
        const obj = {}
        Object.assign(obj, this.search)
        // const data = await equipWarehouseRecord('get', null, { params: obj })
        // this.tableData = data.results || []
        // this.total = data.count
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
      this.btnExportLoad = true
      // const obj = Object.assign({ export: 1 }, this.search)
      // const _api = equipWarehouseRecord
      // _api('get', null, { params: obj, responseType: 'blob' })
      //   .then(res => {
      //     const link = document.createElement('a')
      //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      //     link.style.display = 'none'
      //     link.href = URL.createObjectURL(blob)
      //     link.download = '备件出入库履历.xlsx' // 下载的文件名
      //     document.body.appendChild(link)
      //     link.click()
      //     document.body.removeChild(link)
      //     this.btnExportLoad = false
      //   }).catch(e => {
      //     this.btnExportLoad = false
      //   })
    }
  }
}
</script>

<style>

</style>
