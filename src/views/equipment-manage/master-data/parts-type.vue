<template>
  <div>
    <!-- 设备部件分类 -->
    <el-form :inline="true">
      <el-form-item label="分类编号">
        <el-input v-model="getParams.component_type_code" @input="changSelect" />
      </el-form-item>
      <el-form-item label="分类名称">
        <el-input v-model="getParams.component_type_name" @input="changSelect" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button v-permission="['equip_component_type', 'export']" type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
        <el-upload
          v-permission="['equip_component_type', 'import']"
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
        <el-button v-permission="['equip_component_type', 'add']" type="primary" @click="showCreateDialog">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        label="No"
        width="50"
      />
      <el-table-column
        prop="component_type_code"
        label="类型编码"
      />
      <el-table-column
        prop="component_type_name"
        label="类型名称"
      />
      <el-table-column
        prop="created_username"
        label="录入者"
      />
      <el-table-column
        prop="created_date"
        label="录入日期"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['equip_component_type', 'change']"
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['equip_component_type', 'delete']"
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >{{ scope.row.use_flag?'停用':'启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <el-dialog
      title="添加备品备件类型"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="createForm" :rules="rules" :model="typeForm" label-width="100px">
        <el-form-item
          label="类型编码"
          prop="component_type_code"
        >
          <el-input v-model="typeForm.component_type_code" />
        </el-form-item>
        <el-form-item
          label="类型名称"
          prop="component_type_name"
        >
          <el-input v-model="typeForm.component_type_name" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogCreateVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleCreate"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑备品备件类型"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="editForm" :rules="rules" :model="typeForm" label-width="100px">
        <el-form-item
          label="类型编码"
          prop="component_type_code"
        >
          <el-input v-model="typeForm.component_type_code" :disabled="true" />
        </el-form-item>
        <el-form-item
          label="类型名称"
          prop="component_type_code"
        >
          <el-input v-model="typeForm.component_type_name" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEdit"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { equipComponentType, equipComponentTypeDown, equipComponentTypeImport } from '@/api/jqy'
// import { errorRepeat } from '@/utils'

export default {
  name: 'EquipmentMasterDataPartsType',
  components: { page },
  data: function() {
    return {
      tableData: [],
      dialogCreateVisible: false,
      dialogEditVisible: false,
      btnExportLoad: false,
      typeForm: {
        no: '',
        name: ''
      },
      loading: false,
      rules: {
        component_type_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        component_type_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      getParams: {
        page: 1
      },
      currentPage: 1,
      total: 1
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      try {
        this.loading = true
        const data = await equipComponentType('get', null, { params: this.getParams })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changSelect() {
      this.getParams.page = 1
      this.getTableData()
    },
    showCreateDialog() {
      this.typeForm = {
        component_type_code: '',
        component_type_name: ''
      }
      this.dialogCreateVisible = true
    },
    handleCreate() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          equipComponentType('post', null, { data: this.typeForm }).then(response => {
            this.dialogCreateVisible = false
            this.$message.success('创建成功')
            this.getTableData()
          }).catch(e => {
            // errorRepeat(this, e)
          })
        }
      })
    },
    showEditDialog: function(row) {
      this.typeForm = Object.assign({}, row)
      this.dialogEditVisible = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    handleEdit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          equipComponentType('put', this.typeForm.id, { data: this.typeForm })
            .then(response => {
              this.dialogEditVisible = false
              this.$message.success('修改成功')
              this.getTableData()
              // this.currentChange(this.currentPage)
            })
        }
      })
    },
    handleDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.component_type_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipComponentType('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getTableData()
          })
      })
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getTableData()
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.getParams)
      const _api = equipComponentTypeDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '设备部件分类.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      equipComponentTypeImport('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: response
        })
        this.getParams.page = 1
        this.getTableData()
      })
    }
  }
}
</script>
<style lang="scss">
</style>
