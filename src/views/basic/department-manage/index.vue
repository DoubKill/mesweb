<template>
  <div v-loading="loading">
    <!-- 位置点管理 基础信息里面的-->
    <el-form
      :inline="true"
    >
      <el-form-item label="部门名称">
        <el-input
          v-model="name"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="部门编号">
        <el-input
          v-model="section_id"
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          v-permission="['department','add']"
          @click="showCreateDialog"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loadingTable"
      border
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        updated
        upstream
        align="center"
        width="50"
        type="index"
        label="No"
      />
      <el-table-column
        prop="name"
        label="部门名称"
      />
      <el-table-column
        prop="section_id"
        label="部门编号"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['department','change']"
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              :disabled="disabled"
              @click="showWaterDialog(scope.row)"
            >查看</el-button>
            <el-button
              v-permission="['department','delete']"
              size="mini"
              type="danger"
              @click="handleEquipCateDelete(scope.row)"
            >{{ scope.row.delete_flag ? '启用' : '停用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="count"
      :current-page="getParams.page"
      @currentChange="changePage"
    />
    <el-dialog
      :title="sercialForm.id?'编辑部门':'新增部门'"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :visible.sync="dialogEditVisible"
    >
      <el-form
        ref="sercialForm"
        :rules="rules"
        :model="sercialForm"
        inline
        label-width="100px"
      >
        <el-form-item
          label="部门名称"
          prop="name"
        >
          <el-input v-model="sercialForm.name" />
        </el-form-item>
        <el-form-item
          label="部门编号"
          prop="section_id"
        >
          <el-input v-model="sercialForm.section_id" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="btnloading"
          @click="handleEditEquip('sercialForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="查看部门人员"
      :visible.sync="dialogWaterVisible"
      :close-on-click-modal="false"
    >
      <div class="tag-group">
        <el-tag v-for="item in WaterForm" :key="item" effect="dark">{{ item }}</el-tag>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { departmentManage } from '@/api/department-manage'
import page from '@/components/page'
export default {
  name: 'DepartmenManage',
  components: { page },
  data() {
    return {
      getParams: {
        page: 1
      },
      name: '',
      section_id: '',
      count: 0,
      disabled: false,
      currentPage: 1,
      btnloading: false,
      btnloading2: false,
      loading: true,
      loadingTable: false,
      sercialForm: {
        name: '',
        section_id: ''
      },
      WaterForm: [],
      isError: false,
      isErrorOldPassword: false,
      dialogCreateVisible: false,
      dialogEditVisible: false,
      dialogWaterVisible: false,
      tableData: [],
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        section_id: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },

  created() {
    // this.loading = true
    this.currentChange()
  },
  methods: {
    currentChange() {
      const app = this
      if (!this.loading) {
        this.loadingTable = true
      }
      departmentManage('get', null, { params: this.getParams }).then((response) => {
        this.count = response.count || 0
        app.tableData = response.results || []
        this.loading = false
        this.loadingTable = false
        // eslint-disable-next-line handle-callback-err
      }).catch((error) => {
        this.loading = false
        this.loadingTable = false
      })
    },
    changePage(page) {
      this.getParams['page'] = page
      this.currentChange()
    },
    changeSearch() {
      // console.log(page)
      this.getParams['name'] = this.name
      this.getParams['section_id'] = this.section_id
      this.getParams.page = 1
      this.currentChange()
    },
    async dedpartmentDel(id) {
      try {
        await departmentManage('delete', id, {})
      } catch (e) { throw new Error(e) }
    },
    // 查看
    showWaterDialog: function(row) {
      if (row.users.length === 0) {
        this.$message({ message: '此人员数据为空', type: 'warning' })
      } else {
        this.WaterForm = JSON.parse(JSON.stringify(row)).users
        this.dialogWaterVisible = true
      }
    },
    // 新建
    clearsercialForm() {
      this.sercialForm = {
        name: '',
        section_id: ''
      }
    },
    showCreateDialog() {
      this.clearsercialForm()
      if (this.$refs['sercialForm']) { this.$refs['sercialForm'].resetFields() }
      this.dialogEditVisible = true
    },
    handleClose(done) {
      this.$refs['sercialForm'].resetFields()
      this.isError = false
      this.isErrorOldPassword = false
      done()
    },
    // 编辑
    showEditDialog: function(row) {
      this.sercialForm = Object.assign({}, row)
      this.dialogEditVisible = true
    },
    // 编辑提交
    handleEditEquip: function(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.btnloading = true
          const type = this.sercialForm.id ? 'put' : 'post'
          const id = this.sercialForm.id ? this.sercialForm.id : ''
          departmentManage(type, id, { data: { ...this.sercialForm }}).then(response => {
            console.log(response)
            this.dialogEditVisible = false
            this.$message.success(this.sercialForm.id ? '编辑成功' : '创建成功')
            this.currentChange()
            this.btnloading = false
          }).catch(error => { error })
        } else {
          return false
        }
      })
    },
    // 停用
    handleEquipCateDelete: function(row) {
      console.log(row)
      var str = row.delete_flag ? '启用' : '停用'
      this.$confirm('此操作将' + str + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        try {
          departmentManage('delete', row.id, {
          }).then(response => {
            this.$message({ message: '操作成功', type: 'success' })
            this.currentChange()
          })
        } catch (e) { e }
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
