<template>
  <div v-loading="loading" class="warehousing">
    <!-- 备品备件入库管理 -->
    <el-form :inline="true">
      <el-form-item label="物料类型:">
        <materialTypeSelect
          @changeSelect="changeMaterialType"
        />
      </el-form-item>
      <el-form-item label="物料编码:">
        <materialCodeSelect
          :is-all-obj="true"
          label-name="no"
          @changeSelect="changeMaterialCode"
        />
      </el-form-item>
      <el-form-item label="物料名称:">
        <materialCodeSelect
          :is-all-obj="true"
          @changeSelect="changeMaterialName"
        />
      </el-form-item>
      <el-form-item label="库存位:">
        <inventoryPosition @changSelect="changeInventoryPosition" />
      </el-form-item>
      <el-form-item v-permission="['spare_inbound','add']">
        <el-button @click="edit(null)">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        type="index"
        width="50"
        label="No"
      />
      <el-table-column
        prop="type_name"
        label="物料类型"
      />
      <el-table-column
        prop="spare_no"
        label="物料编码"
      />
      <el-table-column
        prop="spare_name"
        label="物料名称"
      />
      <el-table-column
        prop="location_name"
        label="库存位"
      />
      <el-table-column
        prop="qty"
        label="数量"
      />
      <el-table-column
        prop="unit"
        label="单位"
      />
      <el-table-column
        v-if="checkPermission(['spare_inbound','price'])"
        prop="cost"
        label="单价（元）"
      />
      <el-table-column
        v-if="checkPermission(['spare_inbound','price'])"
        prop="total_count"
        label="总价（元）"
      />
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-permission="['spare_inbound','inbound']"
              size="mini"
              @click="edit(scope.row)"
            >入库
            </el-button>
            <el-button
              v-permission="['spare_inbound','history']"
              size="mini"
              type="blue"
              @click="view(scope.row)"
            >查看履历
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :title="currentRow.id?'入库':'新增'"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="currentRow" :rules="rules" label-width="100px">
        <el-form-item v-if="!currentRow.id" label="仓库">
          <warehouseSelect
            :created-is="true"
            :is-clear="true"
            @changSelect="changWarehouse"
          />
        </el-form-item>
        <el-form-item label="物料编码" prop="spare">
          <materialCodeSelect
            :created-is="true"
            :is-all-obj="true"
            :default-val="currentRow.spare"
            :is-disabled="currentRow.id?true:false"
            label-name="no"
            @changeSelect="dialogMaterialFun"
          />
        </el-form-item>
        <el-form-item label="物料名称" prop="b">
          <materialCodeSelect
            :created-is="true"
            :is-all-obj="true"
            :default-val="currentRow.spare"
            :is-disabled="currentRow.id?true:false"
            @changeSelect="dialogMaterialFun"
          />
        </el-form-item>
        <el-form-item label="库存位">
          <inventoryPosition
            ref="inventoryPosition"
            :created-is="true"
            :default-val="currentRow.location"
            :is-disabled="currentRow.id?true:false"
            :is-binding="true"
            :material-no="currentRow.materialNo"
            :material-name="currentRow.b"
            @changSelect="dialogInventoryPosition"
          />
        </el-form-item>
        <el-form-item label="数量" prop="qty">
          <el-input-number
            v-model="currentRow.qty"
            controls-position="right"
            :min="1"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(null)">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="备品备件入库履历"
      :visible.sync="dialogVisibleResume"
      width="90%"
    >
      <allRecord :is-dialog="true" :show="dialogVisibleResume" :dialog-obj="dialogObj" />
    </el-dialog>
  </div>
</template>

<script>
import inventoryPosition from '@/components/select_w/inventoryPosition'
import materialCodeSelect from '@/components/select_w/sparePartsMCodeSelect'
import materialTypeSelect from '@/components/select_w/sparePartsMTypeSelect'
import warehouseSelect from '@/components/select_w/warehouseSelect'
import page from '@/components/page'
import { spareInventory, putStorage } from '@/api/base_w_two'
import allRecord from './all-record.vue'
import { checkPermission } from '@/utils'

export default {
  components: { materialTypeSelect, allRecord, page, inventoryPosition, materialCodeSelect, warehouseSelect },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      tableData: [],
      dialogVisible: false,
      dialogVisibleResume: false,
      currentRow: {},
      dialogObj: {},
      total: 0,
      warehouse_info: '',
      loading: false,
      rules: {
        spare: [
          { required: true, message: '请输入物料编码', trigger: 'change' }
        ],
        b: [
          { required: true, message: '请输入物料名称', trigger: 'change' }
        ],
        qty: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()

    const _this = this
    document.onkeydown = function(ev) {
      // 监听enter键
      var event = ev || event
      if (_this.dialogVisible === true) {
        if (event.keyCode === 13) {
          _this.submitFun()
        }
      }
    }
  },
  methods: {
    checkPermission,
    async getList() {
      try {
        this.loading = true
        const data = await spareInventory('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
      } catch (e) {
        //
      }
      this.loading = false
    },
    changeInventoryPosition(obj) {
      this.search.location_name = obj ? obj.name : null
      this.search.page = 1
      this.getList()
    },
    changeMaterialCode(obj) {
      this.search.spare_no = obj ? obj.no : null
      this.search.page = 1
      this.getList()
    },
    changeMaterialType(obj) {
      this.search.type_name = obj ? obj.name : null
      this.search.page = 1
      this.getList()
    },
    changeMaterialName(obj) {
      this.search.spare_name = obj ? obj.name : null
      this.search.page = 1
      this.getList()
    },
    edit(row) {
      if (row) {
        this.currentRow = JSON.parse(JSON.stringify(row))
        this.currentRow.b = row.spare_name
        this.currentRow.qty = 1
      } else {
        this.currentRow = {}
        this.currentRow.warehouse_info = this.warehouse_info
        this.currentRow.location = null
      }
      this.dialogVisible = true
    },
    view(row) {
      this.dialogVisibleResume = true
      this.dialogObj = row
    },
    handleClose(done) {
      setTimeout(() => {
        this.currentRow = {}
        this.$refs.ruleForm.resetFields()
      }, 300)
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            if (!this.currentRow.id) {
              await spareInventory('post', null, { data: this.currentRow })
              this.$message.success('添加成功')
            } else {
              await putStorage('post', this.currentRow.id, { data: { qty: this.currentRow.qty }})
              this.$message.success('入库成功')
            }
            this.handleClose(null)
            this.getList()
          } catch (e) {
            //
          }
        } else {
          return false
        }
      })
    },
    dialogMaterialFun(obj) {
      this.$set(this.currentRow, 'b', obj ? obj.name : null)
      this.$set(this.currentRow, 'spare', obj ? obj.id : null)
      this.$set(this.currentRow, 'materialNo', obj ? obj.no : null)
      this.$refs.inventoryPosition.value = null
      this.currentRow.location = null
    },
    changWarehouse(obj) {
      this.warehouse_info = obj.id || null
      this.$set(this.currentRow, 'warehouse_info', obj ? obj.id : null)
    },
    dialogInventoryPosition(obj) {
      this.$set(this.currentRow, 'location', obj ? obj.location : '')
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.bound === '-') {
        return 'warning-row'
      } else if (row.bound === '+') {
        return 'max-warning-row'
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
.warehousing{
  .warning-row{
    color:red;
  }
  .max-warning-row{
    color:#e6a23c;
  }
}

</style>
