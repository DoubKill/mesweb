<template>
  <div>
    <!-- 基本信息管理 -->
    <el-form :inline="true">
      <el-form-item label="物料编码">
        <el-input v-model="getParams.no" @input="changSelect" />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input v-model="getParams.name" @input="changSelect" />
      </el-form-item>
      <el-form-item label="物料类型">
        <el-select
          v-model="getParams.type_name"
          placeholder="请选择"
          clearable
          @change="getTableData"
          @visible-change="visibleChange"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
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
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          @click="showCreateDialog"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        label="No"
        width="50"
      />
      <el-table-column
        prop="type_name"
        label="物料类型"
      />
      <el-table-column
        prop="no"
        label="物料编码"
      />
      <el-table-column
        prop="name"
        label="物料名称"
      />
      <el-table-column
        prop="cost"
        label="单价（元）"
      />
      <el-table-column
        prop="lower"
        label="安全库存下限"
      />
      <el-table-column
        prop="upper"
        label="安全库存上限"
      />
      <el-table-column
        prop="unit"
        label="单位"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >{{ scope.row.delete_flag?'启用':'停用' }}
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
      title="添加备品备件信息"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="createForm" :rules="rules" :model="spareForm" label-width="120px">
        <el-form-item
          label="物料类型"
          prop="type"
        >
          <el-select v-model="spareForm.type" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="物料编码"
          prop="no"
        >
          <el-input v-model="spareForm.no" />
        </el-form-item>
        <el-form-item
          label="物料名称"
          prop="name"
        >
          <el-input v-model="spareForm.name" />
        </el-form-item>
        <el-form-item
          label="单价（元）"
          prop="cost"
        >
          <el-input v-model="spareForm.cost" />
        </el-form-item>
        <el-form-item
          label="安全库存下限"
          prop="lower"
        >
          <el-input v-model="spareForm.lower" />
        </el-form-item>
        <el-form-item
          label="安全库存上限"
          prop="upper"
        >
          <el-input v-model="spareForm.upper" />
        </el-form-item>
        <el-form-item
          label="单位"
          prop="unit"
        >
          <el-input v-model="spareForm.unit" />
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
      title="编辑备品备件信息"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="editForm" :rules="rules" :model="spareForm" label-width="120px">
        <el-form-item
          label="物料类型"
          prop="type"
        >
          <el-select v-model="spareForm.type" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="物料编码"
          prop="no"
        >
          <el-input v-model="spareForm.no" />
        </el-form-item>
        <el-form-item
          label="物料名称"
          prop="name"
        >
          <el-input v-model="spareForm.name" />
        </el-form-item>
        <el-form-item
          label="单价（元）"
          prop="cost"
        >
          <el-input v-model="spareForm.cost" />
        </el-form-item>
        <el-form-item
          label="安全库存下限"
          prop="lower"
        >
          <el-input v-model="spareForm.lower" />
        </el-form-item>
        <el-form-item
          label="安全库存上限"
          prop="upper"
        >
          <el-input v-model="spareForm.upper" />
        </el-form-item>
        <el-form-item
          label="单位"
          prop="unit"
        >
          <el-input v-model="spareForm.unit" />
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
import { getSparepartsSpare,
  putSparepartsSpare,
  postSparepartsSpare,
  deleteSparepartsSpare,
  getSpareImportExport,
  postSpareImportExport } from '@/api/spareparts-spare'
import page from '@/components/page'
import { getSpareType } from '@/api/spare-type'

export default {
  components: { page },
  data: function() {
    return {
      tableData: [],
      typeOptions: [],
      dialogCreateVisible: false,
      dialogEditVisible: false,
      spareForm: {
        type: '',
        name: '',
        no: '',
        cost: '',
        lower: '',
        upper: '',
        unit: ''
      },
      rules: {
        type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        no: [{ required: true, message: '不能为空', trigger: 'blur' }],
        cost: [{ required: true, message: '不能为空', trigger: 'blur' }],
        lower: [{ required: true, message: '不能为空', trigger: 'blur' }],
        upper: [{ required: true, message: '不能为空', trigger: 'blur' }],
        unit: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      getParams: {
        page: 1,
        type_name: '',
        no: '',
        name: ''
      },
      currentPage: 1,
      total: 1
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      getSparepartsSpare(this.getParams).then(response => {
        this.tableData = response.results
        this.total = response.count
      })
    },
    getTypeOptions() {
      getSpareType({ all: 1 }).then(response => {
        this.typeOptions = response.results
      })
    },
    visibleChange(visible) {
      if (visible) {
        this.getTypeOptions()
      }
    },
    changSelect() {
      this.getParams.page = 1
      this.getTableData()
    },
    showCreateDialog() {
      this.getTypeOptions()
      this.spareForm = {
        type: '',
        name: '',
        no: '',
        cost: '',
        lower: '',
        upper: '',
        unit: ''
      }
      this.dialogCreateVisible = true
      this.$nextTick(() => {
        this.$refs.createForm.clearValidate()
      })
    },
    handleCreate() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          postSparepartsSpare(this.spareForm).then(response => {
            this.dialogCreateVisible = false
            this.$message(this.spareForm.name + '创建成功')
            this.getTableData()
          })
        }
      })
    },
    showEditDialog: function(row) {
      this.getTypeOptions()
      this.spareForm = Object.assign({}, row)
      this.dialogEditVisible = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    handleEdit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          putSparepartsSpare(this.spareForm, this.spareForm.id)
            .then(response => {
              this.dialogEditVisible = false
              this.$message(this.spareForm.name + '修改成功')
              this.getTableData()
              // this.currentChange(this.currentPage)
            })
        }
      })
    },
    handleDelete: function(row) {
      var str = row.delete_flag ? '启用' : '停用'
      this.$confirm('此操作将' + str + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSparepartsSpare(row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getTableData()
          })
      })
    },
    templateDownload() {
      getSpareImportExport().then(response => {
        this.$message({
          type: 'success',
          message: '下载成功!'
        })
      })
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      postSpareImportExport(formData).then(response => {
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
      })
    },
    currentChange(page, pageSize) {
      this.getParams.page = page
      this.getParams.page_size = pageSize
      this.getTableData()
    }
  }
}
</script>
<style lang="scss">
</style>
