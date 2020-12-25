<template>
  <div v-loading="loading">
    <!-- 发货计划管理 -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="getParams.start_time"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item v-if="!isDialog" label="订单状态">
        <el-select
          v-model="getParams.status"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in options1"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!isDialog" label="物料编码">
        <material-code-select @changeSelect="materialCodeFun" />
      </el-form-item>
      <el-form-item label="发货类型">
        <deliverTypeSelect @changeSelect="deliverTypeSelectFun" />
      </el-form-item>
      <el-form-item label="目的地">
        <destinationSelect @changeSelect="destinationSelectFun" />
      </el-form-item>
      <el-form-item v-if="!isDialog" style="float: right">
        <el-button
          v-permission="['delivery_plan', 'add']"
          @click="showCreateDialog"
        >新建</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      border
      :cell-style="cellStyle"
      style="width: 100%"
      :data="tableData"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="isDialog"
        type="selection"
        width="40"
        :reserve-selection="true"
      />
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="目的地" align="center" prop="dispatch_location_name" />
      <el-table-column label="发货单号" align="center" prop="order_no" />
      <el-table-column label="发货类型" align="center" prop="dispatch_type_name" />
      <el-table-column label="物料编码" align="center" prop="material_name" />
      <el-table-column label="发货数量" align="center" prop="need_qty" />
      <el-table-column label="已发数量" align="center" prop="actual_qty" />
      <el-table-column label="发货重量" align="center" prop="need_weight" />
      <el-table-column label="已发重量" align="center" prop="actual_weight" />
      <el-table-column label="订单状态" align="center" prop="status_name" />
      <el-table-column v-if="!isDialog" label="操作" width="134" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="scope.row.status == 2 || scope.row.status == 4"
              v-permission="['delivery_plan', 'delete']"
              size="mini"
              @click="handleClose(scope.row)"
            >关闭</el-button>
            <el-button
              v-if="scope.row.status == 4"
              v-permission="['delivery_plan', 'change']"
              size="mini"
              type="blue"
              @click="showEditDialog(scope.row)"
            >编辑
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column label="发起人" align="center" prop="dispatch_user" />
      <el-table-column label="发起时间" align="center" prop="start_time" />
      <el-table-column v-if="!isDialog" label="完成时间" align="center" prop="fin_time" />
    </el-table>
    <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <el-dialog
      title="新建发货计划"
      :visible.sync="createDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="Form" :rules="rules" label-width="100px" :model="createForm">
        <el-form-item
          label="目的地"
          prop="dispatch_location"
        >
          <destinationSelect ref="destinationSelect" @changeSelect="destinationCreateForm" />
        </el-form-item>
        <el-form-item
          label="发货类型"
          prop="dispatch_type"
        >
          <deliverTypeSelect ref="deliverTypeSelect" @changeSelect="deliverTypeCreateForm" />
        </el-form-item>
        <el-form-item
          label="物料编码"
          prop="material"
        >
          <material-code-select ref="materialCodeSelect" @changeSelect="materialCreateForm" />
        </el-form-item>
        <el-form-item
          label="发货数量"
          prop="need_qty"
        >
          <el-input v-model.number="createForm.need_qty" style="width: 200px;" type="age" />
        </el-form-item>
        <el-form-item
          label="发货重量"
          prop="need_weight"
        >
          <el-input-number v-model="createForm.need_weight" :min="0" :step="0.01" step-strictly />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleCreate()"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑发货计划"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="Form" :rules="rules" label-width="100px" :model="editForm">
        <el-form-item
          label="目的地"
          prop="dispatch_location"
        >
          <destinationSelect :default-val="editForm.dispatch_location" :created-is="true" @changeSelect="destinationEditForm" />
        </el-form-item>
        <el-form-item
          label="发货类型"
          prop="dispatch_type"
        >
          <deliverTypeSelect :default-val="editForm.dispatch_type" :created-is="true" @changeSelect="deliverTypeEditForm" />
        </el-form-item>
        <el-form-item
          label="发货数量"
          prop="need_qty"
        >
          <el-input v-model.number="editForm.need_qty" style="width: 200px;" type="age" />
        </el-form-item>
        <el-form-item
          label="发货重量"
          prop="need_weight"
        >
          <el-input-number v-model="editForm.need_weight" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEdit()"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDispatchPlan, postDispatchPlan, putDispatchPlan, deleteDispatchPlan } from '@/api/receive'
