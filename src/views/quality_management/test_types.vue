<template>
  <div style="margin-top: 25px">
    <el-row>
      <el-col :span="12">
        <el-form :inline="true">
          <el-form-item style="float: right">
            <el-button
              @click="showCreateTestTypeDialog"
            >新建</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          border
          highlight-current-row
          style="width: 100%"
          @current-change="handleTestTypesCurrentRowChange"
        >
          <el-table-column
            align="center"
            type="index"
            label="No"
            width="50"
          />
          <el-table-column
            prop="type_no"
            label="试验类型"
          />
          <el-table-column
            prop="type_name"
            label="试验指标"
          />
          <!-- <el-table-column
            prop="use_flag"
            label="使用"
            width="50"
            :formatter="testTypeFormatter"
          /> -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  size="mini"
                  @click="showEditTestTypeDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleTestTypeDelete(scope.row)"
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
              :disabled="!testTypesCurrentRow"
              @click="showCreateTestDialog"
            >新建</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="dataPoints"
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
            label="数据点"
          />
          <el-table-column
            prop="global_name"
            label="单位"
          />
          <!-- <el-table-column
            prop="use_flag"
            width="50"
            label="使用"
            :formatter="testUsedFlagFormatter"
          /> -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  size="mini"
                  @click="showEditDataPointsDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleTestsDelete(scope.row)"
                >{{ scope.row.use_flag ? '停用' : '启用' }}</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      title="添加试验类型"
      :visible.sync="dialogCreateTestTypeVisible"
    >
      <el-form :model="testTypeForm">
        <el-form-item
          :error="testTypeFormError.type_no"
          label="试验类型"
          :label-width="formLabelWidth"
        >
          <el-input v-model="testTypeForm.type_no" />
        </el-form-item>
        <el-form-item
          :error="testTypeFormError.type_name"
          label="试验指标"
          :label-width="formLabelWidth"
        >
          <el-input v-model="testTypeForm.type_name" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogCreateTestTypeVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleCreateTestType()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑试验类型"
      :visible.sync="dialogEditTestTypeVisible"
    >
      <el-form :model="testTypeForm">
        <el-form-item
          :error="testTypeFormError.type_no"
          label="试验类型"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="testTypeForm.type_no"
          />
        </el-form-item>
        <el-form-item
          :error="testTypeFormError.type_name"
          label="试验指标"
          :label-width="formLabelWidth"
        >
          <el-input v-model="testTypeForm.type_name" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditTestTypeVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEditTestType"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="添加试验"
      :visible.sync="dialogCreateDataPointsVisible"
    >
      <el-form :model="dataPointsForm">
        <el-form-item
          :error="dataPointsFormError.global_no"
          label="数据点"
          :label-width="formLabelWidth"
        >
          <el-input v-model="dataPointsForm.global_no" />
        </el-form-item>
        <el-form-item
          :error="dataPointsFormError.global_name"
          label="单位"
          :label-width="formLabelWidth"
        >
          <el-input v-model="dataPointsForm.global_name" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogCreateDataPointsVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleCreateTest"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑试验"
      :visible.sync="dialogEditDataPointsVisible"
    >
      <el-form :model="dataPointsForm">
        <el-form-item
          :error="dataPointsFormError.global_no"
          label="数据点"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="dataPointsForm.global_no"
          />
        </el-form-item>
        <el-form-item
          :error="dataPointsFormError.global_name"
          label="单位"
          :label-width="formLabelWidth"
        >
          <el-input v-model="dataPointsForm.global_name" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditDataPointsVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEditTest"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTestTypes, putTestTypes, postTestTypes, deleteTestTypes, getDataPoints, putDataPoints, postDataPoints, deleteDataPoints } from '@/api/test_types'
