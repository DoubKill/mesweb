<template>
  <div class="menni-equip">
    <!-- 胶料门尼设备管理 -->
    <el-form :inline="true">
      <el-form-item label="设备编号">
        <el-input v-model="search.no" clearable @input="debounceChange" />
      </el-form-item>
      <!-- <el-form-item label="绑定胶料">
        <all-product-no-select @productBatchingChanged="productBatchingChanged" />
      </el-form-item> -->
      <el-form-item style="float:right">
        <el-button
          v-permission="['product_report_equip','add']"
          type="primary"
          @click="addFun"
        >添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="no"
        label="设备编号"
        min-width="20"
      />
      <el-table-column
        prop="ip"
        label="Ip"
        min-width="20"
      />
      <el-table-column
        prop="test_type_name"
        label="试验类型"
        min-width="20"
      />
      <el-table-column
        prop="data_point_name"
        label="数据点"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="创建时间"
        min-width="20"
      />
      <el-table-column
        prop="last_updated_date"
        label="更新时间"
        min-width="20"
      />
      <el-table-column
        prop="examine_date"
        label="操作"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-button
            v-permission="['product_report_equip','change']"
            size="mini"
            @click="editFun(row)"
          >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :old-page="false"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="(formObj.id?'编辑':'添加')+'门尼设备'"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        ref="formObj"
        :rules="rulesFormData"
        :model="formObj"
        label-width="100px"
      >
        <el-form-item label="设备编号" prop="no">
          <el-input v-model="formObj.no" />
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="formObj.ip" />
        </el-form-item>
        <!-- <el-form-item label="绑定胶料" prop="material">
          <all-product-no-select :default-val="formObj.material" :is-created-list="true" @productBatchingChanged="productBatchingChangedForm" />
        </el-form-item> -->
        <el-form-item label="试验类型:" prop="test_type">
          <test-type-select ref="testTypeSelect" :default-val="formObj.test_type" :is-created="true" @changeSelect="typeSelect" />
        </el-form-item>
        <el-form-item label="数据点:" prop="data_point">
          <test-type-dot-select
            :test-type-id="formObj.test_type"
            :created-is="true"
            :default-val="formObj.data_point"
            :show="dialogVisible"
            @changSelect="changSelectDot"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { debounce } from '@/utils'
// import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import testTypeSelect from '@/components/select_w/testTypeSelect'
import testTypeDotSelect from '@/components/select_w/testTypeDotSelect'
import { productReportEquip } from '@/api/base_w_four'
import page from '@/components/page'
export default {
  name: 'RubberMenniEquip',
  components: { testTypeSelect, testTypeDotSelect, page },
  data() {
    var validatePass = (rule, value, callback, _val, error) => {
      if (!_val || _val.length === 0) {
        callback(new Error(error))
      } else {
        callback()
      }
    }
    return {
      search: {},
      tableData: [],
      loading: false,
      dialogVisible: false,
      formObj: {},
      total: 0,
      loadingBtn: false,
      rulesFormData: {
        no: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请输入IP', trigger: 'blur' }
        ],
        material: [{ required: true, message: '不能为空',
          validator: (rule, value, callback) => {
            if (!this.formObj.material && !value) {
              callback(new Error('请选择胶料'))
            } else {
              callback()
            }
          }, trigger: 'change' }],
        test_type: [
          { required: true, validator: (rule, value, callback) => {
            validatePass(rule, value, callback,
              this.formObj.test_type, '请选择试验类型')
          } }
        ],
        data_point: [
          { required: true, validator: (rule, value, callback) => {
            validatePass(rule, value, callback,
              this.formObj.data_point, '请选择数据点')
          } }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await productReportEquip('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) { this.loading = false }
    },
    debounceChange() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    productBatchingChanged(val) {
      this.search.material = val ? val.material_no : null
      this.getList()
    },
    editFun(row) {
      this.dialogVisible = true
      this.formObj = JSON.parse(JSON.stringify(row))
    },
    addFun() {
      this.dialogVisible = true
    },
    productBatchingChangedForm(val) {
      this.$set(this.formObj, 'material', val ? val.material_no : null)
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    handleClose(done) {
      this.dialogVisible = false
      this.formObj = {
        no: '',
        ip: '',
        test_type: '',
        data_point: null
      }
      this.$refs.formObj.resetFields()
      this.$refs.testTypeSelect.value = null
      if (done) {
        done()
      }
    },
    typeSelect(val) {
      this.$set(this.formObj, 'test_type', val || null)
      this.$set(this.formObj, 'data_point', null)
    },
    changSelectDot(val) {
      this.$set(this.formObj, 'data_point', val)
    },
    submitFun() {
      this.$refs.formObj.validate(async(valid) => {
        if (valid) {
          const _api = this.formObj.id ? 'put' : 'post'
          try {
            this.loadingBtn = true
            await productReportEquip(_api, this.formObj.id, { data: this.formObj })
            this.$message.success('操作成功')
            this.getList()
            this.handleClose(false)
            this.loadingBtn = false
          } catch (e) {
            this.loadingBtn = false
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
.menni-equip{
    .el-input{
    width: auto;
    }
}
</style>
