<template>
  <div v-loading="loading" class="grade_manage">
    <!-- 等级管理 -->
    <div
      v-permission="['level','add']"
      style="width:100%;text-align:right;margin-bottom:20px;"
    >
      <el-button @click="clickAdd">新增</el-button>
    </div>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        label="No"
      />
      <el-table-column
        prop="level"
        label="等级"
      />
      <el-table-column
        prop="deal_result"
        label="检验结果"
      />
      <el-table-column
        prop="created_username"
        label="创建人"
      />
      <el-table-column
        prop="created_date"
        label="创建时间"
      />
      <!-- <el-table-column
        prop="last_updated_user"
        label="更新人"
      />
      <el-table-column
        prop="last_updated_date"
        label="更新时间"
      /> -->
      <el-table-column
        ref="el-table-column"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button v-permission="['level','delete']" size="small" @click="clickDelete(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :current-page="page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="等级" prop="level">
          <el-input-number v-model="ruleForm.level" controls-position="right" :min="1" :step="1" step-strictly />
        </el-form-item>
        <el-form-item label="检测结果" prop="deal_result">
          <el-input v-model="ruleForm.deal_result" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { levelResult } from '@/api/base_w'
import page from '@/components/page'
export default {
  name: 'GradeManage',
  components: { page },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      btnLoading: false,
      loading: false,
      page: 1,
      total: 0,
      ruleForm: {
        level: undefined,
        deal_result: ''
      },
      rules: {
        level: [
          { required: true, message: '请填写等级', trigger: 'blur' }
        ],
        deal_result: [
          { required: true, message: '请填写检测结果', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    setDome(flag) {
      return this.$refs[flag]
    },
    async getList() {
      try {
        this.loading = true
        const data = await levelResult('get', null, { params: { page: this.page }})
        this.total = data.count
        this.tableData = data.results
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    clickDelete(index, row) {
      this.$confirm(
        '是否删除?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        await levelResult('delete', row.id)
        this.$message.success('删除成功')
        this.tableData.splice(index, 1)
      })
    },
    clickAdd() {
      this.dialogVisible = true
    },
    currentChange(page) { this.page = page },
    handleClose(done) {
      this.$refs.ruleForm.resetFields()
      this.btnLoading = false
      done()
    },
    submitAdd() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            await levelResult('post', null, { data: this.ruleForm })
            this.$message.success('新建成功')
            this.getList()
            this.btnLoading = false
            this.ruleForm = {}
            this.dialogVisible = false
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

<style lang="scss" scoped>
.grade_manage{
  .el-input {
    width: 200px;
  }
}
</style>
