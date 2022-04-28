<template>
  <div class="statisticalReportPost">
    <!-- 岗位阶梯表 -->
    <el-form :inline="true">
      <el-form-item label="岗位名称">
        <el-input v-model="search.name" clearable placeholder="岗位名称" @input="changeSearch" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-permission="['performance_job_ladder','export']"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button v-permission="['performance_job_ladder', 'add']" type="primary" @click="onSubmit">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="code"
        label="岗位编号"
        min-width="20"
      />
      <el-table-column
        prop="type"
        label="类别"
        min-width="20"
      />
      <el-table-column
        label="是否与机台关联"
        min-width="20"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.relation===true">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="岗位名称"
        min-width="20"
      />
      <el-table-column
        prop="coefficient"
        label="绩效系数%"
        min-width="20"
      />
      <el-table-column
        prop="post_standard_name"
        label="多岗位合并基准"
        min-width="20"
      />
      <el-table-column
        prop="post_coefficient"
        label="多岗位合并系数%"
        min-width="20"
      />
      <el-table-column v-if="!exportTableShow" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['performance_job_ladder', 'change']"
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="['performance_job_ladder', 'delete']"
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >删除
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
      :title="`${dialogForm.id?'编辑':'新建'}岗位阶梯表信息`"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="120px"
        :model="dialogForm"
      >
        <el-form-item label="类别" prop="type">
          <el-select v-model="dialogForm.type" placeholder="请选择" style="width:250px">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否机台关联" prop="relation">
          <el-checkbox v-model="dialogForm.relation">是否机台关联</el-checkbox>
        </el-form-item>
        <el-form-item
          label="岗位名称"
          prop="name"
        >
          <el-input v-model="dialogForm.name" style="width:250px" />
        </el-form-item>
        <el-form-item
          label="绩效系数%"
          prop="coefficient"
        >
          <el-input-number v-model="dialogForm.coefficient" :min="0" style="width:250px" />
        </el-form-item>
        <el-form-item label="合并基准" prop="post_standard">
          <el-select v-model="dialogForm.post_standard" placeholder="请选择" style="width:250px">
            <el-option
              v-for="(item,i) in [{value:1,label:'最大值'},{value:2,label:'平均值'}]"
              :key="i"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="合并系数%"
          prop="post_coefficient"
        >
          <el-input-number v-model="dialogForm.post_coefficient" :min="0" style="width:250px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { classesListUrl } from '@/api/base_w'
import { exportExcel } from '@/utils/index'
import { performanceJobLadder } from '@/api/jqy'
export default {
  name: 'StatisticalReportPost',
  components: { page },
  data() {
    return {
      search: {},
      tableData: [],
      total: 0,
      loading: false,
      options: [],
      dialogVisible: false,
      exportTableShow: false,
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        coefficient: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'change' }],
        relation: [{ required: true, message: '不能为空', trigger: 'change' }],
        post_standard: [{ required: true, message: '不能为空', trigger: 'change' }],
        post_coefficient: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      dialogForm: {},
      btnLoading: false
    }
  },
  created() {
    this.getList()
    this.getTypeList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await performanceJobLadder('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getTypeList() {
      const obj = { all: 1, class_name: '绩效计算岗位类别' }
      const data = await classesListUrl('get', null, { params: obj })
      this.options = data.results
    },
    changeSearch() {
      this.search.page = 1
      this.$debounce(this, 'getList')
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    },
    async onSubmit() {
      this.dialogForm = { coefficient: null, relation: true, post_standard: 1, post_coefficient: 100 }
      this.dialogVisible = true
    },
    showEditDialog(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleDelete: function(row) {
      this.$confirm('此操作将删除' + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        performanceJobLadder('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    handleClose(done) {
      this.dialogVisible = false
      this.$refs.createForm.resetFields()
      if (done) {
        done()
      }
    },
    async exportTable() {
      await this.$set(this, 'exportTableShow', true)
      await exportExcel('岗位阶梯表')
      setTimeout(() => {
        this.exportTableShow = false
      }, 300)
    },
    submitFun() {
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoading = true
            const _api = this.dialogForm.id ? 'put' : 'post'
            await performanceJobLadder(_api, this.dialogForm.id || null, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.handleClose(null)
            this.getList()
            this.btnLoading = false
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

<style lang="scss">
</style>
