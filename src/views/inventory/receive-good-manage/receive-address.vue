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
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
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
      <el-table-column label="发货目的地" align="center" prop="address" />
      <el-table-column label="发货地编码" align="center" prop="address_no" />
      <el-table-column label="状态" align="center" prop="use_flag" :formatter="formatter" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleData(scope.row)"
            >{{ scope.row.use_flag ? '停用' : '启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="period_of_validity" />
      <el-table-column label="创建人" align="center" prop="safety_inventory" />
      <el-table-column label="更新时间" align="center" prop="validity_unit" />
      <el-table-column label="更新人" align="center" prop="validity_unit" />
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
          prop="address"
        >
          <el-input v-model="createForm.address" />
        </el-form-item>
        <el-form-item
          label="发货地编码"
          prop="addressNo"
        >
          <el-input v-model="createForm.addressNo" />
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
          prop="address"
        >
          <el-input v-model="editForm.address" />
        </el-form-item>
        <el-form-item
          label="发货地编码"
        >
          111111111111111
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
import page from '@/components/page'
export default {
  components: { page },
  data() {
    return {
      tableData: [{ 'address': '安吉', 'address_no': 'anji', 'use_flag': true }],
      status: '',
      statusList: ['启用', '停用'],
      getParams: {
        page: 1
      },
      createDialogVisible: false,
      createForm: {},
      editDialogVisible: false,
      editForm: {},
      rules: {
        address: [{ required: true, message: '不能为空', trigger: 'blur' }],
        addressNo: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      total: 1
    }
  },
  created() {
  },
  methods: {
    getTableList() {},
    searchChange() {},
    formatter(row, column) {
      return row.use_flag ? '启用' : '停用'
    },
    showCreateDialog() {
      this.createDialogVisible = true
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
    },
    showEditDialog(row) {
      this.editDialogVisible = true
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
    },
    handleCreate() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.createDialogVisible = false
        }
      })
    },
    handleEdit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          this.editDialogVisible = false
        }
      })
    },
    handleData(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将 ' + str + ' 发货目的地：' + row.address + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.use_flag = !row.use_flag
      })
    },
    currentChange() {}
  }
}
</script>

<style>

</style>
