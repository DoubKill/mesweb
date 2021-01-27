<template>
  <div>
    <!-- 停机类型定义 -->
    <el-button style="margin-bottom:10px" @click="add">新建</el-button>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        label="No"
        width="40"
        type="index"
      />
      <el-table-column
        prop="date"
        label="停机类型"
      />
      <el-table-column
        prop="name"
        label="停机编码"
      />
      <el-table-column
        prop="date"
        label="创建人"
      />
      <el-table-column
        prop="name"
        label="创建时间"
      />
      <el-table-column
        prop="address"
        label="操作"
      >
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(row)"
        >删除</el-button>
      </el-table-column>
    </el-table>

    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="200"
      :before-close="handleClose"
    >
      <el-form
        ref="editForm"
        :rules="rules"
        :model="editForm"
        label-width="120px"
      >
        <el-form-item
          label="停机类型"
          prop="type"
        >
          <el-input v-model="editForm.type" />
        </el-form-item>
        <el-form-item
          label="停机类型编码"
          prop="name"
        >
          <el-input v-model="editForm.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" @click="submitBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      editForm: {
        type: null,
        name: null
      }
    }
  },
  methods: {
    async getList() {
      try {
        // const data = await globalCodesUrl('get', { params: { all: 1, class_name: '发货类型' }})
        // this.options = data.results || []
      } catch (e) {
        //
      }
    },
    add() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$refs.editForm.clearValidate()
      this.$refs.editForm.resetFields()
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    submitBtn() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          // postLocation(this.locationForm).then(response => {
          //   this.dialogCreateVisible = false
          //   this.$message('创建成功')
          //   this.getList()
          // })
        }
      })
    },
    handleDelete: function(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteMaterialLocationBinding(row.id)
        //   .then(response => {
        //     this.$message({
        //       type: 'success',
        //       message: '删除成功!'
        //     })
        //     this.getParams.page = 1
        //     this.getList()
        //   }).catch(e=>{
        //     this.$message.error('删除失败')
        // })
      })
    }
  }
}
</script>

<style>

</style>
