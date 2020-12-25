<template>
  <div>
    <!-- 类型管理 -->
    <el-form :inline="true">
      <el-form-item label="类型编码">
        <el-input v-model="getParams.no" @input="changSelect" />
      </el-form-item>
      <el-form-item label="类型名称">
        <el-input v-model="getParams.name" @input="changSelect" />
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
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        label="No"
        width="50"
      />
      <el-table-column
        prop="no"
        label="类型编码"
      />
      <el-table-column
        prop="name"
        label="类型名称"
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
              type="blue"
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
      title="添加备品备件类型"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="createForm" :rules="rules" :model="typeForm" label-width="100px">
        <el-form-item
          label="类型编码"
          prop="no"
        >
          <el-input v-model="typeForm.no" />
        </el-form-item>
        <el-form-item
          label="类型名称"
          prop="name"
        >
          <el-input v-model="typeForm.name" />
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
          prop="no"
        >
          <el-input v-model="typeForm.no" :disabled="true" />
        </el-form-item>
        <el-form-item
          label="类型名称"
          prop="name"
        >
          <el-input v-model="typeForm.name" />
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
import { getSpareType, putSpareType, postSpareType, deleteSpareType } from '@/api/spare-type'
import page from '@/components/page'
import { errorRepeat } from '@/utils'

export default {
  components: { page },
  data: function() {
    return {
      tableData: [],
      dialogCreateVisible: false,
      dialogEditVisible: false,
      typeForm: {
        no: '',
        name: ''
      },
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        no: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      getParams: {
        page: 1,
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
      getSpareType(this.getParams).then(response => {
        this.tableData = response.results
        this.total = response.count
      })
    },
    changSelect() {
      this.getParams.page = 1
      this.getTableData()
    },
    showCreateDialog() {
      this.typeForm = {
        no: '',
        name: ''
      }
      this.dialogCreateVisible = true
      this.$nextTick(() => {
        this.$refs.createForm.clearValidate()
      })
    },
    handleCreate() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          postSpareType(this.typeForm).then(response => {
            this.dialogCreateVisible = false
            this.$message(this.typeForm.name + '创建成功')
            this.getTableData()
          }).catch(e => {
            errorRepeat(this, e)
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
          putSpareType(this.typeForm, this.typeForm.id)
            .then(response => {
              this.dialogEditVisible = false
              this.$message(this.typeForm.name + '修改成功')
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
        deleteSpareType(row.id)
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
    }
  }
}
</script>
<style lang="scss">
</style>
