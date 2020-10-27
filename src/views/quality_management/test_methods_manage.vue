<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="检测指标">
        <detection-index @changeSelect="detectionChange" />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button @click="handleCreate">
          创建试验方法
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
      <el-table-column label="试验方法名称" prop="name" />
      <el-table-column label="试验类型" prop="test_type_name" />
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
      :title="textMap[dialogStatus] + '试验方法'"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="dataForm" :model="formData" :rules="rules" label-position="left" label-width="110px">
        <el-form-item label="试验方法名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="试验类型" prop="test_type">
          <el-select
            v-model="formData.test_type"
            placeholder="请选择试验类型"
            clearable
            @visible-change="testTypeSelectVisibleChange"
          >
            <el-option
              v-for="item in testTypeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
import { testTypes } from '@/api/base_w'
import { testMethodList, editTestMethod } from '@/api/test-method'
import DetectionIndex from '@/components/select_w/detectionIndex'

export default {
  components: { Page, DetectionIndex },
  data() {
    return {
      total: 0,
      getParams: { page: 1, test_indicator_id: null },
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
        name: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
        test_type: [{ required: true, message: '该字段不能为空', trigger: 'change' }]
      },
      testTypeOptions: []
    }
  },
  created() {
    this.getTestMethodList()
  },
  methods: {
    async getTestTypeList() {
      try {
        const { results } = await testTypes('get', null, { params: { all: 1 }})
        this.testTypeOptions = results || []
      } catch (e) {
        //
      }
    },
    testTypeSelectVisibleChange(val) {
      if (val && this.testTypeOptions.length === 0) {
        this.getTestTypeList()
      }
    },
    testTypeSelected(id) {
      this.formData.test_type = id || null
    },
    detectionChange(id) {
      this.getParams.test_indicator_id = id || null
      this.getParams.page = 1
      this.getTestMethodList()
    },
    currentChange(page) {
      this.getParams.page = page
      this.getTestMethodList()
    },
    async getTestMethodList() {
      this.listLoading = true
      try {
        const response = await testMethodList(this.getParams)
        this.total = response.count
        this.testMethosList = response.results
      // eslint-disable-next-line no-empty
      } catch (e) {
        console.log(e)
      }
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
      if (this.testTypeOptions.length === 0) {
        this.getTestTypeList()
      }
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
          console.log(this.formData, 'this.formData')
          editTestMethod('post', null, this.formData).then(() => {
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
          editTestMethod('put', formData.id, formData).then(() => {
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
        editTestMethod('delete', row.id).then(response => {
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
