<template>
  <div class="location-manage">
    <!-- 备品备件库位导入 -->
    <el-form :inline="true">
      <div v-if="!isDialog">
        <el-form-item label="物料编码:">
          <materialCodeSelect
            :is-all-obj="true"
            label-name="no"
            @changeSelect="changeMaterialCode"
          />
        </el-form-item>
        <el-form-item label="物料名称:">
          <materialCodeSelect
            :is-all-obj="true"
            @changeSelect="changeMaterialName"
          />
        </el-form-item>
        <el-form-item label="物料类型:">
          <materialTypeSelect
            @changeSelect="changeMaterialType"
          />
        </el-form-item>
        <el-form-item label="库存位:">
          <inventoryPosition @changSelect="changeInventoryPosition" />
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            v-permission="['spare_import', 'download']"
            @click="templateDownload"
          >模板下载</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <!-- <el-button>导入</el-button> -->
          <el-upload
            class="upload-demo"
            action="string"
            accept=".xls, .xlsx"
            :http-request="Upload"
            :show-file-list="false"
          >
            <el-button v-permission="['spare_import', 'import']">导入</el-button>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      :data="tableData"
      border
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
        prop="type_name"
        label="物料类型"
      />
      <el-table-column
        prop="spare_no"
        label="物料编码"
      />
      <el-table-column
        prop="spare_name"
        label="物料名称"
      />
      <el-table-column
        prop="location_name"
        label="库存位"
      />
      <el-table-column
        prop="qty"
        label="数量"
      />
      <el-table-column
        prop="unit"
        label="单位"
      />
      <el-table-column
        prop="cost"
        label="单价（元）"
      />
      <el-table-column
        prop="total_count"
        label="总价（元）"
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
import inventoryPosition from '@/components/select_w/inventoryPosition'
import materialCodeSelect from '@/components/select_w/sparePartsMCodeSelect'
import page from '@/components/page'
import { spareInventory } from '@/api/base_w_two'
import materialTypeSelect from '@/components/select_w/sparePartsMTypeSelect'
import { getSpareInventoryImportExport, postSpareInventoryImportExport } from '@/api/inventory-manage'
import { setDate } from '@/utils/index'

export default {
  name: 'InventoryUpload',
  components: { page, inventoryPosition, materialCodeSelect, materialTypeSelect },
  props: {
    isDialog: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    dialogObj: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      tableData: [],
      total: 0
    }
  },
  watch: {
    show(val) {
      if (val) {
        if (this.isDialog) {
          this.search.material_no = this.dialogObj.material__material_no
        }
        this.getList()
      }
    }
  },
  created() {
    if (this.isDialog) {
      this.search.material_no = this.dialogObj.material__material_no
    }
    this.getList()
  },
  methods: {
    async getList() {
      try {
        const data = await spareInventory('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
      } catch (e) {
        //
      }
    },
    changeInventoryPosition(obj) {
      this.search.location_name = obj ? obj.name : null
      this.search.page = 1
      this.getList()
    },
    changeMaterialCode(obj) {
      this.search.spare_no = obj ? obj.no : null
      this.search.page = 1
      this.getList()
    },
    changeMaterialName(obj) {
      this.search.spare_name = obj ? obj.name : null
      this.search.page = 1
      this.getList()
    },
    changeMaterialType(obj) {
      this.search.type_name = obj ? obj.name : null
      this.search.page = 1
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.bound === '-') {
        return 'warning-row'
      } else if (row.bound === '+') {
        return 'max-warning-row'
      }
      return ''
    },
    templateDownload() {
      getSpareInventoryImportExport().then(response => {
        const link = document.createElement('a')
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.download = `备品备件库存模板${setDate('', true)}.xls` // 下载的文件名
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      postSpareInventoryImportExport(formData).then(response => {
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
        this.search.page = 1
        this.getList()
      })
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.location-manage{
  .warning-row{
    color:red;
  }
  .max-warning-row{
    color:#e6a23c;
  }
}
</style>
