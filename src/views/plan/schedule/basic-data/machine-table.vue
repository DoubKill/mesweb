<template>
  <div>
    <!-- 定机表(段次及主副机台) -->
    <el-form
      :inline="true"
    >
      <el-form-item label="胶料类别">
        <el-select
          v-model="search.print_type"
          placeholder="请选择"
          @change="getList"
        >
          <el-option
            v-for="item in ['车胎','实心胎']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="配方名称">
        <el-input
          v-model="search.section_id"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['equip_fault_signal', 'export']" type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
        <el-upload
          v-permission="['equip_fault_signal', 'import']"
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
        <el-button v-permission="['equip_fault_signal', 'add']" type="primary">新建</el-button>
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
        label="胶料类别"
      />
      <el-table-column
        header-align="center"
        prop="name"
        label="段数"
      />
      <el-table-column
        header-align="center"
        prop="production_no"
        label="配方名称"
      />
      <el-table-column
        header-align="center"
        label="混炼MB"
      >
        <el-table-column
          header-align="center"
          label="配方机台"
        >
          <el-table-column
            header-align="center"
            label="主"
          />
          <el-table-column
            header-align="center"
            label="副"
          />
        </el-table-column>
      </el-table-column>
      <el-table-column
        header-align="center"
        label="加硫FM"
      >
        <el-table-column
          header-align="center"
          label="配方机台"
        >
          <el-table-column
            header-align="center"
            label="主"
          />
          <el-table-column
            header-align="center"
            label="副"
          />
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ScheduleMachineTable',
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
    },
    Upload(param) {
      // const formData = new FormData()
      // formData.append('file', param.file)
      // equipFaultSignalImport('post', null, { data: formData }).then(response => {
      //   this.$message({
      //     type: 'success',
      //     message: response
      //   })
      //   this.search.page = 1
      //   this.getList()
      // })
    }
  }

}
</script>

<style scoped lang='scss'>
</style>
