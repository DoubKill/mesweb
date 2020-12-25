<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="启用状态">
        <el-select
          v-model="status"
          clearable
          placeholder="请选择"
          @change="searchChange"
        >
          <el-option
            v-for="item in statusList"
            :key="item.use_flag"
            :label="item.name"
            :value="item.use_flag"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-permission="['delivery_address', 'add']"
          @click="showCreateDialog"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      fit
      style="width: 100%"
      :data="tableData"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="发货目的地" align="center" prop="name" />
      <el-table-column label="发货地编码" align="center" prop="no" />
      <el-table-column label="状态" align="center" prop="use_flag" :formatter="formatter" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['delivery_address', 'change']"
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['delivery_address', 'delete']"
              size="mini"
              type="blue"
              @click="handleData(scope.row)"
            >{{ scope.row.use_flag ? '停用' : '启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="created_date" />
      <el-table-column label="创建人" align="center" prop="create_user_name" />
      <el-table-column label="更新时间" align="center" prop="last_updated_date" />
      <el-table-column label="更新人" align="center" prop="update_user_name" />
    </el-table>
    <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <el-dialog
      title="新建发货地"
      :visible.sync="createDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="Form" :rules="rules" label-width="100px" :model="createForm">
        <el-form-item
          label="发货目的地"
          prop="name"
        >
          <el-input v-model="createForm.name" />
        </el-form-item>
        <el-form-item
          label="发货地编码"
          prop="no"
        >
          <el-input v-model="createForm.no" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleCreate()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑发货地"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="Form" :rules="rules" label-width="100px" :model="editForm">
        <el-form-item
          label="发货目的地"
          prop="name"
        >
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item
          label="发货地编码"
        >
          {{ editForm.no }}
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEdit()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDispatchLocation, postDispatchLocation, putDispatchLocation, deleteDispatchLocation } from '@/api/receive'
import page from '@/components/page'
export default {
  components: { page },
  data() {
    return {
      tableData: [],
      status: '',
      statusList: [{ use_flag: 'True', name: '启用' }, { use_flag: 'False', name: '停用' }],
      getParams: {
        page: 1
      },
      createDialogVisible: false,
      createForm: {},
      editDialogVisible: false,
      editForm: {},
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        no: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      total: 1
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      getDispatchLocation(this.getParams).then(response => {
        this.tableData = response.results
        this.total = response.count
      })
    },
    searchChange() {
      this.getParams.use_flag = this.status
      this.getParams.page = 1
      this.getTableData()
    },
    formatter(row, column) {
      return row.use_flag ? '启用' : '停用'
    },
    showCreateDialog() {
      this.createForm = {}
      this.createDialogVisible = true
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
    },
    showEditDialog(row) {
      this.editForm = Object.assign({}, row)
      this.editDialogVisible = true
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
    },
    handleCreate() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          postDispatchLocation(this.createForm)
            .then(response => {
              this.createDialogVisible = false
              this.$message('创建成功')
              this.getParams.page = 1
              this.getTableData()
            })
        }
      })
    },
    handleEdit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          putDispatchLocation(this.editForm, this.editForm.id)
            .then(response => {
              this.editDialogVisible = false
              this.$message('修改成功')
              this.getParams.page = 1
              this.getTableData()
            })
        }
      })
    },
    handleData(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将 ' + str + ' 发货目的地：' + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDispatchLocation(row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getParams.page = 1
            this.getTableData()
          }).catch(function() {

          })
      })
    },
    currentChange(page) {
      this.getParams.page = page
      this.getTableData()
    }
  }
}
</script>

<style>

</style>
