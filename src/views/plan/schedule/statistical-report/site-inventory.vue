<template>
  <div>
    <!-- 炼胶8点现场库存 -->
    <el-form
      :inline="true"
    >
      <el-form-item label="日期">
        <el-date-picker
          v-model="search.day_time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="getList"
        />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input
          v-model="search.section_id"
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
      border
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        header-align="center"
        prop="name"
        label="物料编码"
      />
      <el-table-column
        header-align="center"
        label="胶片库"
      >
        <el-table-column
          header-align="center"
          label="数量(车)"
        />
        <el-table-column
          header-align="center"
          label="重量(kg)"
        />
      </el-table-column>
      <el-table-column
        header-align="center"
        label="线边库(胶片)"
      >
        <el-table-column
          header-align="center"
          label="数量(车)"
        />
        <el-table-column
          header-align="center"
          label="重量(kg)"
        />
      </el-table-column>
      <el-table-column
        header-align="center"
        label="其他区域(胶片)"
      >
        <el-table-column
          header-align="center"
          label="数量(车)"
        />
        <el-table-column
          header-align="center"
          label="重量(kg)"
        />
      </el-table-column>
      <el-table-column
        header-align="center"
        label="线边库(细料)"
      >
        <el-table-column
          header-align="center"
          label="数量(包)"
        />
        <el-table-column
          header-align="center"
          label="重量(kg)"
        />
      </el-table-column>
      <el-table-column
        header-align="center"
        label="硫磺库"
      >
        <el-table-column
          header-align="center"
          label="数量(托)"
        />
        <el-table-column
          header-align="center"
          label="重量(kg)"
        />
      </el-table-column>
      <el-table-column
        header-align="center"
        label="炭黑库"
      >
        <el-table-column
          header-align="center"
          label="数量(托)"
        />
        <el-table-column
          header-align="center"
          label="重量(kg)"
        />
      </el-table-column>
      <el-table-column
        header-align="center"
        label="原材料库"
      >
        <el-table-column
          header-align="center"
          label="数量(托)"
        />
        <el-table-column
          header-align="center"
          label="重量(kg)"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ScheduleSiteInventory',
  components: {},
  data() {
    return {
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

<style scoped lang='scss'>
</style>
