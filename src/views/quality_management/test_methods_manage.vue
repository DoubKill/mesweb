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
      :data="testMethosData"
      border
      fit
      style="width: 100%"
    >
      <el-table-column label="No" type="index" />
      <el-table-column label="实验方法名称" prop="name" />
      <el-table-column label="实验类型" prop="type" />
      <el-table-column label="检测指标" prop="indicator" />
      <el-table-column label="操作">
        <template slot-scope="{row, $index}">
          <el-button size="mini" type="danger">删除</el-button>
          <el-button size="mini" @click="handleUpdate(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="textMap[dialogStatus] + '实验方法'"
      :visible.sync="dialogFormVisible"
    >
      <el-form ref="dataForm" :model="formData" label-position="left" label-width="100px">
        <el-form-item label="实验方法名称">
          <el-input />
        </el-form-item>
        <el-form-item label="实验类型">
          <el-select />
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
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      formData: {
          id: undefined,
          
      },
      testMethosData: [{
        name: 'test1',
        type: '门尼粘度',
        indicator: '门尼'
      },
      {
        name: 'test2',
        type: '门尼粘度1',
        indicator: '门尼1'
      }
      ]
    }
  },
  methods: {
    resetFormData() {

    },
    handleCreate() {
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

    },
    updateData() {

    }
  }
}
</script>
