<template>
  <div>
    <!-- 试验类型管理 -->
    <el-row>
      <el-col :span="12">
        <el-form :inline="true">
          <el-form-item style="float: right">
            <el-button
              v-permission="['test_type', 'add']"
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
                  v-permission="['test_type', 'change']"
                  size="mini"
                  @click="showEditTestTypeDialog(scope.row)"
                >编辑</el-button>
                <!-- <el-button
                  size="mini"
                  type="danger"
                  @click="handleTestTypeDelete(scope.row)"
                >删除</el-button> -->
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
              v-permission="['test_type', 'pointAdd']"
              :disabled="!testTypesCurrentRow"
              @click="showCreateDataPointsDialog"
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
                  v-permission="['test_type', 'pointChange']"
                  size="mini"
                  @click="showEditDataPointsDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="showNorm(scope.row)"
                >操作pass指标</el-button>
                <!-- <el-button
                  size="mini"
                  type="danger"
                  @click="handleDataPointsDelete(scope.row)"
                >删除</el-button> -->
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      title="添加试验类型"
      :visible.sync="dialogCreateTestTypeVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="createTestTypeForm" :rules="rules" :model="testTypeForm">
        <el-form-item
          label="试验类型"
          prop="name"
        >
          <el-input v-model="testTypeForm.name" />
        </el-form-item>
        <el-form-item
          label="试验指标"
          prop="test_indicator"
        >
          <el-select
            v-model="testTypeForm.test_indicator"
            type="test_indicator"
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
      :close-on-click-modal="false"
    >
      <el-form ref="editTestTypeForm" :rules="rules" :model="testTypeForm">
        <el-form-item
          label="试验类型"

          prop="name"
        >
          <el-input
            v-model="testTypeForm.name"
          />
        </el-form-item>
        <el-form-item
          label="试验指标"

          prop="test_indicator"
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
      :close-on-click-modal="false"
    >
      <el-form ref="createDataPointsForm" :rules="rules" :model="dataPointsForm">
        <el-form-item
          label="数据点"

          prop="name"
        >
          <el-input v-model="dataPointsForm.name" />
        </el-form-item>
        <el-form-item
          label="单位"

          prop="unit"
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
          @click="handleCreateDataPoints"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑试验"
      :visible.sync="dialogEditDataPointsVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="editDataPointsForm" :rules="rules" :model="dataPointsForm">
        <el-form-item
          label="数据点"

          prop="name"
        >
          <el-input
            v-model="dataPointsForm.name"
          />
        </el-form-item>
        <el-form-item
          label="单位"

          prop="unit"
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
          @click="handleEditDataPoints"
        >确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="不合格品pass指标"
      :visible.sync="passVisible"
    >
      <el-button
        type="primary"
        size="mini"
        style="margin-bottom:10px"
        @click="addNorm"
      >新 增</el-button>
      <el-table
        v-loading="loadingPass"
        :data="passTableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          label="范围指标"
        >
          <template slot-scope="{row}">
            {{ row.value }}
          </template>
        </el-table-column>
        <el-table-column
          prop="tracking_card"
          label="追踪卡"
        />
        <el-table-column
          prop="label"
          label="标志及处理"
        />
        <el-table-column
          prop="address"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                @click="editNorm(scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="delNorm(scope.row)"
              >删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      :title="(passForm.id?'编辑':'新增')+'pass指标'"
      :visible.sync="passVisible1"
      width="600px"
      :before-close="passVisibleClose"
    >
      <el-form ref="passForm" :model="passForm" :rules="passRules" label-width="100px">
        <el-form-item label="范围指标" prop="value">
          <el-input v-model="passForm.value" />
          <br>
          请以' ( '或' [ '开头和 ' ) '或' ] ' 结尾;例子：(1,2]、[1,2)、[1,2]、(1,2)
        </el-form-item>
        <el-form-item label="标志及处理" prop="label">
          <el-select
            v-model="passForm.label"
            filterable
            allow-create
            default-first-options
            placeholder="请选择标志及处理"
          >
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="passVisibleClose(false)">取 消</el-button>
        <el-button
          type="primary"
          :loading="btnPassLoading"
          @click="submitPass"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTestTypes, putTestTypes, postTestTypes, deleteTestTypes, getTestIndicators, getDataPoints, putDataPoints, postDataPoints, deleteDataPoints, dataPointStandardErrors, dataPointLabelHistory } from '@/api/test_types'
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
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        test_indicator: [{ required: true, message: '不能为空', trigger: 'blur' }],
        unit: [{ required: true, message: '不能为空', trigger: 'blur' }]
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
      total: 1,
      passVisible: false,
      passVisible1: false,
      passTableData: [],
      passForm: {
        tracking_card: 'pass章',
        value: '',
        label: null
      },
      passRules: {
        value: [{ required: true, trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('范围指标不能为空'))
            } else {
              const arg = /^(\(|\[)+((\-|\+)?\d+(\.\d+)?)+(\,)+((\-|\+)?\d+(\.\d+)?)+(\)|\])$/
              var re = new RegExp(arg)
              const a = re.test(value)
              if (!a) {
                callback(new Error(`请以' ( '或' [ '开头和 ' ) '或' ] ' 结尾`))
              } else {
                callback()
              }
            }
          } }],
        label: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      options: [],
      loadingPass: false,
      btnPassLoading: false
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  created() {
    this.permissionObj = this.permission
    this.getTestTypesList()
    this.getOptionsList()
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
    showCreateTestTypeDialog: function() {
      this.clearTestTypeForm()
      this.getTestIndicatorsOptions()
      this.dialogCreateTestTypeVisible = true
      this.$nextTick(() => {
        this.$refs.createTestTypeForm.clearValidate()
      })
    },
    getTestIndicatorsOptions() {
      getTestIndicators({ all: 1 })
        .then(response => {
          this.testIndicatorsOptions = response
        })
    },
    handleCreateTestType: function() {
      this.$refs.createTestTypeForm.validate((valid) => {
        if (valid) {
          // this.clearTestTypeFormError()
          postTestTypes(this.testTypeForm)
            .then(response => {
              this.dialogCreateTestTypeVisible = false
              this.$message(this.testTypeForm.name + '创建成功')
              this.currentChange(this.currentPage)
            })
        }
      })
    },
    showEditTestTypeDialog: function(row) {
      this.clearTestTypeForm()
      // this.clearTestTypeFormError()
      this.testTypeForm = Object.assign({}, row)
      this.getTestIndicatorsOptions()
      this.dialogEditTestTypeVisible = true
      this.$nextTick(() => {
        this.$refs.editTestTypeForm.clearValidate()
      })
    },
    handleEditTestType: function() {
      this.$refs.editTestTypeForm.validate((valid) => {
        if (valid) {
          putTestTypes(this.testTypeForm, this.testTypeForm.id)
            .then(response => {
              this.dialogEditTestTypeVisible = false
              this.$message(this.testTypeForm.name + '修改成功')
              this.currentChange(this.currentPage)
            })
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
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.tableData.length === 1 && this.currentPage > 1) {
              --this.currentPage
            }
            this.currentChange(this.currentPage)
          })
      }).catch(function() {

      })
    },

    handleTestTypesCurrentRowChange: function(row) {
      if (!row) { return }
      this.testTypesCurrentRow = row
      getDataPoints({ all: 1, test_type_id: row.id })
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
    showCreateDataPointsDialog: function() {
      if (!this.dataPointsForm.test_type) { return }
      this.clearDataPointsForm()
      this.dialogCreateDataPointsVisible = true
      this.$nextTick(() => {
        this.$refs.createDataPointsForm.clearValidate()
      })
    },
    handleCreateDataPoints: function() {
      this.$refs.createDataPointsForm.validate((valid) => {
        if (valid) {
          postDataPoints(this.dataPointsForm)
            .then(response => {
              this.dialogCreateDataPointsVisible = false
              this.$message(this.dataPointsForm.name + '创建成功')
              this.handleTestTypesCurrentRowChange(this.testTypesCurrentRow)
            })
        }
      })
    },
    showEditDataPointsDialog: function(row) {
      this.clearDataPointsForm()
      this.dataPointsForm.id = row.id
      this.dataPointsForm.name = row.name
      this.dataPointsForm.unit = row.unit
      this.dialogEditDataPointsVisible = true
      this.$nextTick(() => {
        this.$refs.editDataPointsForm.clearValidate()
      })
    },
    handleEditDataPoints: function() {
      this.$refs.editDataPointsForm.validate((valid) => {
        if (valid) {
          putDataPoints(this.dataPointsForm, this.dataPointsForm.id)
            .then(response => {
              this.dialogEditDataPointsVisible = false
              this.$message(this.dataPointsForm.name + '修改成功')
              this.handleTestTypesCurrentRowChange(this.testTypesCurrentRow)
            })
        }
      })
    },
    handleDataPointsDelete: function(row) {
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
          }).catch(error => {
            this.$message.error(error)
          })
      })
    },
    currentChange(page) {
      this.dataPoints = []
      this.currentPage = page
      this.getParams.page = page
      this.getTestTypesList()
    },
    showNorm(row) {
      this.passVisible = true
      this.passForm.data_point = row.id
      this.getPassList(row.id)
    },
    editNorm(row) {
      this.passForm = JSON.parse(JSON.stringify(row))
      this.passVisible1 = true
    },
    async getPassList(id) {
      try {
        this.loadingPass = true
        const data = await dataPointStandardErrors('get', null, { params: { data_point_id: id }})
        this.passTableData = data
        this.loadingPass = false
      } catch (e) { this.loadingPass = false }
    },
    async getOptionsList() {
      try {
        const data = await dataPointLabelHistory('get')
        this.options = data
      } catch (e) { //
      }
    },
    delNorm(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await dataPointStandardErrors('delete', row.id || '')
          this.getPassList(this.passForm.data_point)
        } catch (e) {
          //
        }
      })
    },
    addNorm() {
      this.passVisible1 = true
    },
    submitPass() {
      this.$refs.passForm.validate(async(valid) => {
        if (valid) {
          const obj = JSON.parse(JSON.stringify(this.passForm))
          const a = obj.value.split(',')
          if (obj.lower_value) {
            delete obj.lower_value
          }
          if (Object.prototype.hasOwnProperty.call(obj, 'lower_value')) {
            delete obj.lower_value
          }
          if (Object.prototype.hasOwnProperty.call(obj, 'upper_value')) {
            delete obj.upper_value
          }
          if (a[0].substr(1) > a[1].substr(0, a[1].length - 1)) {
            return this.$message.info('范围指标：第二个数字不可大于第一个数字')
          }
          if (a[0].substr(1) < 0 && a[1].substr(0, a[1].length - 1) > 0) {
            // 需要循环a 调2次接口
            this.$confirm(`指标范围${obj.value}将分解为${a[0]},0)(0,${a[1]}`, '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              a.forEach((d, i) => {
                if (i === 0) {
                  obj.value = d + ',0)'
                } else {
                  obj.value = '(0,' + d
                }
                this.dataPointStandardEdit(JSON.parse(JSON.stringify(obj)))
              })
            })
          } else {
            // 调1次接口就可
            this.dataPointStandardEdit(obj)
          }
        } else {
          return false
        }
      })
    },
    async dataPointStandardEdit(obj) {
      try {
        this.btnPassLoading = true
        const _api = this.passForm.id ? 'patch' : 'post'
        await dataPointStandardErrors(_api, this.passForm.id || '', { data: obj })
        this.passVisibleClose(false)
        this.btnPassLoading = false
        this.getPassList(this.passForm.data_point)
      } catch (e) { this.btnPassLoading = false }
    },
    passVisibleClose(done) {
      this.passVisible1 = false
      this.passForm.value = ''
      this.passForm.label = null
      delete this.passForm.id
      setTimeout(() => {
        this.$refs.passForm.clearValidate()
      }, 300)
      if (done) {
        done()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input{
  width: 210px;
}
</style>
