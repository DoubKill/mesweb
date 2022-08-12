<template>
  <div v-loading="loading">
    <!-- 胶料快检判定基准录入 -->
    <el-form :inline="true">
      <el-form-item label="段次">
        <stage-select v-model="search.stage" @change="changeList" />
      </el-form-item>
      <el-form-item label="检测指标:">
        <!-- <detection-index @changeSelect="detectionIndexSelect" /> -->
        <el-select
          v-model="search.test_indicator_id"
          placeholder="请选择"
          clearable
          filterable
          @change="changeDetectionIndex"
        >
          <el-option
            v-for="item in optionsDetectionIndex"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="试验类型:">
        <test-type-select :obj="true" @changeSelect="typeSelectTable" />
      </el-form-item>
      <el-form-item v-if="search.test_indicator_name==='流变'" label="试验方法:">
        <el-select
          v-model="search.test_method_id"
          placeholder="请选择"
          clearable
          filterable
          @change="changeList"
        >
          <el-option
            v-for="item in optionsTestMethod"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="胶料代码:">
        <el-select
          v-model="search.product_type"
          placeholder="请选择"
          clearable
          filterable
          @change="changeList"
        >
          <el-option
            v-for="item in optionsProductCode"
            :key="item.id"
            :label="item.product_no"
            :value="item.product_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="胶料编码:">
        <!-- <all-product-no-select @productBatchingChanged="productBatchingChanged" /> -->
        <el-select
          v-model="search.material_no"
          placeholder="请选择"
          clearable
          filterable
          @change="changeList"
        >
          <el-option
            v-for="item in optionsProduct"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-permission="['evaluating','add']">
        <el-button @click="addDialog">新增</el-button>
        <el-button type="primary" @click="batchDialog">批量修改判定基准</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      border
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
      />
      <el-table-column
        type="index"
        label="No"
      />
      <el-table-column
        prop="material_no"
        label="胶料编码"
      />
      <el-table-column
        prop="test_indicator_name"
        label="检测指标"
      />
      <el-table-column
        prop="test_type_name"
        label="试验类型"
      />
      <el-table-column
        prop="test_method_name"
        label="试验方法"
      />
      <el-table-column
        prop="test_method_name"
        label="是否判级项目"
      >
        <template slot-scope="{row,$index}">
          <el-switch
            v-model="row.is_judged"
            :disabled="!checkPermission(['evaluating','change'])"
            active-color="#13ce66"
            @change="judgedFun($event,row,$index,true)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="是否打印项目"
      >
        <template slot-scope="{row,$index}">
          <el-switch
            v-model="row.is_print"
            :disabled="!checkPermission(['evaluating','change'])"
            active-color="#13ce66"
            @change="judgedFun($event,row,$index,false)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="280px"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['evaluating','change']"
            size="small"
            type="primary"
            @click="editClick(scope.row)"
          >判定基准</el-button>
          <el-button
            v-permission="['evaluating','change']"
            size="small"
            @click="pointClick(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="['evaluating','change']"
            size="small"
            type="danger"
            @click="clickDelete(scope.$index,scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      :title="addForm.id?'编辑':'新增'"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="胶料编码:" prop="material">
          <div v-if="addForm.id">{{ addForm.material_no }}</div>
          <el-select
            v-else
            v-model="addForm.material"
            placeholder="请选择胶料编码"
            filterable
          >
            <el-option
              v-for="item in optionsRubber"
              :key="item.id"
              :label="item.material_no"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="试验类型:" prop="b">
          <div v-if="addForm.id">{{ addForm.test_type_name }}</div>
          <test-type-select v-else ref="testTypeSelect" @changeSelect="typeSelect" />
        </el-form-item>
        <el-form-item label="试验方法:" prop="test_method">
          <div v-if="addForm.id">{{ addForm.test_method_name }}</div>
          <test-method-select
            v-else
            ref="testMethodSelect"
            :is-type-filter="true"
            :is-required="true"
            :new-test-type-id="addForm.b"
            @changeSelect="testMethodChange"
          />
        </el-form-item>
        <el-form-item label="数据点:" prop="data_point">
          <test-type-dot-select
            ref="testTypeDotSelect"
            :multiple-is="true"
            :test-type-id="addForm.b"
            :created-is="true"
            :default-val="addForm.data_point"
            :show="dialogVisible"
            @changSelect="changSelectDot"
          />
        </el-form-item>
        <el-form-item label="是否判级项目">
          <el-switch
            v-model="addForm.is_judged"
            active-color="#13ce66"
            @change="changeJudged"
          />
        </el-form-item>
        <el-form-item label="是否打印项目">
          <el-switch
            v-model="addForm.is_print"
            active-color="#13ce66"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearForm">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="sureAdd">确 定</el-button>
      </span>
    </el-dialog>

    <edit-dialog
      :edit-show="editShow"
      :obj-edit="objEdit"
      @handleCloseEdit="handleCloseEdit"
    />
    <batchEditDialog
      :edit-show="batchEditShow"
      :obj-edit="batchObjEdit"
      @handleCloseEdit="batchHandleCloseEdit"
    />
  </div>
