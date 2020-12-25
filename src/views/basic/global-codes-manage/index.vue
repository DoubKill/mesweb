<template>
  <div style="margin-top: 25px">
    <el-row>
      <el-col :span="12">
        <el-form :inline="true">
          <el-form-item label="类型名称">
            <el-input
              v-model="type_name"
              @input="typeNameChanged"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="permissionObj.globalcodetype.indexOf('add')>-1"
              @click="showCreateGlobalCodeTypeDialog"
            >新建</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          border
          highlight-current-row
          style="width: 100%"
          @current-change="handleGlobalCodeTypesCurrentRowChange"
        >
          <el-table-column
            align="center"
            type="index"
            label="No"
            width="50"
          />
          <el-table-column
            prop="type_no"
            label="类型代码"
          />
          <el-table-column
            prop="type_name"
            label="类型名称"
          />
          <el-table-column
            prop="use_flag"
            label="使用"
            width="50"
            :formatter="globalCodeTypeFormatter"
          />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  v-if="permissionObj.globalcodetype.indexOf('change')>-1"
                  size="mini"
                  @click="showEditGlobalCodeTypeDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  v-if="permissionObj.globalcodetype.indexOf('delete')>-1"
                  size="mini"
                  type="blue"
                  @click="handleGlobalCodeTypeDelete(scope.row)"
                >{{ scope.row.use_flag ? '停用' : '启用' }}</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <page
          :total="total"
          :current-page="getParams.page"
          @currentChange="currentChange"
        />
      </el-col>
      <el-col :span="12">
        <el-form :inline="true">
          <el-form-item style="float: right">
            <el-button
              v-if="permissionObj.globalcodetype.indexOf('add')>-1"
              :disabled="!globalCodeTypesCurrentRow"
              @click="showCreateGlobalCodeDialog"
            >新建</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="globalCodes"
          border
          style="width: 100%"
        >
          <el-table-column
            label="No"
            align="center"
            type="index"
            width="50"
          />
          <el-table-column
            prop="global_no"
            label="公用代码"
          />
          <el-table-column
            prop="global_name"
            label="公用代码名称"
          />
          <el-table-column
            prop="description"
            label="备注"
          />
          <el-table-column
            prop="use_flag"
            width="50"
            label="使用"
            :formatter="globalCodeUsedFlagFormatter"
          />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  v-if="permissionObj.globalcodetype.indexOf('change')>-1"
                  size="mini"
                  @click="showEditGlobalCodeDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  v-if="permissionObj.globalcodetype.indexOf('delete')>-1"
                  size="mini"
                  type="blue"
                  @click="handleGlobalCodesDelete(scope.row)"
                >{{ scope.row.use_flag ? '停用' : '启用' }}</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      title="添加公用代码类型"
      :visible.sync="dialogCreateGlobalCodeTypeVisible"
    >
      <el-form :model="globalCodeTypeForm">
        <el-form-item
          :error="globalCodeTypeFormError.type_no"
          label="类型编号"
        >
          <el-input v-model="globalCodeTypeForm.type_no" />
        </el-form-item>
        <el-form-item
          :error="globalCodeTypeFormError.type_name"
          label="类型名称"
        >
          <el-input v-model="globalCodeTypeForm.type_name" />
        </el-form-item>
        <el-form-item
          :error="globalCodeTypeFormError.description"
          label="说明"
        >
          <el-input v-model="globalCodeTypeForm.description" />
        </el-form-item>
        <!-- <el-form-item
          :error="globalCodeTypeFormError.use_flag"
          label="是否启用"

        >
          <el-switch v-model="globalCodeTypeForm.use_flag" />
        </el-form-item> -->
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogCreateGlobalCodeTypeVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleCreateGlobalCodeType()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑公用代码类型"
      :visible.sync="dialogEditGlobalCodeTypeVisible"
    >
      <el-form :model="globalCodeTypeForm">
        <el-form-item
          :error="globalCodeTypeFormError.type_no"
          label="类型编号"
        >
          <el-input
            v-model="globalCodeTypeForm.type_no"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          :error="globalCodeTypeFormError.type_name"
          label="类型名称"
        >
          <el-input v-model="globalCodeTypeForm.type_name" />
        </el-form-item>
        <el-form-item
          :error="globalCodeTypeFormError.description"
          label="说明"
        >
          <el-input v-model="globalCodeTypeForm.description" />
        </el-form-item>
        <!-- <el-form-item
          :error="globalCodeTypeFormError.use_flag"
          label="是否启用"

        >
          <el-switch v-model="globalCodeTypeForm.use_flag" />
        </el-form-item> -->
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditGlobalCodeTypeVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEditGlobalCodeType"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="添加公用代码"
      :visible.sync="dialogCreateGlobalCodeVisible"
    >
      <el-form :model="globalCodeForm">
        <el-form-item
          :error="globalCodeFormError.global_no"
          label="公用代码编号"
        >
          <el-input v-model="globalCodeForm.global_no" />
        </el-form-item>
        <el-form-item
          :error="globalCodeFormError.global_name"
          label="公用代码名称"
        >
          <el-input v-model="globalCodeForm.global_name" />
        </el-form-item>
        <el-form-item
          :error="globalCodeFormError.description"
          label="说明"
        >
          <el-input v-model="globalCodeForm.description" />
        </el-form-item>
        <!-- <el-form-item
          :error="globalCodeFormError.use_flag"
          label="是否启用"

        >
          <el-switch v-model="globalCodeForm.use_flag_b" />
        </el-form-item> -->
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogCreateGlobalCodeVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleCreateGlobalCode"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑公用代码"
      :visible.sync="dialogEditGlobalCodeVisible"
    >
      <el-form :model="globalCodeForm">
        <el-form-item
          :error="globalCodeFormError.global_no"
          label="公用代码编号"
        >
          <el-input
            v-model="globalCodeForm.global_no"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          :error="globalCodeFormError.global_name"
          label="公用代码名称"
        >
          <el-input v-model="globalCodeForm.global_name" />
        </el-form-item>
        <el-form-item
          :error="globalCodeFormError.description"
          label="说明"
        >
          <el-input v-model="globalCodeForm.description" />
        </el-form-item>
        <!-- <el-form-item
          :error="globalCodeFormError.use_flag"
          label="是否启用"

        >
          <el-switch v-model="globalCodeForm.use_flag" />
        </el-form-item> -->
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditGlobalCodeVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEditGlobalCode"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGlobalTypes, postGlobalTypes, putGlobalTypes, deleteGlobalTypes, getGlobalCodes, postGlobalCodes, putGlobalCodes, deleteGlobalCodes } from '@/api/global-codes-manage'
import page from '@/components/page'
import { mapGetters } from 'vuex'
export default {
  components: { page },
  data: function() {
    return {
      formLabelWidth: 'auto',
      tableData: [],
      type_name: '',
      globalCodeTypesCurrentRow: null,
      dialogCreateGlobalCodeTypeVisible: false,
      dialogEditGlobalCodeTypeVisible: false,
      globalCodeTypeForm: {

        type_no: '',
        type_name: '',
        description: '',
        use_flag: true
      },
      globalCodeTypeFormError: {},

      globalCodes: [],
      dialogCreateGlobalCodeVisible: false,
      dialogEditGlobalCodeVisible: false,
      globalCodeForm: {

        global_no: '',
        global_name: '',
        description: '',
        use_flag: true, // 0用
        global_type: null
      },
      globalCodeFormError: {},
      getParams: {
        page: 1
      },
      currentPage: 1,
      total: 1
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
    this.getGlobalTypesList()
  },
  methods: {
    afterGetData: function() {
      this.globalCodeTypesCurrentRow = null
    },
    typeNameChanged: function() { // 类型名搜索
      this.getParams.page = 1
      this.getParams['type_name'] = this.type_name
      this.getGlobalTypesList()
    },
    getGlobalTypesList() {
      getGlobalTypes(this.getParams).then(response => {
        this.tableData = response.results
        this.total = response.count
      })
    },
    clearGlobalCodeTypeForm: function() {
      this.globalCodeTypeForm = {
        type_no: '',
        type_name: '',
        description: '',
        use_flag: true
      }
    },
    clearGlobalCodeTypeFormError: function() {
      this.globalCodeTypeFormError = {
        type_no: '',
        type_name: '',
        description: '',
        use_flag: true
      }
    },
    showCreateGlobalCodeTypeDialog: function() {
      this.clearGlobalCodeTypeForm()
      this.clearGlobalCodeTypeFormError()
      this.dialogCreateGlobalCodeTypeVisible = true
    },
    handleCreateGlobalCodeType: function() { // 创建全局代码类型
      this.clearGlobalCodeTypeFormError()
      const app = this
      postGlobalTypes(this.globalCodeTypeForm)
        .then(function(response) {
          app.dialogCreateGlobalCodeTypeVisible = false
          app.$message(app.globalCodeTypeForm.type_name + '创建成功')
          app.currentChange(app.currentPage)
        }).catch(function(error) {
          for (var key in app.globalCodeTypeFormError) {
            if (error[key]) { app.globalCodeTypeFormError[key] = error[key].join(',') }
          }
        })
    },
    showEditGlobalCodeTypeDialog: function(row) {
      this.clearGlobalCodeTypeForm()
      this.clearGlobalCodeTypeFormError()
      this.globalCodeTypeForm = Object.assign({}, row)
      this.dialogEditGlobalCodeTypeVisible = true
    },
    handleEditGlobalCodeType: function() {
      const app = this
      putGlobalTypes(this.globalCodeTypeForm, this.globalCodeTypeForm.id)
        .then(function(response) {
          app.dialogEditGlobalCodeTypeVisible = false
          app.$message(app.globalCodeTypeForm.type_name + '修改成功')
          app.currentChange(app.currentPage)
        }).catch(function(error) {
          for (var key in app.globalCodeTypeFormError) {
            if (error[key]) { app.globalCodeTypeFormError[key] = error[key].join(',') }
          }
        })
    },
    handleGlobalCodeTypeDelete: function(row) {
      var app = this
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.type_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        deleteGlobalTypes(row.id)
          .then(function(response) {
            app.$message({
              type: 'success',
              message: '操作成功!'
            })
            if (app.tableData.length === 1 && app.currentPage > 1) {
              --app.currentPage
            }
            app.currentChange(app.currentPage)
          }).catch(function(error) {
            app.$message.error(error)
          })
      }).catch(function() {

      })
    },

    handleGlobalCodeTypesCurrentRowChange: function(row) {
      if (!row) { return }
      var app = this
      this.globalCodeTypesCurrentRow = row
      getGlobalCodes({ id: row.id })
        .then(function(response) {
          app.globalCodes = response.results
          // app.globalCodes.use_flag_b = app.globalCodes.use_flag ? 0 : 1
          app.globalCodeForm.global_type = row.id
        })
    },
    clearGlobalCodeForm: function() {
      this.globalCodeForm = {

        global_no: '',
        global_name: '',
        description: '',
        use_flag: true,
        global_type: this.globalCodeForm.global_type
      }
    },
    clearGlobalCodeFormError: function() {
      this.globalCodeFormError = {

        global_no: '',
        global_name: '',
        description: '',
        use_flag: ''
      }
    },
    showCreateGlobalCodeDialog: function() {
      if (!this.globalCodeForm.global_type) { return }
      this.clearGlobalCodeForm()
      this.clearGlobalCodeFormError()
      this.dialogCreateGlobalCodeVisible = true
    },
    handleCreateGlobalCode: function() {
      this.clearGlobalCodeFormError()
      // this.globalCodeForm.use_flag = this.globalCodeForm.use_flag_b ? 0 : 1
      var app = this
      postGlobalCodes(this.globalCodeForm)
        .then(function(response) {
          app.dialogCreateGlobalCodeVisible = false
          app.$message(app.globalCodeForm.global_name + '创建成功')
          app.handleGlobalCodeTypesCurrentRowChange(app.globalCodeTypesCurrentRow)
        }).catch(function(error) {
          for (var key in app.globalCodeFormError) {
            if (error[key]) { app.globalCodeFormError[key] = error[key].join(',') }
          }
        })
    },
    showEditGlobalCodeDialog: function(row) {
      this.clearGlobalCodeForm()
      this.clearGlobalCodeFormError()
      this.globalCodeForm.id = row.id
      this.globalCodeForm.global_no = row.global_no
      this.globalCodeForm.global_name = row.global_name
      this.globalCodeForm.description = row.description
      this.globalCodeForm.use_flag = row.use_flag
      this.dialogEditGlobalCodeVisible = true
    },
    handleEditGlobalCode: function() {
      // this.globalCodeForm.use_flag = this.globalCodeForm.use_flag_b ? 0 : 1
      const app = this
      putGlobalCodes(this.globalCodeForm, this.globalCodeForm.id)
        .then(function(response) {
          app.dialogEditGlobalCodeVisible = false
          app.$message(app.globalCodeForm.global_name + '修改成功')
          app.handleGlobalCodeTypesCurrentRowChange(app.globalCodeTypesCurrentRow)
        }).catch(function(error) {
          for (var key in app.globalCodeFormError) {
            // eslint-disable-next-line no-redeclare
            for (var key in app.globalCodeFormError) {
              if (error[key]) { app.globalCodeFormError[key] = error[key].join(',') }
            }
          }
        })
    },
    handleGlobalCodesDelete: function(row) {
      var app = this
      var str = row.use_flag ? '停用' : '启用'
      this.$confirm('此操作将' + str + row.global_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        deleteGlobalCodes(row.id)
          .then(function(response) {
            app.$message({
              type: 'success',
              message: '操作成功!'
            })
            app.handleGlobalCodeTypesCurrentRowChange(app.globalCodeTypesCurrentRow)
          }).catch(function(error) {
            app.$message.error(error)
          })
      }).catch(function() {

      })
    },
    globalCodeTypeFormatter: function(row, column) {
      return this.boolFormatter(row.use_flag)
    },
    globalCodeUsedFlagFormatter: function(row, column) {
      return this.boolFormatter(row.use_flag)
    },
    boolFormatter: function(flag) {
      return flag ? 'Y' : 'N'
    },
    currentChange(page) {
      this.globalCodes = []
      this.currentPage = page
      this.getParams.page = page
      this.getGlobalTypesList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
