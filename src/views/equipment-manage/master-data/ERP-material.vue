<template>
  <div>
    <!-- ERP备件物料信息 -->
    <el-form :inline="true">
      <el-form-item label="备件分类:">
        <el-select v-model="search.equip_component_type" clearable placeholder="备件分类" style="width:150px" @change="changeSearch">
          <el-option
            v-for="item in options"
            :key="item.equip_component_type__component_type_name"
            :label="item.equip_component_type__component_type_name"
            :value="item.equip_component_type__component_type_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备件名称:">
        <el-input v-model="search.spare_name" placeholder="请输入内容" @input="debounceList" />
      </el-form-item>
      <el-form-item label="备件编码:">
        <el-input v-model="search.spare_code" placeholder="请输入内容" @input="debounceList" />
      </el-form-item>
      <el-form-item label="ERP物料信息id:">
        <el-input v-model="search.unique_id" clearable placeholder="请输入内容" @input="debounceList" />
      </el-form-item>
      <el-form-item label="规格型号:">
        <el-input v-model="search.specification" placeholder="请输入内容" @input="debounceList" />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="search.use_flag" clearable placeholder="是否启用" style="width:120px" @change="changeSearch">
          <el-option
            v-for="item in [{label:'Y',value:1},{label:'N',value:0}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商名称:">
        <el-input v-model="search.supplier_name" placeholder="请输入内容" @input="debounceList" />
      </el-form-item>
      <el-form-item style="">
        <el-button v-permission="['equip_spare_erp', 'export']" type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
        <el-upload
          v-permission="['equip_spare_erp', 'import']"
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
        <el-button v-permission="['equip_spare_erp', 'sync']" type="primary" :loading="btnExportLoad1" @click="onSubmit">同步ERP</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="spare_code"
        label="备件代码"
        width="120"
      />
      <el-table-column
        prop="spare_name"
        label="备件名称"
        min-width="20"
      />
      <el-table-column
        prop="unique_id"
        label="ERP物料信息id"
        min-width="20"
      />
      <el-table-column
        prop="equip_component_type_name"
        label="备件分类"
        width="70"
      />
      <el-table-column
        prop="specification"
        label="规格型号"
        width="80"
      />
      <el-table-column
        prop="technical_params"
        label="用途"
        width="80"
      />
      <el-table-column
        prop="unit"
        label="标准单位"
        width="70"
      />
      <el-table-column
        prop="key_parts_flag"
        label="关键部件"
        width="80"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.key_parts_flag===true">是</span>
          <span v-if="scope.row.key_parts_flag===false">否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cost"
        label="计划价格(元)"
        width="100"
      />
      <el-table-column
        prop="texture_material"
        label="材质"
        width="80"
      />
      <el-table-column
        prop="supplier_name"
        label="供应商名称"
        width="100"
      />
      <el-table-column
        prop="use_flag"
        label="是否启用"
        width="80"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.use_flag===true">Y</span>
          <span v-if="scope.row.use_flag===false">N</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_username"
        label="操作者"
        width="70"
      />
      <el-table-column
        prop="created_date"
        label="同步时间"
        width="160"
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
import page from '@/components/page'
import { equipSpareErp, equipSpareErpDown, equipSpareErpImport, getSpare } from '@/api/jqy'
import { debounce } from '@/utils'
export default {
  name: 'EquipmentMasterDataERPMaterial',
  components: { page },
  data() {
    return {
      search: {},
      loading: false,
      tableData: [],
      btnExportLoad: false,
      btnExportLoad1: false,
      total: 0,
      options: []
    }
  },
  created() {
    this.getList()
    this.getList1()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipSpareErp('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getList1() {
      try {
        const data = await equipSpareErp('get', null, { params: { all: 0 }})
        this.options = data.results || []
      } catch (e) {
        //
      }
    },
    debounceList() {
      debounce(this, 'changeSearch')
    },
    changeSearch() {
      this.search.page = 1
      this.getList()
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      equipSpareErpImport('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: response
        })
        this.search.page = 1
        this.getList()
      })
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      const _api = equipSpareErpDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = 'ERP备件物料信息.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    onSubmit() {
      this.$confirm('此操作将同步ERP物料是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.btnExportLoad1 = true
        getSpare('get', null, {})
          .then(response => {
            this.btnExportLoad1 = false
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
          .catch(response => {
            this.btnExportLoad1 = false
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