</template>

<script>
// import productNoSelect from '@/components/ProductNoSelect'
import testTypeSelect from '@/components/select_w/testTypeSelect'
import testMethodSelect from '@/components/select_w/testMethodSelect'
import testTypeDotSelect from '@/components/select_w/testTypeDotSelect'
import { batchingMaterials, matTestMethods, testSubTypes, productInfosUrl, testedMaterials, testIndicators } from '@/api/base_w'
import page from '@/components/page'
// import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import editDialog from './benchmark_edit_dialog/benchmark_edit_dialog'
import batchEditDialog from './benchmark_edit_dialog/benchmark_edit_dialog_batch'
import { checkPermission } from '@/utils/'
import StageSelect from '@/components/StageSelect/index'
export default {
  name: 'BenchmarkEdit',
  components: { editDialog, page, testTypeDotSelect, testTypeSelect, testMethodSelect, StageSelect, batchEditDialog },
  data() {
    var validatePass = (rule, value, callback, _val, error) => {
      if (!_val || _val.length === 0) {
        callback(new Error(error))
      } else {
        callback()
      }
    }
    return {
      search: {
        page: 1
      },
      total: 0,
      loading: false,
      dialogVisible: false,
      loadingBtn: false,
      addForm: {
        material: null,
        b: null,
        test_method: null,
        data_point: null,
        is_judged: true,
        is_print: true
      },
      optionsRubber: [],
      editShow: false,
      rules: {
        material: [
          { required: true, message: '请选择胶料编码', trigger: 'change' }
        ],
        b: [
          { required: true, validator: (rule, value, callback) => {
            validatePass(rule, value, callback,
              this.addForm.b, '请选择胶料编码')
          } }
        ],
        test_method: [
          { required: true, validator: (rule, value, callback) => {
            validatePass(rule, value, callback,
              this.addForm.test_method, '请选择试验方法')
          } }
        ],
        data_point: [
          { required: true, validator: (rule, value, callback) => {
            validatePass(rule, value, callback,
              this.addForm.data_point, '请选择数据点')
          } }
        ]
      },
      tableData: [],
      objEdit: {},
      batchObjEdit: {},
      optionsDetectionIndex: [],
      optionsTestMethod: [],
      optionsProductCode: [],
      handleSelection: [],
      optionsProduct: [],
      batchEditShow: false
    }
  },
  created() {
    this.getList()
    this.getRubber()
    this.getDetectionIndex()
    this.getTestMethod()
    this.getProductCode()
    this.getProduct()
  },
  methods: {
    checkPermission,
    async getList() {
      this.loading = true
      try {
        const data = await matTestMethods('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    changeList() {
      this.search.page = 1
      this.$refs.multipleTable.clearSelection()
      this.getProduct()
      this.getList()
    },
    async getRubber() {
      try {
        const data = await batchingMaterials('get', null, { params: { used_type: 4 }})
        this.optionsRubber = data || []
      } catch (e) {
        //
      }
    },
    async getTestMethod() {
      try {
        const data = await testSubTypes('get', null, { params: { all: 1 }})
        this.optionsTestMethod = data.results || []
      } catch (e) {
        //
      }
    },
    async getDetectionIndex() {
      try {
        const data = await testIndicators('get', null, { params: { all: 1 }})
        this.optionsDetectionIndex = data || []
      } catch (e) {
        //
      }
    },
    async getProduct() {
      try {
        const data = await testedMaterials('get', null, { params: this.search })
        this.optionsProduct = data || []
      } catch (e) {
        //
      }
    },
    async getProductCode() {
      try {
        const data = await productInfosUrl('get', null, { params: { all: 1 }})
        this.optionsProductCode = data.results || []
      } catch (e) {
        //
      }
    },
    typeSelectTable(val) {
      this.search.test_type_id = val ? val.id : ''
      this.search.test_type_name = val ? val.name : ''
      this.search.page = 1
      this.$refs.multipleTable.clearSelection()
      this.getProduct()
      this.getList()
    },
    detectionIndexSelect(id) {
      this.search.test_indicator_id = id || ''
      this.search.page = 1
      this.$refs.multipleTable.clearSelection()
      this.getProduct()
      this.getList()
    },
    changeDetectionIndex(val) {
      if (val) {
        const arr = this.optionsDetectionIndex.filter(d => d.id === val)
        this.search.test_indicator_name = arr[0].name
      } else {
        this.search.test_indicator_name = ''
      }
      this.search.page = 1
      this.$refs.multipleTable.clearSelection()
      this.getProduct()
      this.getList()
    },
    typeSelect(val) {
      if (!val) {
        this.addForm.b = null
      } else {
        this.$set(this.addForm, 'b', val)
      }
      this.$refs.testMethodSelect.testMode = ''
      this.$refs.testTypeDotSelect.value = []
    },
    testMethodChange(val) {
      this.$set(this.addForm, 'test_method', val)
    },
    changSelectDot(val) {
      this.$set(this.addForm, 'data_point', val)
    },
    handleClose(done) {
      this.clearForm()
      done()
    },
    handleSelectionChange(val) {
      this.handleSelection = val
    },
    async batchDialog() {
      if (!this.search.test_indicator_id || !this.search.test_type_id || !this.search.product_type) {
        this.$message('请选择检测指标、试验类型、胶料代码')
        return
      }
      if (!this.handleSelection.length) {
        this.$message('请选择胶料')
        return
      }
      this.batchObjEdit.test_indicator_name = this.search.test_indicator_name
      this.batchObjEdit.test_type_name = this.search.test_type_name
      this.batchObjEdit.test_method_ids = []
      const _first = (this.handleSelection[0].data_point.sort()).toString()
      const _bool = this.handleSelection.every(D => {
        this.batchObjEdit.test_method_ids.push(D.id)
        return (D.data_point.sort()).toString() === _first
      })
      if (!_bool) {
        this.$message('选择的胶料,数据点不一样')
        return
      }
      this.$set(this.batchObjEdit, 'tableData', JSON.parse(JSON.stringify(this.handleSelection[0].data_points)))
      this.batchObjEdit.tableData.forEach(d => {
        d.data_point = d.id
      })
      this.batchEditShow = true
    },
    addDialog() {
      this.dialogVisible = true
    },
    clearForm() {
      this.dialogVisible = false
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields()
      }
      this.addForm = {
        is_judged: true,
        is_print: true
      }

      if (this.$refs.testTypeSelect) {
        this.$refs.testTypeSelect.value = ''
      }
      if (this.$refs.testMethodSelect) {
        this.$refs.testMethodSelect.testMode = ''
      }
      if (this.$refs.testTypeDotSelect) {
        this.$refs.testTypeDotSelect.value = []
      }
    },
    productBatchingChanged(val) {
      this.search.material_no = val ? val.material_no : ''
      this.search.page = 1
      this.getList()
    },
    clickDelete(index, row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        matTestMethods('delete', row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.tableData.splice(index, 1)
          }).catch(e => {
            this.$message.error('删除失败')
          })
      })
    },
    sureAdd() {
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          try {
            this.loadingBtn = true
            const _api = this.addForm.id ? 'put' : 'post'
            await matTestMethods(_api, this.addForm.id || '', { data: this.addForm })
            this.$message.success('操作成功')
            this.getList()
            this.loadingBtn = false
            this.clearForm()
          } catch (e) {
            this.loadingBtn = false
          }
        } else {
          return false
        }
      })
    },
    handleCloseEdit() {
      this.editShow = false
    },
    batchHandleCloseEdit() {
      this.batchEditShow = false
    },
    editClick(val) {
      this.editShow = true
      this.objEdit = val
    },
    pointClick(row) {
      this.dialogVisible = true
      this.addForm = JSON.parse(JSON.stringify(row))
      this.addForm.b = this.addForm.test_type
    },
    async judgedFun(bool, row, index, isJudged) {
      try {
        const obj = { is_print: bool }
        if (isJudged) {
          row.is_print = bool
          obj.is_judged = bool
        }
        await matTestMethods('patch', row.id, { data: obj })
        this.$message.success('修改成功')
      } catch (e) {
        this.getList()
      }
    },
    changeJudged(val) {
      this.addForm.is_print = val
    }
  }
}
</script>

<style>

</style>
