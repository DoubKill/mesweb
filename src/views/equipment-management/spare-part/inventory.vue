<template>
  <div v-loading="loading" class="warehouse-out">
    <!-- 备品备件盘点管理 -->
    <el-form :inline="true">
      <el-form-item label="物料编码:">
        <materialCodeSelect
          :is-all-obj="true"
          @changeSelect="changeMaterialCode"
        />
      </el-form-item>
      <el-form-item label="物料名称:">
        <materialCodeSelect
          :is-all-obj="true"
          label-name="material_name"
          @changeSelect="changeMaterialName"
        />
      </el-form-item>
      <el-form-item label="库存位:">
        <inventoryPosition @changSelect="changeInventoryPosition" />
      </el-form-item>
      <el-form-item>
        <el-button @click="openInfo">操作提示</el-button>
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
        prop="material_no"
        label="物料编码"
      />
      <el-table-column
        prop="material_name"
        label="物料名称"
      />
      <el-table-column
        prop="location_name"
        label="库存位"
      />
      <el-table-column
        prop="qty"
        label="数量（件）"
      />
      <el-table-column
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="edit(scope.row)"
            >更改
            </el-button>
            <el-button
              size="mini"
              type="danger"
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
      title="盘点"
      :visible.sync="dialogVisible"
      width="55%"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="currentRow" :rules="rules" label-width="130px">
        <el-form-item label="物料编码" prop="material">
          <materialCodeSelect
            :created-is="true"
            :is-all-obj="true"
            :default-val="currentRow.material"
            :is-disabled="true"
            @changeSelect="dialogMaterialFun"
          />
        </el-form-item>
        <el-form-item label="物料名称" prop="b">
          <materialCodeSelect
            :created-is="true"
            :is-all-obj="true"
            :default-val="currentRow.material"
            label-name="material_name"
            :is-disabled="true"
            @changeSelect="dialogMaterialFun"
          />
        </el-form-item>
        <el-form-item label="库存位">
          <inventoryPosition
            :created-is="true"
            :default-val="currentRow.location"
            :is-disabled="true"
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
        <el-form-item label="备注">
          <el-input v-model="currentRow.reason" />
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
// import materialCodeSelect from '@/components/materialCodeSelect/index'
import materialCodeSelect from '@/components/select_w/sparePartsMCodeSelect'
// import warehouseSelect from '@/components/select_w/warehouseSelect'
import page from '@/components/page'
import { spareInventory, inventoryUrl } from '@/api/base_w_two'
import allRecord from './all-record.vue'

export default {
  components: { allRecord, page, inventoryPosition, materialCodeSelect },
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
      restaurants: [],
      loading: false,
      rules: {
        material: [
          { required: true, message: '请输入物料编码', trigger: 'change' }
        ],
        b: [
          { required: true, message: '请输入物料名称', trigger: 'change' }
        ],
        qty: [
          { required: true, message: '请输入数量', trigger: 'blur' }
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
      this.search.material_no = obj ? obj.material_no : null
      this.search.page = 1
      this.getList()
    },
    changeMaterialName(obj) {
      this.search.material_name = obj ? obj.material_name : null
      this.search.page = 1
      this.getList()
    },
    edit(row) {
      this.currentRow = JSON.parse(JSON.stringify(row))
      this.currentRow.b = row.material_name

      this.dialogVisible = true
    },
    view(row) {
      this.dialogVisibleResume = true
      this.dialogObj = row
    },
    handleClose(done) {
      this.currentRow = {}
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
      if (done) {
        done()
      }
    },
    submitFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            const obj = {}
            obj.qty = this.currentRow.qty
            obj.reason = this.currentRow.reason
            await inventoryUrl('post', this.currentRow.id, { data: obj })
            this.$message.success('盘点操作成功')
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
      this.$set(this.currentRow, 'b', obj ? obj.material_name : '')
      this.$set(this.currentRow, 'material', obj ? obj.id : '')
    },
    dialogInventoryPosition(obj) {
      this.$set(this.currentRow, 'location', obj ? obj.id : '')
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.bound === '-') {
        return 'warning-row'
      }
      return ''
    },
    openInfo() {
      const h = this.$createElement
      this.$msgbox({
        title: '操作提示',
        message: h('p', null, [
          h('div', null, '1、发现数量不对点击更改修改数量'),
          h('div', null, '2、发现货位和备品备件不一致请先出库再入库'),
          h('div', null, '3、发现备品备件不可用，先出库再给报废编号')
        ])
      }
      )
    }
  }
}
</script>

<style lang="scss">
.warehouse-out{
.el-autocomplete,.el-input,.el-select,.el-input-number{
  width:250px;
}
 .el-pagination .el-select{
    width:auto;
 }
   .warning-row{
    color:red;
  }
  .max-warning-row{
    color:green;
  }
}
</style>
