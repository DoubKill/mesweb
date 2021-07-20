<template>
  <div v-loading="loading">
    <!-- 胶料快检判定基准录入 -->
    <el-form :inline="true">
      <el-form-item label="胶料编码:">
        <all-product-no-select @productBatchingChanged="productBatchingChanged" />
        <!-- <product-no-select @productBatchingChanged="productBatchingChanged" /> -->
      </el-form-item>
      <el-form-item label="试验指标:">
        <detection-index @changeSelect="detectionIndexSelect" />
      </el-form-item>
      <el-form-item label="试验类型:">
        <test-type-select @changeSelect="typeSelectTable" />
      </el-form-item>
      <el-form-item v-permission="['evaluating','add']">
        <el-button @click="addDialog">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
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
            active-color="#13ce66"
            @change="judgedFun($event,row,$index)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200px"
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
  </div>
</template>

<script>
// import productNoSelect from '@/components/ProductNoSelect'
import testTypeSelect from '@/components/select_w/testTypeSelect'
import testMethodSelect from '@/components/select_w/testMethodSelect'
import detectionIndex from '@/components/select_w/detectionIndex'
import testTypeDotSelect from '@/components/select_w/testTypeDotSelect'
import { batchingMaterials, matTestMethods } from '@/api/base_w'
import page from '@/components/page'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import editDialog from './benchmark_edit_dialog/benchmark_edit_dialog'
export default {
  name: 'BenchmarkEdit',
  components: { editDialog, page, testTypeDotSelect, allProductNoSelect, testTypeSelect, testMethodSelect, detectionIndex },
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
        is_judged: true
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
      objEdit: {}
    }
  },
  created() {
    this.getList()
    this.getRubber()
  },
  methods: {
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
    async getRubber() {
      try {
        const data = await batchingMaterials('get')
        this.optionsRubber = data || []
      } catch (e) {
        //
      }
    },
    typeSelectTable(id) {
      this.search.test_type_id = id || ''
      this.search.page = 1
      this.getList()
    },
    detectionIndexSelect(id) {
      this.search.test_indicator_id = id || ''
      this.search.page = 1
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
    addDialog() {
      this.dialogVisible = true
    },
    clearForm() {
      this.dialogVisible = false
      if (this.$refs.addForm) {
        this.$refs.addForm.resetFields()
      }
      this.addForm = {
        is_judged: true
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
      this.$confirm(
        '是否删除?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        await matTestMethods('delete', row.id)
        this.$message.success('删除成功')
        this.tableData.splice(index, 1)
      }).catch(() => {
        //
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
    editClick(val) {
      this.editShow = true
      this.objEdit = val
    },
    pointClick(row) {
      this.dialogVisible = true
      this.addForm = JSON.parse(JSON.stringify(row))
      this.addForm.b = this.addForm.test_type
    },
    async judgedFun(bool, row, index) {
      try {
        await matTestMethods('patch', row.id, { data: { is_judged: bool }})
        this.$message.success('修改成功')
      } catch (e) {
        this.tableData[index].is_judged = !this.tableData[index].is_judged
      }
    }
  }
}
</script>

<style>

</style>
