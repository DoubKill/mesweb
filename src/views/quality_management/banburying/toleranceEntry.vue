<template>
  <div>
    <!-- 配方公差标准录入 -->
    <el-form :inline="true">
      <el-form-item style="float:right">
        <el-button type="primary" @click="showCreateDialog">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="component_type_code"
        label="规则编号"
      />
      <el-table-column
        prop="component_type_name"
        label="规则名称"
      />
      <el-table-column
        prop="created_username"
        label="区分"
      />
      <el-table-column
        prop="created_date"
        label="项目"
      />
      <el-table-column
        prop="created_date"
        label="容许差"
      />
      <el-table-column
        prop="created_date"
        label="备注"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="showEditDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
            >{{ scope.row.use_flag?'停用':'启用' }}
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
      title="新建规则"
      width="30%"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="createForm" :rules="rules" :model="dialogForm" label-width="100px">
        <el-form-item
          label="规则编号"
          prop="component_type_code"
        >
          <el-input v-model="dialogForm.component_type_code" style="width:250px" disabled />
        </el-form-item>
        <el-form-item
          label="规则名称"
          prop="component_type_name"
        >
          <el-input v-model="dialogForm.component_type_name" style="width:250px" />
        </el-form-item>
        <el-form-item label="区分" prop="submission_department">
          <el-select
            v-model="dialogForm.submission_department"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['炭黑','天然胶']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目" prop="submission_department">
          <el-select
            v-model="dialogForm.submission_department"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['炭黑','天然胶']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="容差许" prop="submission_department">
          <el-select
            v-model="dialogForm.submission_department"
            style="width:100px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['炭黑','天然胶']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-input style="width:100px" />
          <el-select
            v-model="dialogForm.submission_department"
            style="width:100px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['炭黑','天然胶']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="component_type_name"
        >
          <el-input v-model="dialogForm.component_type_name" style="width:250px" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogCreateVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleCreate"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑规则"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form ref="editForm" :rules="rules" :model="dialogForm" label-width="100px">
        <el-form-item
          label="规则编号"
          prop="component_type_code"
        >
          <el-input v-model="dialogForm.component_type_code" style="width:250px" disabled />
        </el-form-item>
        <el-form-item
          label="规则名称"
          prop="component_type_name"
        >
          <el-input v-model="dialogForm.component_type_name" style="width:250px" />
        </el-form-item>
        <el-form-item label="区分" prop="submission_department">
          <el-select
            v-model="dialogForm.submission_department"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['炭黑','天然胶']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目" prop="submission_department">
          <el-select
            v-model="dialogForm.submission_department"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['炭黑','天然胶']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="容差许" prop="submission_department">
          <el-select
            v-model="dialogForm.submission_department"
            style="width:100px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['炭黑','天然胶']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-input style="width:100px" />
          <el-select
            v-model="dialogForm.submission_department"
            style="width:100px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['炭黑','天然胶']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="component_type_name"
        >
          <el-input v-model="dialogForm.component_type_name" style="width:250px" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEdit"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { equipComponentType } from '@/api/jqy'
// import { errorRepeat } from '@/utils'

export default {
  name: 'BanburyingCurrency',
  components: { page },
  data: function() {
    return {
      tableData: [],
      dialogCreateVisible: false,
      dialogEditVisible: false,
      btnExportLoad: false,
      dialogForm: {
        no: '',
        name: ''
      },
      loading: false,
      rules: {
        component_type_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        component_type_name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      search: {
        page: 1
      },
      currentPage: 1,
      total: 1
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipComponentType('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changSelect() {
      this.search.page = 1
      this.getList()
    },
    showCreateDialog() {
      this.dialogForm = {
        component_type_code: '',
        component_type_name: ''
      }
      this.dialogCreateVisible = true
    },
    handleCreate() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          equipComponentType('post', null, { data: this.dialogForm }).then(response => {
            this.dialogCreateVisible = false
            this.$message.success('创建成功')
            this.getList()
          }).catch(e => {
            // errorRepeat(this, e)
          })
        }
      })
    },
    showEditDialog: function(row) {
      this.dialogForm = Object.assign({}, row)
      this.dialogEditVisible = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    handleEdit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          equipComponentType('put', this.dialogForm.id, { data: this.dialogForm })
            .then(response => {
              this.dialogEditVisible = false
              this.$message.success('修改成功')
              this.getList()
              // this.currentChange(this.currentPage)
            })
        }
      })
    },
    handleDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.component_type_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipComponentType('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    }
  }
}
</script>
<style lang="scss">
</style>
