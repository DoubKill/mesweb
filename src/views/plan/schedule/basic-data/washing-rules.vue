<template>
  <div v-loading="loading">
    <!-- 洗车规则及放置规则 -->
    <h3 style="margin:3px 0 0 0;">洗车规则及放置规则</h3>
    <div style="width:100%;text-align:right;margin-bottom:15px;">
      <el-button
        type="primary"
        @click="showCreateDialog"
      >新建</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      max-height="300px"
    >
      <el-table-column
        prop="rule_no"
        label="规则编号"
        min-width="20"
      />
      <el-table-column
        prop="rule_name"
        label="规则名称"
        min-width="20"
      />
      <el-table-column
        prop="previous_spec"
        label="前规格"
        min-width="20"
      />
      <el-table-column
        prop="following_spec"
        label="后规格"
        min-width="20"
      />
      <el-table-column
        prop="note"
        label="备注"
        min-width="20"
      />
      <el-table-column
        label="操作"
        width="130px"
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
              plain
              @click="handleDelete(scope.row)"
            >{{ scope.row.use_flag?'停用':'启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <h3>胶料/单位关键字定义</h3>
    <div>
      <el-table
        :data="tableDataKeyword"
        border
        max-height="300px"
      >
        <el-table-column
          prop="keyword_no"
          label="关键字编号"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.isEdit" v-model="row.keyword_no" />
            <span v-else>{{ row.keyword_no }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="keyword_name"
          label="关键字名称"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.isEdit" v-model="row.keyword_name" />
            <span v-else>{{ row.keyword_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="product_nos"
          label="指定规格"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.isEdit" v-model="row.product_nos" />
            <span v-else>{{ row.product_nos }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="note"
          label="备注"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.isEdit" v-model="row.note" />
            <span v-else>{{ row.note }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="160"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="(scope.row.isEdit&&scope.row.id)?true:false"
              type="danger"
              @click="handleKeywordDelete(scope.row)"
            >
              删除
            </el-button>
            <el-button
              v-if="!scope.row.isEdit&&scope.row.id"
              size="mini"
              type="primary"
              @click="handleKeywordEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.isEdit"
              size="mini"
              type="primary"
              @click="handleKeywordSubmit(scope.row)"
            >
              保存
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="width:100%;text-align:center;margin-top:15px">
        <el-button
          size="small"
          @click="addCell"
        >插入一行</el-button>
      </div>
    </div>
    <h3>处理关键字定义</h3>
    <div>
      <el-table
        :data="tableDataDispose"
        border
        max-height="300px"
      >
        <el-table-column
          prop="keyword_no"
          label="关键字编号"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.isEdit" v-model="row.keyword_no" />
            <span v-else>{{ row.keyword_no }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="keyword_name"
          label="关键字名称"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.isEdit" v-model="row.keyword_name" />
            <span v-else>{{ row.keyword_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="note"
          label="备注"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.isEdit" v-model="row.note" />
            <span v-else>{{ row.note }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="160"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="(scope.row.isEdit&&scope.row.id)?true:false"
              type="danger"
              @click="handleDisposeDelete(scope.row)"
            >
              删除
            </el-button>
            <el-button
              v-if="!scope.row.isEdit&&scope.row.id"
              size="mini"
              type="primary"
              @click="handleDisposeEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.isEdit"
              size="mini"
              type="primary"
              @click="handleDisposeSubmit(scope.row)"
            >
              保存
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="width:100%;text-align:center;margin-top:15px">
        <el-button
          size="small"
          @click="addCellDispose"
        >插入一行</el-button>
      </div>
    </div>

    <el-dialog
      :title="`${formData.id?'编辑':'新建'}规则`"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item
          label="规则编号"
          prop="rule_no"
        >
          <el-input v-model="formData.rule_no" />
        </el-form-item>
        <el-form-item
          label="规则名称"
          prop="rule_name"
        >
          <el-input v-model="formData.rule_name" />
        </el-form-item>
        <el-form-item
          label="前规格"
          prop="previous_spec"
        >
          <el-select
            v-model="formData.previous_spec"
            placeholder="请选择"
          >
            <el-option
              v-for="item in tableDataKeyword"
              :key="item.id"
              :label="item.keyword_name"
              :value="item.keyword_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="后规格"
          prop="following_spec"
        >
          <el-select
            v-model="formData.following_spec"
            placeholder="请选择"
          >
            <el-option
              v-for="item in tableDataKeyword"
              :key="item.id"
              :label="item.keyword_name"
              :value="item.keyword_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formData.note"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <el-table
        :data="formData.rule_details"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column
          label="处理"
          min-width="40"
        >
          <template slot-scope="{row}">
            <el-select
              v-model="row.process"
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="item in tableDataDispose"
                :key="item.id"
                :label="item.keyword_name"
                :value="item.keyword_name"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="处理参数（规格/单位）"
          min-width="40"
        >
          <template slot-scope="{row}">
            <el-select
              v-model="row.spec_params"
              style="width:100%"
              placeholder="请选择"
            >
              <el-option
                v-for="item in tableDataKeyword"
                :key="item.id"
                :label="item.keyword_name"
                :value="item.keyword_name"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="处理参数（车数/数量）"
          width="190px"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-model="row.quantity_params"
              style="width:180px"
              controls-position="right"
              :min="1"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="created_username"
          label="录入者"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
          label="录入时间"
          min-width="20"
        />
        <el-table-column
          label="操作"
          width="90"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDialogDelete(scope.row,scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="width:100%;text-align:center;margin-top:15px">
        <el-button
          size="small"
          @click="addCellRule"
        >插入一行</el-button>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="submitChange"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { schedulingWashRules, schedulingPlaceKeyword, operaKeyword } from '@/api/base_w_five'
export default {
  name: 'ScheduleWashingRules',
  data() {
    return {
      loading: false,
      tableData: [],
      tableData1: [],
      tableDataKeyword: [],
      tableDataDispose: [],
      dialogVisible: false,
      formData: {},
      rules: {
        rule_no: [
          { required: true, message: '请输入规则编号', trigger: 'blur' }
        ],
        rule_name: [
          { required: true, message: '请输入规则名称', trigger: 'blur' }
        ],
        previous_spec: [
          { required: true, message: '请选择前规格', trigger: 'change' }
        ],
        following_spec: [
          { required: true, message: '请选择后规格', trigger: 'change' }
        ]
      },
      optionsFront: [],
      optionsAfter: [],
      disposeList: [],
      paramList: [],
      btnLoading: false
    }
  },
  created() {
    this.loading = true
    this.getList()
    this.getKeywordList()
    this.getDisposeList()
  },
  methods: {
    async getList() {
      try {
        const data = await schedulingWashRules('get', null, { params: {}})
        this.tableData = data || []
      } catch (e) {
        //
      }
      this.loading = false
    },
    async getKeywordList() {
      try {
        const data = await schedulingPlaceKeyword('get', null, { params: {}})
        this.tableDataKeyword = data || []
      } catch (e) {
        //
      }
      this.loading = false
    },
    async getDisposeList() {
      try {
        const data = await operaKeyword('get', null, { params: {}})
        this.tableDataDispose = data || []
      } catch (e) {
        //
      }
      this.loading = false
    },
    showCreateDialog() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false
      this.formData = {}
      this.formData.rule_details = []
      setTimeout(d => {
        this.$refs.ruleForm.clearValidate()
      }, 300)
      if (done) {
        done()
      }
    },
    showEditDialog(row) {
      this.formData = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleDelete(row) {
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.rule_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        schedulingWashRules('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    handleDialogDelete(row, index) {
      this.formData.rule_details.splice(index, 1)
    },
    submitChange() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            this.formData.rule_details.forEach(d => {
              if (!d.process || !d.spec_params) {
                throw new Error('处理、处理参数（规格/单位）必填')
              }
            })
            const _api = this.formData.id ? 'put' : 'post'
            this.btnLoading = true
            await schedulingWashRules(_api, this.formData.id || null,
              { data: this.formData })
            this.$message.success('操作成功')
            this.handleClose(false)
            this.getList()
          } catch (e) {
            if (e.message) {
              this.$message(e.message)
            }
          }
          this.btnLoading = false
        }
      })
    },
    handleKeywordDelete(row) {
      if (!row.id) {
        this.tableDataKeyword.splice(this.tableDataKeyword.length - 1, 1)
        return
      }
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        schedulingPlaceKeyword('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getKeywordList()
          }).catch(e => {
          })
      })
    },
    handleKeywordEdit(row) {
      this.$set(row, 'isEdit', true)
    },
    handleKeywordSubmit(row) {
      if (!row.keyword_name || !row.keyword_no || !row.product_nos) {
        this.$message.info('关键字编号、关键字名称、指定规格必填')
        return
      }
      const _api = row.id ? 'put' : 'post'
      schedulingPlaceKeyword(_api, row.id, { data: row })
        .then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.$set(row, 'isEdit', false)
          this.getKeywordList()
        }).catch(e => {
        })
    },
    addCellRule() {
      if (!this.formData.rule_details) {
        this.$set(this.formData, 'rule_details', [])
      }
      this.formData.rule_details.push({})
    },
    addCell() {
      this.tableDataKeyword.push({ isEdit: true })
    },
    handleDisposeDelete(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        operaKeyword('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDisposeList()
          }).catch(e => {
          })
      })
    },
    handleDisposeEdit(row) {
      this.$set(row, 'isEdit', true)
    },
    handleDisposeSubmit(row) {
      if (!row.keyword_name || !row.keyword_no) {
        this.$message.info('关键字编号、关键字名称必填')
        return
      }
      const _api = row.id ? 'put' : 'post'
      operaKeyword(_api, row.id, { data: row })
        .then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.$set(row, 'isEdit', false)
          this.getDisposeList()
        }).catch(e => {
        })
    },
    addCellDispose() {
      this.tableDataDispose.push({ isEdit: true })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-input,   .el-textarea ,.el-select{
    width:250px;
  }
</style>
