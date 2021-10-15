<template>
  <div class="region-style">
    <!-- 设备部位定义 -->
    <el-form :inline="true">
      <el-form-item label="所属主设备种类">
        <el-select v-model="formInline.category_no" placeholder="请选择" :disabled="isMultiple===true" clearable @change="changeSearch">
          <el-option
            v-for="item in options"
            :key="item.category_name"
            :label="item.category_name"
            :value="item.category_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部位分类">
        <el-select v-model="formInline.global_name" placeholder="请选择" clearable @change="changeSearch">
          <el-option
            v-for="item in GlobalList"
            :key="item.global_name"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部位编码">
        <el-input v-model="formInline.part_code" clearable placeholder="部位编码" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="部位名称">
        <el-input v-model="formInline.part_name" clearable placeholder="部位名称" @input="changeSearch" />
      </el-form-item>
      <el-form-item v-if="!equipType" style="float:right">
        <el-button type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
        <el-upload
          style="margin:0 8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button type="primary">导入Excel</el-button>
        </el-upload>
        <el-button type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
      border
      @current-change="handleSelectionChange"
    >
      <el-table-column
        prop="category_no"
        label="所属主设备种类"
        min-width="20"
      />
      <el-table-column
        prop="global_name"
        label="部位分类"
        min-width="20"
      />
      <el-table-column
        prop="part_code"
        label="部位代码"
        min-width="20"
      />
      <el-table-column
        prop="part_name"
        label="部位名称"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="录入者"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="录入时间"
        min-width="20"
      />
      <el-table-column v-if="isMultiple===false" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
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
      :current-page="formInline.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="`${dialogForm.id?'编辑':'新建'}设备部位定义`"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="120px"
        :model="dialogForm"
      >
        <el-form-item
          label="所属主设备种类"
          prop="equip_type"
        >
          <el-select v-model="dialogForm.equip_type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.category_no"
              :label="item.category_no"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="部位分类"
          prop="global_part_type"
        >
          <el-select v-model="dialogForm.global_part_type" placeholder="请选择">
            <el-option
              v-for="item in GlobalList"
              :key="item.global_name"
              :label="item.global_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="部位代码"
          prop="part_code"
        >
          <el-input v-model="dialogForm.part_code" :disabled="dialogForm.id?true:false" />
        </el-form-item>
        <el-form-item
          label="部位名称"
          prop="part_name"
        >
          <el-input v-model="dialogForm.part_name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { equipPartNew, equipsCategory, getSupplierType, equipPartNewDown, equipPartNewImport } from '@/api/jqy'
export default {
  name: 'EquipmentMasterDataRegion',
  components: { page },
  props: {
    isMultiple: {
      type: Boolean,
      default: false
    },
    equipType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      formInline: {},
      multipleSelection: [],
      tableData: [],
      options: [],
      GlobalList: [],
      total: 0,
      btnExportLoad: false,
      loading: false,
      dialogVisible: false,
      rules: {
        part_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        part_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        equip_type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        global_part_type: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      dialogForm: {},
      btnLoading: false
    }
  },
  watch: {
    isMultiple() {
      this.formInline = {}
      this.formInline.category_no = this.equipType
      this.getList()
    }
  },
  created() {
    if (this.equipType) {
      this.formInline.category_no = this.equipType
    }
    this.getTypeNode()
    this.getList()
    this.getGlobal()
  },
  methods: {
    async getGlobal() {
      try {
        const data = await getSupplierType('get', null, { params: { all: 1, class_name: '部位分类' }})
        this.GlobalList = data.results
      } catch (error) {
        this.GlobalList = []
      }
    },
    async getTypeNode() {
      try {
        const data = await equipsCategory('get', null, { params: { all: 1 }})
        this.options = data.results || []
      } catch (e) {
        //
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipPartNew('get', null, { params: this.formInline })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      equipPartNewImport('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
        this.formInline.page = 1
        this.getList()
      })
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 })
      const _api = equipPartNewDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '设备部位定义.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    changeSearch() {
      this.formInline.page = 1
      this.getList()
    },
    currentChange(page, pageSize) {
      this.formInline.page = page
      this.formInline.page_size = pageSize
      this.getList()
    },
    onSubmit() {
      this.dialogForm = {}
      this.dialogVisible = true
    },
    getVal() {
      return this.multipleSelection
    },
    showEditDialog(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.category_no + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipPartNew('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs.createForm.resetFields()
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.dialogForm.id ? 'put' : 'post'
            await equipPartNew(_api, this.dialogForm.id || null, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.handleClose(null)
            this.getList()
            this.btnLoading = false
          } catch (e) {
            this.btnLoading = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.region-style{
  .el-input{
    width:160px;
  }
  .el-dialog .el-input{
    width:250px;
  }
}
</style>
