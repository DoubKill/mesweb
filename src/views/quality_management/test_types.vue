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
            prop="name"
            label="试验类型"
          />
          <el-table-column
            prop="test_indicator_name"
            label="试验指标"
          />
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
                >删除</el-button>
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
            prop="name"
            label="数据点"
          />
          <el-table-column
            prop="unit"
            label="单位"
          />
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
                >删除</el-button>
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
          :error="testTypeFormError.name"
          label="试验类型"
          :label-width="formLabelWidth"
        >
          <el-input v-model="testTypeForm.name" />
        </el-form-item>
        <el-form-item
          :error="testTypeFormError.test_indicator"
          label="试验指标"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="testTypeForm.test_indicator"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in testIndicatorsOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
          :error="testTypeFormError.name"
          label="试验类型"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="testTypeForm.name"
          />
        </el-form-item>
        <el-form-item
          :error="testTypeFormError.test_indicator"
          label="试验指标"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="testTypeForm.test_indicator"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in testIndicatorsOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
          :error="dataPointsFormError.name"
          label="数据点"
          :label-width="formLabelWidth"
        >
          <el-input v-model="dataPointsForm.name" />
        </el-form-item>
        <el-form-item
          :error="dataPointsFormError.unit"
          label="单位"
          :label-width="formLabelWidth"
        >
          <el-input v-model="dataPointsForm.unit" />
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
          :error="dataPointsFormError.name"
          label="数据点"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="dataPointsForm.name"
          />
        </el-form-item>
        <el-form-item
          :error="dataPointsFormError.unit"
          label="单位"
          :label-width="formLabelWidth"
        >
          <el-input v-model="dataPointsForm.unit" />
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
import { getTestTypes, putTestTypes, postTestTypes, deleteTestTypes, getTestIndicators, getDataPoints, putDataPoints, postDataPoints, deleteDataPoints } from '@/api/test_types'
import page from '@/components/page'
import { mapGetters } from 'vuex'
export default {
  components: { page },
  data: function() {
    return {
      formLabelWidth: 'auto',
      tableData: [],
      test_indicator: '',
      testTypesCurrentRow: null,
      dialogCreateTestTypeVisible: false,
      dialogEditTestTypeVisible: false,
      testIndicatorsOptions: [],
      testTypeForm: {
        name: '',
        test_indicator: ''
      },
      testTypeFormError: {},

      dataPoints: [],
      dialogCreateDataPointsVisible: false,
      dialogEditDataPointsVisible: false,
      dataPointsForm: {

        name: '',
        unit: '',
        test_type: null
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
        name: '',
        test_indicator: ''
      }
    },
    clearTestTypeFormError: function() {
      this.testTypeFormError = {
        name: '',
        test_indicator: ''
      }
    },
    showCreateTestTypeDialog: function() {
      this.clearTestTypeForm()
      this.clearTestTypeFormError()
      this.getTestIndicatorsOptions()
      this.dialogCreateTestTypeVisible = true
    },
    getTestIndicatorsOptions() {
      getTestIndicators({ all: 1 })
        .then(response => {
          this.testIndicatorsOptions = response
        })
    },
    handleCreateTestType: function() { // 创建全局代码类型
      this.clearTestTypeFormError()
      postTestTypes(this.testTypeForm)
        .then(response => {
          this.dialogCreateTestTypeVisible = false
          this.$message(this.testTypeForm.name + '创建成功')
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
      this.getTestIndicatorsOptions()
      this.dialogEditTestTypeVisible = true
    },
    handleEditTestType: function() {
      putTestTypes(this.testTypeForm, this.testTypeForm.id)
        .then(response => {
          this.dialogEditTestTypeVisible = false
          this.$message(this.testTypeForm.name + '修改成功')
          this.currentChange(this.currentPage)
        }).catch(function(error) {
          for (var key in this.testTypeFormError) {
            console.log(error)
            if (error[key]) { this.testTypeFormError[key] = error[key].join(',') }
          }
        })
    },
    handleTestTypeDelete: function(row) {
      this.$confirm('此操作将永久删除' + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTestTypes(row.id)
          .then(response => {
            console.log('sssssssssss')
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.tableData.length === 1 && this.currentPage > 1) {
              --this.currentPage
            }
            this.currentChange(this.currentPage)
          }).catch(function(error) {
            this.$message.error(error)
          })
      }).catch(function() {

      })
    },

    handleTestTypesCurrentRowChange: function(row) {
      if (!row) { return }
      this.testTypesCurrentRow = row
      getDataPoints({ test_type_id: row.id })
        .then(response => {
          this.dataPoints = response.results
          this.dataPointsForm.test_type = row.id
        })
    },
    clearDataPointsForm: function() {
      this.dataPointsForm = {

        name: '',
        unit: '',
        description: '',
        test_type: this.dataPointsForm.test_type
      }
    },
    clearDataPointsFormError: function() {
      this.dataPointsFormError = {

        name: '',
        unit: '',
        description: ''
      }
    },
    showCreateTestDialog: function() {
      if (!this.dataPointsForm.test_type) { return }
      this.clearDataPointsForm()
      this.clearDataPointsFormError()
      this.dialogCreateDataPointsVisible = true
    },
    handleCreateTest: function() {
      this.clearDataPointsFormError()
      postDataPoints(this.dataPointsForm)
        .then(response => {
          this.dialogCreateDataPointsVisible = false
          this.$message(this.dataPointsForm.name + '创建成功')
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
      this.dataPointsForm.name = row.name
      this.dataPointsForm.unit = row.unit
      this.dialogEditDataPointsVisible = true
    },
    handleEditTest: function() {
      putDataPoints(this.dataPointsForm, this.dataPointsForm.id)
        .then(response => {
          this.dialogEditDataPointsVisible = false
          this.$message(this.dataPointsForm.name + '修改成功')
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
    handleTestsDelete: function(row) {
      this.$confirm('此操作将永久删除' + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDataPoints(row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.handleTestTypesCurrentRowChange(this.testTypesCurrentRow)
          }).catch(function(error) {
            this.$message.error(error)
          })
      })
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
