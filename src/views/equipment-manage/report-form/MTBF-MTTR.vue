<template>
  <div>
    <!-- MTBF/MTTR分析报表 -->
    <el-form :inline="true">
      <el-form-item>
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button type="primary" @click="dialogVisible=true">目标MTBF查看</el-button>
        <el-button type="primary" @click="dialogVisible=true">目标MTTR查看</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="order_id"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="年月"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="理论生产总时间"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="故障时间"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="故障次数"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="MTBF"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="MTTR"
        min-width="20"
      />
      <el-table-column
        prop="order_id"
        label="故障率"
        min-width="20"
      />
    </el-table>
    <el-dialog
      :title="'MTBF/MTTR'"
      width="80%"
      :visible.sync="dialogVisible"
    >
      <mtbf />
    </el-dialog>
  </div>
</template>

<script>
import mtbf from '../master-data/MTBF-MTTR'
export default {
  name: 'EquipmentReportFormMTBFMTTR',
  components: { mtbf },
  data() {
    return {
      dateValue: [],
      btnExportLoad: false,
      search: {},
      dialogVisible: false,
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

