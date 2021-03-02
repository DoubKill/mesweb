<template>
  <div>
    <!-- 平台信息管理 -->
    <el-form :inline="true">
      <el-form-item label="平台:">
        <el-input v-model="search.platform" placeholder="请输入内容" @input="changeList" />
      </el-form-item>
      <el-form-item>
        <el-button @click="add">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column
        label="No"
        type="index"
        width="40"
      />
      <el-table-column
        prop="platform"
        label="平台"
        min-width="8"
      />
      <el-table-column
        prop="url"
        label="url"
        min-width="20"
        show-overflow-tooltip
      />
      <el-table-column
        prop="token"
        label="token"
        min-width="8"
      />
      <el-table-column
        prop="private_key"
        label="密钥"
        min-width="20"
        show-overflow-tooltip
      />
      <el-table-column
        prop="tag"
        label="标签"
        min-width="8"
      />
      <el-table-column
        label="操作"
        width="130"
      >
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
            >
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      :title="bindingForm.id?'编辑':'新增'"
      :visible.sync="dialogVisible"
      width="600"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="bindingForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="平台" prop="platform">
          <el-input v-model="bindingForm.platform" />
        </el-form-item>
        <el-form-item label="url" prop="url">
          <el-input v-model="bindingForm.url" />
        </el-form-item>
        <el-form-item label="密钥" prop="private_key">
          <el-input v-model="bindingForm.private_key" />
        </el-form-item>
        <el-form-item label="token" prop="token">
          <el-input v-model="bindingForm.token" />
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-input v-model="bindingForm.tag" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { platformConfig } from '@/api/base_w_two'
import page from '@/components/page'
export default {
  components: { page },
  data() {
    return {
      loading: false,
      loadingBtn: false,
      search: {
        page: 1
      },
      tableData: [],
      bindingForm: {},
      rules: {
        platform: [
          { required: true, message: '请填写平台', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请填写url', trigger: 'blur' }
        ],
        private_key: [
          { required: true, message: '请填写密钥', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await platformConfig('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
      } catch (e) {
        //
      }
      this.loading = false
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    add() {
      this.bindingForm = {}
      this.dialogVisible = true
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs.ruleForm.clearValidate()
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          this.loadingBtn = true
          const _api = this.bindingForm.id ? 'put' : 'post'
          await platformConfig(_api, this.bindingForm.id || null, { data: this.bindingForm })
          this.getList()
          this.$message.success('操作成功')
          this.loadingBtn = false
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    showEditDialog(row) {
      this.bindingForm = row
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        platformConfig('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.search.page = 1
            this.getList()
          }).catch(e => {
            this.$message.error('删除失败')
          })
      })
    }
  }
}
</script>

<style>

</style>
