<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="实验指标过滤">
        <el-select />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button @click="handleCreate">
          创建实验方法
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="testMethosList"
      border
      fit
      style="width: 100%"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="实验方法名称" prop="name" />
      <el-table-column label="实验类型" prop="test_type_name" />
      <el-table-column label="检测指标" prop="test_indicator_name" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{row, $index}">
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">删除</el-button>
          <el-button size="mini" @click="handleUpdate(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page :total="total" :current-page="getParams.page" @currentChange="currentChange" />
    <el-dialog
      :title="textMap[dialogStatus] + '实验方法'"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="dataForm" :model="formData" :rules="rules" label-position="left" label-width="110px">
        <el-form-item label="实验方法名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="实验类型" prop="test_type">
          <el-select v-model="formData.test_type" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Page from '@/components/page'
import { testMethodList } from '@/api/test-method'

export default {
  components: { Page },
  data() {
    return {
      total: 0,
      getParams: { page: 1 },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      formData: {
        name: '',
        test_type: null
      },
      testMethosList: [],
      listLoading: true,
      rules: {
        name: [{ required: true, message: '该字段不能未空', trigger: 'blur' }],
        test_type: [{ required: true, message: '该字段不能未空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getTestMethodList()
  },
  methods: {
    currentChange(page) {
      this.getParams.page = page
      this.getTestMethodList()
    },
    async getTestMethodList() {
      this.listLoading = true
      try {
        const response = await testMethodList('get', null, this.getParams)
        this.total = response.count
        this.testMethosList = response.results
      // eslint-disable-next-line no-empty
      } catch (e) {}
      this.listLoading = false
    },
    resetFormData() {
      this.formData = {
        name: '',
        test_type: null
      }
    },
    handleCreate() {
      this.resetFormData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.formData = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          testMethodList('post', null, this.formData).then(() => {
            this.dialogFormVisible = false
            this.currentChange(1)
            this.$notify({
              title: '成功',
              message: `${this.formData.name}创建成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formData = Object.assign({}, this.formData)
          testMethodList('put', formData.id, formData).then(() => {
            this.dialogFormVisible = false
            this.currentChange(this.getParams.page)
            this.$notify({
              title: '成功',
              message: `${this.formData.name}更新成功`,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm(`确定删除${row.name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        testMethodList('delete', row.id).then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.currentChange(this.getParams.page)
        })
      })
    }
  }
}
</script>