import page from '@/components/page'
import { mapGetters } from 'vuex'
export default {
  components: { page },
  data: function() {
    return {
      formLabelWidth: 'auto',
      tableData: [],
      type_name: '',
      testTypesCurrentRow: null,
      dialogCreateTestTypeVisible: false,
      dialogEditTestTypeVisible: false,
      testTypeForm: {

        type_no: '',
        type_name: '',
        use_flag: true
      },
      testTypeFormError: {},

      dataPoints: [],
      dialogCreateDataPointsVisible: false,
      dialogEditDataPointsVisible: false,
      dataPointsForm: {

        global_no: '',
        global_name: '',
        use_flag: true, // 0用
        global_type: null
      },
      dataPointsFormError: {},
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
    console.log(this.permissionObj)
    this.getTestTypesList()
  },
  methods: {
    afterGetData: function() {
      this.testTypesCurrentRow = null
    },
    getTestTypesList() {
      getTestTypes(this.getParams).then(response => {
        this.tableData = response.results
        this.total = response.count
      })
    },
    clearTestTypeForm: function() {
      this.testTypeForm = {
        type_no: '',
        type_name: '',
        description: '',
        use_flag: true
      }
    },
    clearTestTypeFormError: function() {
      this.testTypeFormError = {
        type_no: '',
        type_name: '',
        description: '',
        use_flag: true
      }
    },
    showCreateTestTypeDialog: function() {
      this.clearTestTypeForm()
      this.clearTestTypeFormError()
      this.dialogCreateTestTypeVisible = true
    },
    handleCreateTestType: function() { // 创建全局代码类型
      this.clearTestTypeFormError()
      postTestTypes(this.testTypeForm)
        .then(response => {
          this.dialogCreateTestTypeVisible = false
          this.$message(this.testTypeForm.type_name + '创建成功')
          this.currentChange(this.currentPage)
        }).catch(function(error) {
          for (var key in this.testTypeFormError) {
            if (error[key]) { this.testTypeFormError[key] = error[key].join(',') }
          }
        })
    },
    showEditTestTypeDialog: function(row) {
      this.clearTestTypeForm()
      this.clearTestTypeFormError()
      this.testTypeForm = Object.assign({}, row)
      this.dialogEditTestTypeVisible = true
    },
    handleEditTestType: function() {
      putTestTypes(this.testTypeForm, this.testTypeForm.id)
        .then(response => {
          this.dialogEditTestTypeVisible = false
          this.$message(this.testTypeForm.type_name + '修改成功')
          this.currentChange(this.currentPage)
        }).catch(function(error) {
          for (var key in this.testTypeFormError) {
            console.log(error)
            if (error[key]) { this.testTypeFormError[key] = error[key].join(',') }
          }
        })
    },
    // handleTestTypeDelete: function(row) {
    //   var app = this
    //   var str = row.use_flag ? '停用' : '启用'
    //   this.$confirm('此操作将' + str + row.type_name + ', 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(function() {
    //     deleteTestTypes(row.id)
    //       .then(function(response) {
    //         app.$message({
    //           type: 'success',
    //           message: '操作成功!'
    //         })
    //         if (app.tableData.length === 1 && app.currentPage > 1) {
    //           --app.currentPage
    //         }
    //         app.currentChange(app.currentPage)
    //       }).catch(function(error) {
    //         app.$message.error(error)
    //       })
    //   }).catch(function() {

    //   })
    // },

    handleTestTypesCurrentRowChange: function(row) {
      if (!row) { return }
      this.testTypesCurrentRow = row
      getDataPoints({ id: row.id })
        .then(function(response) {
          this.dataPoints = response.results
          // app.tests.use_flag_b = app.tests.use_flag ? 0 : 1
          this.dataPointsForm.global_type = row.id
        })
    },
    clearDataPointsForm: function() {
      this.dataPointsForm = {

        global_no: '',
        global_name: '',
        description: '',
        use_flag: true,
        global_type: this.dataPointsForm.global_type
      }
    },
    clearDataPointsFormError: function() {
      this.dataPointsFormError = {

        global_no: '',
        global_name: '',
        description: '',
        use_flag: ''
      }
    },
    showCreateTestDialog: function() {
      if (!this.dataPointsForm.global_type) { return }
      this.clearDataPointsForm()
      this.clearDataPointsFormError()
      this.dialogCreateDataPointsVisible = true
    },
    handleCreateTest: function() {
      this.clearDataPointsFormError()
      // this.dataPointsForm.use_flag = this.dataPointsForm.use_flag_b ? 0 : 1
      postDataPoints(this.dataPointsForm)
        .then(response => {
          this.dialogCreateDataPointsVisible = false
          this.$message(this.dataPointsForm.global_name + '创建成功')
          this.handleTestTypesCurrentRowChange(this.testTypesCurrentRow)
        }).catch(function(error) {
          for (var key in this.dataPointsFormError) {
            if (error[key]) { this.dataPointsFormError[key] = error[key].join(',') }
          }
        })
    },
    showEditDataPointsDialog: function(row) {
      this.clearDataPointsForm()
      this.clearDataPointsFormError()
      this.dataPointsForm.id = row.id
      this.dataPointsForm.global_no = row.global_no
      this.dataPointsForm.global_name = row.global_name
      this.dataPointsForm.description = row.description
      this.dataPointsForm.use_flag = row.use_flag
      this.dialogEditDataPointsVisible = true
    },
    handleEditTest: function() {
      // this.dataPointsForm.use_flag = this.dataPointsForm.use_flag_b ? 0 : 1
      putDataPoints(this.dataPointsForm, this.dataPointsForm.id)
        .then(response => {
          this.dialogEditDataPointsVisible = false
          this.$message(this.dataPointsForm.global_name + '修改成功')
          this.handleTestTypesCurrentRowChange(this.testTypesCurrentRow)
        }).catch(function(error) {
          for (var key in this.dataPointsFormError) {
            // eslint-disable-next-line no-redeclare
            for (var key in this.dataPointsFormError) {
              if (error[key]) { this.dataPointsFormError[key] = error[key].join(',') }
            }
          }
        })
    },
    // handleTestsDelete: function(row) {
    //   var app = this
    //   var str = row.use_flag ? '停用' : '启用'
    //   this.$confirm('此操作将' + str + row.global_name + ', 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(function() {
    //     deleteTests(row.id)
    //       .then(function(response) {
    //         app.$message({
    //           type: 'success',
    //           message: '操作成功!'
    //         })
    //         app.handleTestTypesCurrentRowChange(app.testTypesCurrentRow)
    //       }).catch(function(error) {
    //         app.$message.error(error)
    //       })
    //   })
    // },
    testTypeFormatter: function(row, column) {
      return this.boolFormatter(row.use_flag)
    },
    testUsedFlagFormatter: function(row, column) {
      return this.boolFormatter(row.use_flag)
    },
    boolFormatter: function(flag) {
      return flag ? 'Y' : 'N'
    },
    currentChange(page) {
      this.dataPoints = []
      this.currentPage = page
      this.getParams.page = page
      this.getTestTypesList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
