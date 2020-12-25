<template>
  <div v-loading="loading" class="warehouse-out">
    <!-- 备品备件出库管理 -->
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
      <!-- <el-form-item>
        <el-button @click="edit(null)">新增</el-button>
      </el-form-item> -->
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
        prop="cost"
        label="单价（元）"
      />
      <el-table-column
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
              size="mini"
              @click="edit(scope.row)"
            >出库
            </el-button>
            <el-button
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
      title="出库"
      :visible.sync="dialogVisible"
      width="55%"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="currentRow" :rules="rules" label-width="130px">
        <el-form-item label="出库原因">
          <el-autocomplete
            v-model="currentRow.reason"
            class="inline-input"
            :fetch-suggestions="querySearch"
            placeholder="请输入出库原因"
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div>{{ item.global_name }}</div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="物料编码" prop="spare">
          <materialCodeSelect
            :created-is="true"
            :is-all-obj="true"
            :default-val="currentRow.spare"
            :is-disabled="true"
            label-name="no"
            @changeSelect="dialogMaterialFun"
          />
        </el-form-item>
        <el-form-item label="物料名称" prop="b">
          <materialCodeSelect
            :created-is="true"
            :is-all-obj="true"
            :default-val="currentRow.spare"
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
        <el-form-item label="领用人" prop="receive_user">
          <el-input
            v-model="currentRow.receive_user"
          />
        </el-form-item>
        <el-form-item label="用途" prop="purposeChange">
          <el-select
            v-model="currentRow.purposeChange"
            placeholder="请选择"
            @change="purposeChangeFun"
          >
            <el-option
              v-for="item in ['设备','其它']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="currentRow.purposeChange==='设备'" style="display:inline-block" label="机台" prop="equip_no">
          <equip-select
            :equip_no_props.sync="currentRow.equip_no"
          />
        </el-form-item>
        <el-form-item v-if="currentRow.purposeChange==='设备'" style="display:inline-block" label="部位" prop="positionChange">
          <el-select v-model="currentRow.positionChange" placeholder="请选择">
            <el-option
              v-for="item in positionList"
              :key="item.global_name"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="currentRow.purposeChange==='其它'"
          label="用途（其它）"
          prop="otherUses"
        >
          <el-input
            v-model="currentRow.otherUses"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(null)">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="备品备件出库履历"
      :visible.sync="dialogVisibleResume"
      width="90%"
      :before-close="handleCloseResume"
    >
      <allRecord :is-dialog="true" :show="dialogVisibleResume" :dialog-obj="dialogObj" />
    </el-dialog>
  </div>
</template>

<script>
import inventoryPosition from '@/components/select_w/inventoryPosition'
import materialCodeSelect from '@/components/select_w/sparePartsMCodeSelect'
import materialTypeSelect from '@/components/select_w/sparePartsMTypeSelect'
import page from '@/components/page'
import { spareInventory, outStorage } from '@/api/base_w_two'
import { globalCodesUrl } from '@/api/base_w'
import allRecord from './all-record.vue'
import EquipSelect from '@/components/select_w/equip'

export default {
  components: { materialTypeSelect, EquipSelect, allRecord, page, inventoryPosition, materialCodeSelect },
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
      restaurants: [],
      positionList: [],
      loading: false,
      rules: {
        spare: [
          { required: true, message: '请输入物料编码', trigger: 'change' }
        ],
        b: [
          { required: true, message: '请输入物料名称', trigger: 'change' }
        ],
        purposeChange: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        positionChange: [
          { required: true, message: '请选择部位', trigger: 'change' }
        ],
        equip_no: [
          { required: true, message: '请选择机台', trigger: 'change' }
        ],
        qty: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        otherUses: [
          { required: true, message: '请输入其他用途', trigger: 'blur' }
        ],
        receive_user: [
          { required: true, message: '请输入领用人', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getListReason()
    this.getListPosition()
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
    async getListReason() {
      try {
        const data = await globalCodesUrl('get', { params: { class_name: '出库原因', all: 1 }})
        this.restaurants = data.results
      } catch (e) {
        //
      }
    },
    async getListPosition() {
      try {
        const data = await globalCodesUrl('get', { params: { class_name: '部位', all: 1 }})
        this.positionList = data.results
      } catch (e) {
        //
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.global_name.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
      }
    },
    handleSelect(val) {
      this.currentRow.reason = val.global_name
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
    changeMaterialName(obj) {
      this.search.spare_name = obj ? obj.name : null
      this.search.page = 1
      this.getList()
    },
    changeMaterialType(obj) {
      this.search.type_name = obj ? obj.name : null
      this.search.page = 1
      this.getList()
    },
    edit(row) {
      this.currentRow = JSON.parse(JSON.stringify(row))
      this.currentRow.b = row.spare_name
      this.currentRow.qty = 1
      this.$set(this.currentRow, 'purposeChange', '设备')

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
    handleCloseResume(done) {
      this.getList()
      done()
    },
    submitFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            const obj = {}
            if (this.currentRow.purposeChange === '设备') {
              obj.purpose = this.currentRow.equip_no + '+' + this.currentRow.positionChange
            } else {
              obj.purpose = this.currentRow.otherUses
            }
            obj.qty = this.currentRow.qty
            obj.receive_user = this.currentRow.receive_user
            obj.reason = this.currentRow.reason
            await outStorage('post', this.currentRow.id, { data: obj })
            this.$message.success('出库成功')
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
      this.$set(this.currentRow, 'b', obj ? obj.name : '')
      this.$set(this.currentRow, 'spare', obj ? obj.id : '')
    },
    dialogInventoryPosition(obj) {
      this.$set(this.currentRow, 'location', obj ? obj.id : '')
    },
    currentChange(page, pageSize) {
      this.search.page = page
      this.search.page_size = pageSize
      this.getList()
    },
    purposeChangeFun() {
      this.$refs.ruleForm.clearValidate()
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
    color:#e6a23c;
  }
}
</style>