import { setDate } from '@/utils/index'
import page from '@/components/page'
import commitVal from '@/utils/common'
import MaterialCodeSelect from '@/components/materialCodeSelect'
import deliverTypeSelect from '@/components/select_w/deliverTypeSelect'
import destinationSelect from '@/components/select_w/destinationSelect'
export default {
  components: { page, MaterialCodeSelect, deliverTypeSelect, destinationSelect },
  props: {
    isDialog: {
      type: Boolean,
      default: false
    },
    materialNo: { // 物料编码No
      type: String,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    defalutVal: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      tableData: [],
      options1: commitVal.statusList,
      getParams: {
        start_time: setDate(),
        page: 1
      },
      createDialogVisible: false,
      createForm: {},
      editDialogVisible: false,
      editForm: {},
      rules: {
        dispatch_location: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dispatch_type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        material: [{ required: true, message: '不能为空', trigger: 'blur' }],
        need_qty: [{ required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', message: '请输入合法整数', trigger: 'blur' }],
        need_weight: [{ required: true, message: '不能为空', trigger: 'blur' },
          { type: 'number', message: '请输入合法数字', trigger: 'blur' }]
      },
      total: 1,
      handleSelection: [],
      loading: false
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.$refs.multipleTable.clearSelection()
        this.getParams.page = 1
        this.getParams.material_no = this.materialNo || null
        this.getTableData()
      }
    }
  },
  updated() {
  },
  created() {
    this.getParams.material_no = this.materialNo || null
    this.getTableData()
  },
  methods: {
    async getTableData() {
      this.loading = true
      await getDispatchPlan(this.getParams).then(response => {
        this.loading = false
        this.tableData = response.results
        this.total = response.count
        if (this.isDialog) {
          this.tableData = this.tableData.filter(D => [4, 2].includes(D.status))
        }

        if (this.tableData.length > 0) {
          if (this.defalutVal && this.defalutVal.length > 0) {
            this.tableData.forEach((D, i) => {
              if (this.defalutVal.findIndex(data => data.id === D.id) > -1) {
                // 用列表的id查找当前选中的列
                this.$refs.multipleTable.toggleRowSelection(D)
              }
            })
          }
        }
      }).catch(() => {
        this.loading = false
      })
    },
    changeList() {
      this.getParams.page = 1
      this.getTableData()
    },
    materialCodeFun(val) {
      this.getParams.material = val
      this.getParams.page = 1
      this.getTableData()
    },
    deliverTypeSelectFun(val) {
      this.getParams.dispatch_type = val
      this.getParams.page = 1
      this.getTableData()
    },
    destinationSelectFun(val) {
      this.getParams.dispatch_location = val
      this.getParams.page = 1
      this.getTableData()
    },
    clearCreateForm() {
      if (this.$refs.destinationSelect) {
        this.$refs.destinationSelect.value = ''
      }
      if (this.$refs.deliverTypeSelect) {
        this.$refs.deliverTypeSelect.value = ''
      }
      if (this.$refs.materialCodeSelect) {
        this.$refs.materialCodeSelect.value = ''
      }
      this.createForm = {
        dispatch_location: null,
        dispatch_type: null,
        material: null
      }
    },
    showCreateDialog() {
      // this.createForm = {}
      this.clearCreateForm()
      this.createDialogVisible = true
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
    },
    materialCreateForm(val) {
      this.createForm.material = val
    },
    deliverTypeCreateForm(val) {
      this.createForm.dispatch_type = val
    },
    destinationCreateForm(val) {
      this.createForm.dispatch_location = val
    },
    handleCreate() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          postDispatchPlan(this.createForm)
            .then(response => {
              this.createDialogVisible = false
              this.$message('创建成功')
              this.getParams.page = 1
              this.getTableData()
            })
        }
      })
    },
    showEditDialog(row) {
      this.editForm = Object.assign({}, row)
      this.editDialogVisible = true
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
    },
    destinationEditForm(val) {
      this.editForm.dispatch_location = val
    },
    deliverTypeEditForm(val) {
      this.editForm.dispatch_type = val
    },
    handleEdit() {
      this.$refs.Form.validate((valid) => {
        if (valid) {
          putDispatchPlan(this.editForm, this.editForm.id)
            .then(response => {
              this.editDialogVisible = false
              this.$message('修改成功')
              this.getParams.page = 1
              this.getTableData()
            })
        }
      })
    },
    handleClose(row) {
      console.log(row.status)
      var str = row.status === 2 ? '执行中' : '新建'
      this.$confirm('此操作将关闭 ' + str + ' 的发货单单' + row.order_no + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDispatchPlan(row.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getParams.page = 1
            this.getTableData()
          }).catch(function() {

          })
      })
    },
    currentChange(page) {
      this.getParams.page = page
      this.getTableData()
    },
    handleSelectionChange(arr) {
      this.handleSelection = arr
    },
    clearReceiveSelect() {
      this.$refs.multipleTable.clearSelection()
    },
    getRowKeys(row) {
      return row.id
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      var cc = column.property
      if (row[cc] && cc === 'status_name') {
        if (row[cc] === '关闭') {
          return 'color: #888888'
        }
        if (row[cc] === '新建') {
          return 'color: #000093'
        }
        if (row[cc] === '执行中') {
          return 'color: #F5A623'
        }
        if (row[cc] === '完成') {
          return 'color: #7ED321'
        }
        if (row[cc] === '失败') {
          return 'color: #FF0000'
        }
      }
    }
  }
}
</script>

<style>

</style>
