<template>
  <div class="scheduleRealInventory">
    <!-- 炼胶实时库存及预警-->
    <el-form
      :inline="true"
    >
      <el-form-item label="规格">
        <el-input
          v-model="search.production_no"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['equip_fault_signal', 'add']" type="primary" @click="getList">查询</el-button>
        <el-button v-permission="['equip_fault_signal', 'export']" type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :row-class-name="tableRowClassName"
      border
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
      />
      <el-table-column
        prop="name"
        label="规格"
      />
      <el-table-column
        prop="name"
        label="安全库存(吨)"
      />
      <el-table-column
        prop="name"
        label="日均用量(吨)"
      />
      <el-table-column
        prop="name"
        label="车间库存(吨)"
      />
      <el-table-column
        prop="name"
        label="属地库存(吨)"
      />
      <el-table-column
        prop="available_time"
        label="可用时间(天)"
      />
      <el-table-column
        prop="name"
        label="备注(加硫不合格待处理)"
      />
    </el-table>
    <el-alert style="color:black" title="表格背景色说明：黄色预警-可用天数小于1.5且大于等于1.2，红色报警-可用天数小于1.2" type="success" />
  </div>
</template>

<script>
export default {
  name: 'ScheduleRealInventory',
  components: {},
  data() {
    return {
      search: {},
      loading: false,
      btnExportLoad: false,
      tableData: []
    }
  },

  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        // this.loading = true
        // const data = await testTypes('get', null, { params: { all: 1 }})
        // this.tableData = data || []
        // this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeSearch() {
      this.$debounce(this, 'getList')
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.available_time < 1.2) {
        return 'maxwarning-row'
      } else if (row.available_time < 1.5 && row.available_time >= 1.2) {
        return 'warning-row'
      }
    },
    exportTable() {
      // this.btnExportLoad = true
      // const obj = Object.assign({ export: 1 }, this.search)
      // const _api = equipComponentDown
      // _api(obj)
      //   .then(res => {
      //     const link = document.createElement('a')
      //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      //     link.style.display = 'none'
      //     link.href = URL.createObjectURL(blob)
      //     link.download = '设备部件定义.xlsx' // 下载的文件名
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

<style lang='scss'>
.scheduleRealInventory{
  .dialog-footer{
    width:100%;
    text-align: right;
  }
  .el-table .warning-row {
    background: #FACD91;
  }
  .el-table .maxwarning-row {
    color: black;
    background: #D9001B;
  }
  .el-table__row:hover > td {
    background-color: transparent !important;
  }
  .el-table__row--striped:hover > td {
    background-color: transparent !important;
  }}
</style>
