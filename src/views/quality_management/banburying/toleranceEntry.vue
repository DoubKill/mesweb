<template>
  <div>
    <!-- 配方公差标准录入 -->
    <el-form :inline="true">
      <el-form-item style="float:right">
        <el-button type="primary" @click="showCreateDialog">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="rule_code"
        label="规则编号"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="showDialog(scope.row)"
          >{{ scope.row.rule_code }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="rule_name"
        label="规则名称"
      />
      <el-table-column
        prop="distinguish_name"
        label="区分"
      />
      <el-table-column
        prop="project_name"
        label="项目"
      />
      <el-table-column
        prop="handle_standard_error"
        label="容许差"
      />
      <el-table-column
        prop="desc"
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
    <el-dialog
      title="新建规则"
      width="40%"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="createForm" :rules="rules" :model="dialogForm" label-width="100px">
        <el-form-item
          label="规则编号"
          prop="rule_code"
        >
          <el-input v-model="dialogForm.rule_code" style="width:250px" disabled />
        </el-form-item>
        <el-form-item
          label="规则名称"
          prop="rule_name"
        >
          <el-input v-model="dialogForm.rule_name" style="width:250px" />
        </el-form-item>
        <el-form-item label="区分" prop="distinguish">
          <el-select
            v-model="dialogForm.distinguish"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.keyword_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目" prop="project">
          <el-select
            v-model="dialogForm.project"
            @change="changeProject"
          >
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.keyword_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogForm.project_name&&dialogForm.project_name!=='所有量程'" label="" prop="pick">
          <el-input-number v-model="dialogForm.small_num" :min="0" controls-position="right" style="width:120px" :precision="1" />
          kg
          <el-select
            v-model="dialogForm.small_handle"
            placeholder=""
            style="width:120px"
          >
            <el-option
              v-for="item in options3"
              :key="item.id"
              :label="item.keyword_name"
              :value="item.id"
            />
          </el-select>
          {{ dialogForm.project_name }}
          <el-select
            v-model="dialogForm.big_handle"
            placeholder=""
            style="width:80px"
          >
            <el-option
              v-for="item in options3"
              :key="item.id"
              :label="item.keyword_name"
              :value="item.id"
            />
          </el-select>
          <el-input-number v-model="dialogForm.big_num" :min="dialogForm.small_num" :precision="1" controls-position="right" style="width:120px" />
          kg
        </el-form-item>
        <el-form-item label="容差许" prop="tolerance">
          <el-select
            v-model="dialogForm.handle"
            style="width:100px"
            placeholder=""
          >
            <el-option
              v-for="item in options2"
              :key="item.id"
              :label="item.keyword_name"
              :value="item.id"
            />
          </el-select>
          <el-input-number v-model="dialogForm.standard_error" :precision="3" controls-position="right" style="width:140px" />
          <el-select
            v-model="dialogForm.unit"
            style="width:100px"
            placeholder=""
          >
            <el-option
              v-for="item in ['kg','%']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="desc"
        >
          <el-input v-model="dialogForm.desc" style="width:250px" />
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
      width="40%"
    >
      <el-form ref="editForm" :rules="rules" :model="dialogForm" label-width="100px">
        <el-form-item
          label="规则编号"
          prop="rule_code"
        >
          <el-input v-model="dialogForm.rule_code" style="width:250px" disabled />
        </el-form-item>
        <el-form-item
          label="规则名称"
          prop="rule_name"
        >
          <el-input v-model="dialogForm.rule_name" style="width:250px" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="区分" prop="distinguish">
          <el-select
            v-model="dialogForm.distinguish"
            :disabled="disabled"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.keyword_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目" prop="project">
          <el-select
            v-model="dialogForm.project"
            :disabled="disabled"
            placeholder="请选择"
            @change="changeProject"
          >
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.keyword_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogForm.project_name&&dialogForm.project_name!=='所有量程'" label="" prop="pick">
          <el-input-number v-model="dialogForm.small_num" :disabled="disabled" :min="0" :precision="1" controls-position="right" style="width:120px" />
          kg
          <el-select
            v-model="dialogForm.small_handle"
            :disabled="disabled"
            placeholder=""
            style="width:80px"
          >
            <el-option
              v-for="item in options3"
              :key="item.id"
              :label="item.keyword_name"
              :value="item.id"
            />
          </el-select>
          {{ dialogForm.project_name }}
          <el-select
            v-model="dialogForm.big_handle"
            :disabled="disabled"
            placeholder=""
            style="width:80px"
          >
            <el-option
              v-for="item in options3"
              :key="item.id"
              :label="item.keyword_name"
              :value="item.id"
            />
          </el-select>
          <el-input-number v-model="dialogForm.big_num" :disabled="disabled" :min="dialogForm.small_num" controls-position="right" style="width:120px" :precision="1" />
          kg
        </el-form-item>
        <el-form-item label="容差许" prop="tolerance">
          <el-select
            v-model="dialogForm.handle"
            :disabled="disabled"
            style="width:100px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options2"
              :key="item.id"
              :label="item.keyword_name"
              :value="item.id"
            />
          </el-select>
          <el-input-number v-model="dialogForm.standard_error" :disabled="disabled" :precision="3" controls-position="right" style="width:140px" />
          <el-select
            v-model="dialogForm.unit"
            :disabled="disabled"
            style="width:100px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ['kg','%']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="desc"
        >
          <el-input v-model="dialogForm.desc" :disabled="disabled" style="width:250px" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button
          v-if="!disabled"
          type="primary"
          @click="handleEdit"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { toleranceRule, getDefaultCode, toleranceKeyword } from '@/api/jqy'

export default {
  name: 'BanburyingCurrency',
  data: function() {
    var validatePass = (rule, value, callback) => {
      if (this.dialogForm.handle === undefined || this.dialogForm.handle === '') {
        callback(new Error('请输入容差许'))
      } else if (this.dialogForm.standard_error === undefined || this.dialogForm.standard_error === '') {
        callback(new Error('请输入容差许'))
      } else if (this.dialogForm.unit === undefined || this.dialogForm.unit === '') {
        callback(new Error('请输入容差许'))
      } else {
        callback()
      }
    }
    var validatePass1 = (rule, value, callback) => {
      if (this.dialogForm.small_handle === undefined || this.dialogForm.small_handle === '') {
        callback(new Error('请输入必填项'))
      } else if (this.dialogForm.small_num === undefined || this.dialogForm.small_num === '') {
        callback(new Error('请输入必填项'))
      } else if (this.dialogForm.big_handle === undefined || this.dialogForm.big_handle === '') {
        callback(new Error('请输入必填项'))
      } else if (this.dialogForm.big_num === undefined || this.dialogForm.big_num === '') {
        callback(new Error('请输入必填项'))
      } else if (Number(this.dialogForm.big_num * 10) < Number(this.dialogForm.small_num * 10)) {
        callback(new Error('右侧数字需大于左侧'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      dialogCreateVisible: false,
      dialogEditVisible: false,
      btnExportLoad: false,
      dialogForm: {
        no: '',
        name: ''
      },
      disabled: false,
      options: [],
      options1: [],
      options2: [],
      options3: [],
      loading: false,
      rules: {
        rule_code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        rule_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        distinguish: [{ required: true, message: '不能为空', trigger: 'change' }],
        project: [{ required: true, message: '不能为空', trigger: 'change' }],
        tolerance: [{ required: true, validator: validatePass, trigger: 'change' }],
        pick: [{ required: true, validator: validatePass1, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getpick()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await toleranceRule('get', null, { params: {}})
        this.tableData = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changSelect() {
      this.search.page = 1
      this.getList()
    },
    changeProject() {
      this.dialogForm.project_name = this.options1.filter(d => d.id === this.dialogForm.project)[0].keyword_name
    },
    async showCreateDialog() {
      this.disabled = false
      if (this.$refs.createForm) {
        this.$refs.createForm.resetFields()
      }
      this.dialogForm = {}
      const data = await getDefaultCode('get', null, { params: { work_type: '公差规则' }})
      this.dialogForm.rule_code = data
      this.dialogCreateVisible = true
    },
    async getpick() {
      const data = await toleranceKeyword('get', null, { params: { work_type: '区分', all: 1 }})
      const data1 = await toleranceKeyword('get', null, { params: { work_type: '项目', all: 1 }})
      const data2 = await toleranceKeyword('get', null, { params: { work_type: '处理', all: 1 }})
      const data3 = await toleranceKeyword('get', null, { params: { work_type: '处理', all: 1, single: 1 }})
      this.options = data.results
      this.options1 = data1.results
      this.options2 = data2.results
      this.options3 = data3.results
    },
    handleCreate() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          toleranceRule('post', null, { data: this.dialogForm }).then(response => {
            this.dialogCreateVisible = false
            this.$message.success('创建成功')
            if (this.$refs.createForm) {
              this.$refs.createForm.resetFields()
            }
            this.getList()
          }).catch(e => {
            // errorRepeat(this, e)
          })
        }
      })
    },
    showDialog: function(row) {
      this.disabled = true
      this.dialogForm = Object.assign({}, row)
      this.dialogForm.small_num = Number(this.dialogForm.small_num)
      this.dialogForm.big_num = Number(this.dialogForm.big_num)
      this.dialogEditVisible = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    showEditDialog: function(row) {
      this.disabled = false
      this.dialogForm = Object.assign({}, row)
      this.dialogForm.small_num = Number(this.dialogForm.small_num)
      this.dialogForm.big_num = Number(this.dialogForm.big_num)
      this.dialogEditVisible = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    handleEdit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          toleranceRule('put', this.dialogForm.id, { data: this.dialogForm })
            .then(response => {
              this.dialogEditVisible = false
              this.$message.success('修改成功')
              if (this.$refs.editForm) {
                this.$refs.editForm.resetFields()
              }
              this.getList()
              // this.currentChange(this.currentPage)
            })
        }
      })
    },
    handleDelete: function(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.rule_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        toleranceRule('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    }
  }
}
</script>
<style lang="scss">
</style>
