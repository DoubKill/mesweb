<template>
  <div>
    <!-- 出库管理 -->
    <el-form :inline="true">
      <el-form-item label="单据条码">
        <el-input
          v-model="search.order_id"
          style="width:200px"
          clearable
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="提交人">
        <el-input
          v-model="search.created_user"
          style="width:200px"
          clearable
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="提交起止时间">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="search.status"
          placeholder="请选择"
          clearable
          @change="changeSearch1"
        >
          <el-option
            v-for="item in [{label:'未出库',value:4},{label:'出库中',value:5},{label:'已出库',value:6}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-permission="['equip_job_standard', 'add']"
          type="primary"
          @click="onSubmit"
        >新建</el-button>
      </el-form-item></el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
    >
      <el-table-column
        label="操作"
        width="80"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="dialog(scope.row)"
          >出库
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_id"
        label="单据条码"
        min-width="20"
      />
      <el-table-column
        prop="submission_department"
        label="提交部门"
        min-width="20"
      />
      <el-table-column
        prop="created_username"
        label="提交人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="提交时间"
        min-width="20"
      />
      <el-table-column
        prop="_status"
        label="状态"
        min-width="20"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      width="80%"
    >
      <el-form :inline="true">
        <el-form-item label="单据条码">
          <el-input v-model="search1.order_id" disabled />
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="status" disabled />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loadingView"
        :data="tableDataView"
        border
      >
        <el-table-column
          label="操作"
          width="90"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="dialog1(scope.row)"
            >确定出库
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="spare__code"
          label="备件代码"
          min-width="20"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="spareDialog(scope.row)"
            >{{ scope.row.spare__code }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="spare_name"
          label="备件名称"
          min-width="20"
        />
        <el-table-column
          prop="component_type_name"
          label="备件分类"
          min-width="20"
        />
        <el-table-column
          prop="specification"
          label="规格型号"
          min-width="20"
        />
        <el-table-column
          prop="technical_params"
          label="技术参数"
          min-width="20"
        />
        <el-table-column
          prop="all_qty"
          label="库存总数量"
          min-width="20"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="inQuantityDialog(scope.row)"
            >{{ scope.row.all_qty }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="plan_out_quantity"
          label="计划出库数量"
          min-width="20"
        />
        <el-table-column
          prop="out_quantity"
          label="已出库数量"
          min-width="20"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="inQuantityDialog(scope.row)"
            >{{ scope.row.out_quantity }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="unit"
          label="标准单位"
          min-width="20"
        />
        <el-table-column
          prop="created_username"
          label="出库人"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
          label="出库时间"
          width="160"
        />
        <el-table-column
          prop="status_name"
          label="状态"
          min-width="20"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="备件人工出库"
      :visible.sync="dialogVisible1"
      width="30%"
    >
      <el-form ref="creatOrder" :inline="true" label-width="150px" :model="creatOrder">
        <el-form-item label="备件名称">
          <el-input
            v-model="creatOrder.spare_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="备件条码">
          <el-input
            v-model="creatOrder.spare_code"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="批号">
          <el-input
            v-model="creatOrder.lot_no"
            disabled
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="库区" prop="equip_warehouse_area__area_name">
          <el-input
            v-model="creatOrder.equip_warehouse_area__area_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="库位" prop="equip_warehouse_location__location_name">
          <el-input
            v-model="creatOrder.equip_warehouse_location__location_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="数量">
          <el-input
            v-model="creatOrder.out_quantity"
            disabled
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="单位" style="" prop="checkList">
          <el-input
            v-model="creatOrder.unit"
            disabled
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="单件个数">
          <el-input-number
            v-model="creatOrder.one_piece"
            disabled
            :max="creatOrder.one_piece1"
            :min="1"
            style="width:250px"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`新建出库单据`"
      :visible.sync="dialogVisibleAdd"
      width="50%"
      :before-close="handleCloseAdd"
    >
      <el-form
        ref="createForm"
        :rules="rules"
        label-width="150px"
        :model="dialogForm"
      >
        <el-form-item
          label="单据条码"
          prop="order_id"
        >
          <el-input v-model="dialogForm.order_id" disabled style="width:300px" />
        </el-form-item>
        <el-form-item label="提交部门" prop="submission_department">
          <el-select
            v-model="dialogForm.submission_department"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in ['设备部']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工单编号" prop="work_order_no">
          <el-input v-model="dialogForm.work_order_no" disabled style="width:300px">
            <el-button slot="append" icon="el-icon-search" @click="Add1" />
          </el-input>
        </el-form-item>
        <el-form-item label="出库物料详情列表" prop="equip_spare">
          <el-button type="primary" @click="Add">添加</el-button>
          <el-table
            :data="dialogForm.equip_spare"
            border
            style="width: 100%"
          >
            <el-table-column
              label="次序"
              type="index"
            />
            <el-table-column
              prop="spare_code"
              label="备件编号"
            />
            <el-table-column
              prop="spare_name"
              label="备件名称"
            />
            <el-table-column
              prop="specification"
              label="规格"
            />
            <el-table-column
              prop="all_qty"
              label="库存数量"
            />
            <el-table-column
              prop="quantity"
              label="数量"
              width="140px"
            >
              <template slot-scope="{row}">
                <el-input-number
                  v-model="row.quantity"
                  size="small"
                  :min="1"
                  :max="row.all_qty"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseAdd(false)">取 消</el-button>
        <el-button type="primary" :loading="btnLoad" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`备品备件库 出库物料选择`"
      :visible.sync="dialogVisibleAdd1"
      width="80%"
      :before-close="handleCloseAdd1"
    >
      <material
        ref="List"
        :show="dialogVisibleAdd1"
        type="出库"
        :list="dialogForm.equip_spare"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseAdd1(false)">取 消</el-button>
        <el-button type="primary" @click="submitFun1">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`备件详情`"
      :visible.sync="dialogVisibleSpare"
      width="50%"
    >
      <el-form
        label-width="100px"
        :model="SpareForm"
      >
        <el-form-item label="备件代码">
          <el-input v-model="SpareForm.spare__code" disabled style="width:300px" />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="SpareForm.spare_name" disabled style="width:300px" />
        </el-form-item>
        <el-form-item label="备件分类">
          <el-input v-model="SpareForm.component_type_name" disabled style="width:300px" />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="SpareForm.specification" disabled style="width:300px" />
        </el-form-item>
        <el-form-item label="技术参数">
          <el-input v-model="SpareForm.technical_params" disabled style="width:300px" />
        </el-form-item>
        <el-form-item label="标准单位">
          <el-input v-model="SpareForm.unit" disabled style="width:300px" />
        </el-form-item>
        <el-form-item label="关键部件">
          <el-input v-model="SpareForm.key_parts_flag" disabled style="width:300px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleSpare=false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`出库单据明细`"
      :visible.sync="dialogVisibleQuantity"
      width="50%"
    >
      <el-form
        label-width="150px"
        :model="quantityForm"
      >
        <el-form-item label="单据条码">
          <el-input v-model="quantityForm.order_id" disabled style="width:300px" />
        </el-form-item>
        <el-form-item label="提交部门">
          <el-input v-model="quantityForm.submission_department" disabled style="width:300px" />
        </el-form-item>
        <el-form-item label="备件编号">
          <el-input v-model="quantityForm.spare_code" disabled style="width:300px" />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="quantityForm.spare_name" disabled style="width:300px" />
        </el-form-item>
        <el-form-item label="出库物料详情列表">
          <el-table
            :data="quantityForm.spare_codeList"
            border
            style="width: 100%"
          >
            <el-table-column
              label="次序"
              type="index"
            />
            <el-table-column
              prop="spare_code"
              label="备件条码"
            />
            <el-table-column
              prop="area_name"
              label="库区"
            />
            <el-table-column
              prop="location_name"
              label="库位"
            />
            <el-table-column
              prop="quantity"
              label="数量"
            />
            <el-table-column
              prop="status"
              label="状态"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status===1">已入库</span>
                <span v-if="scope.row.status===2">已出库</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleQuantity=false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="`工单编号选择`"
      :visible.sync="dialogVisibleWork"
      width="80%"
    >
      <el-table
        ref="singleTable"
        highlight-current-row
        row-key="id"
        :reserve-selection="true"
        :data="tableDataWork"
        border
        style="width: 100%"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          prop="work_order_no"
          label="工单编号"
        />
        <el-table-column
          prop="plan_name"
          label="报修名称"
        />
        <el-table-column
          prop="created_date"
          label="报修时间"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleWork=false">取 消</el-button>
        <el-button type="primary" @click="submitFunwork">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import material from '../components/material-dialog'
import { getOrderId, equipWarehouseOrder, equipWarehouseOrderDetail, getCode, equipWarehouseArea, equipWarehouseRecord } from '@/api/jqy'
import page from '@/components/page'
import { debounce } from '@/utils'
export default {
  name: 'OutboundingManagement',
  components: { page, material },
  data() {
    return {
      search: { order: 'out' },
      search1: {},
      btnLoad: false,
      dialogForm: { submission_department: '', equip_spare: [] },
      dateValue: [],
      SpareForm: {},
      dialogVisibleSpare: false,
      dialogVisibleWork: false,
      tableData: [],
      quantityForm: {},
      tableDataView: [],
      warehouseAreaList: [],
      warehouseLocationList: [],
      tableDataWork: [],
      total: 0,
      status: null,
      selectionList: [],
      checkList: [],
      work_order_noList: {},
      loading: false,
      loadingView: false,
      dialogVisibleAdd: false,
      dialogVisibleAdd1: false,
      dialogVisibleQuantity: false,
      dialogVisible: false,
      dialogVisible1: false,
      submit: false,
      rules: {
        submission_department: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        equip_spare: [
          { type: 'array', required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      creatOrder: { one_piece: '' }
    }
  },
  created() {
    this.getList()
    this.getWarehouseArea()
  },
  methods: {
    generateFun() {
      this.$refs.creatOrder.validate(async(valid) => {
        if (valid) {
          try {
            await equipWarehouseOrderDetail('post', null, { data: this.creatOrder })
            this.$message.success('操作成功')
            const data = await equipWarehouseOrderDetail('get', null, { params: this.search1 })
            this.tableDataView = data || []
            this.handleClose(null)
            this.getList()
            this.dialogVisible1 = false
          } catch (e) {
            this.dialogVisible1 = true
          }
        } else {
          return false
        }
      })
    },
    Add() {
      this.dialogVisibleAdd1 = true
    },
    handleCurrentChange(val) {
      this.work_order_noList = val
    },
    submitFunwork() {
      this.dialogForm.work_order_no = this.work_order_noList.work_order_no
      this.dialogVisibleWork = false
    },
    async Add1() {
      try {
        const data = await equipWarehouseOrder('get', null, { params: { work_order_no: 1 }})
        this.tableDataWork = data || []
        this.dialogVisibleWork = true
      } catch {
        this.dialogVisibleWork = false
      }
    },
    changeDate(date) {
      this.search.s_time = date ? date[0] : ''
      this.search.e_time = date ? date[1] : ''
      this.changeSearch1()
    },
    async onSubmit() {
      try {
        const orderId = await getOrderId('get', null, { params: { status: '出库' }})
        this.dialogForm.order_id = orderId
        this.dialogForm.equip_spare = []
        this.dialogForm.submission_department = '设备部'
        this.dialogVisibleAdd = true
      } catch {
        this.dialogVisibleAdd = false
      }
    },
    async getWarehouseArea() {
      try {
        const data = await equipWarehouseArea('get', null, { params: {}})
        this.warehouseAreaList = data.results
      } catch (e) {
        // this.loading = false
      }
    },
    async inQuantityDialog(row) {
      if (row.out_quantity > 0) {
        try {
          const data = await equipWarehouseRecord('get', null, { params: { equip_warehouse_order_detail: row.id, all: 1 }})
          this.quantityForm.order_id = data.data.order_id
          this.quantityForm.spare_name = data.data.spare_name
          this.quantityForm.submission_department = data.data.submission_department
          this.quantityForm.spare_code = data.data.spare_code
          this.quantityForm.spare_codeList = data.results
          this.dialogVisibleQuantity = true
        } catch {
          // this.dialogVisibleAdd = false
        }
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await equipWarehouseOrder('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeSearch() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeSearch1() {
      this.search.page = 1
      this.getList()
    },
    async dialog(row) {
      this.search1.order_id = row.order_id
      this.search1.stage = 1
      this.status = row._status
      try {
        const data = await equipWarehouseOrderDetail('get', null, { params: this.search1 })
        this.tableDataView = data || []
      } catch (e) {
        // this.loading = false
      }
      this.dialogVisible = true
    },
    spareDialog(row) {
      this.dialogVisibleSpare = true
      this.SpareForm = JSON.parse(JSON.stringify(row))
      if (this.SpareForm.key_parts_flag === false) {
        this.SpareForm.key_parts_flag = '否'
      } else if (this.SpareForm.key_parts_flag === true) {
        this.SpareForm.key_parts_flag = '是'
      }
    },
    async dialog1(row) {
      if (row.plan_out_quantity === row.out_quantity) {
        this.$message('已经全部出库')
      } else {
        this.order = row.equip_spare
        try {
          const data = await getCode('get', null, { params: { order: this.order, stage: 1 }})
          this.creatOrder.spare_code = data.spare_code
          this.creatOrder.equip_warehouse_area = data.equip_warehouse_area
          this.creatOrder.equip_warehouse_location = data.equip_warehouse_location
          this.creatOrder.equip_warehouse_area__area_name = data.equip_warehouse_area__area_name
          this.creatOrder.equip_warehouse_location__location_name = data.equip_warehouse_location__location_name
          this.creatOrder.one_piece = data.one_piece
          this.creatOrder.one_piece1 = data.one_piece
          this.creatOrder.lot_no = data.equip_warehouse_order_detail__lot_no
        } catch (e) {
        // this.loading = false
        }
        this.creatOrder.spare_name = row.spare_name
        this.creatOrder.out_quantity = 1
        this.creatOrder.order_id = row.order_id
        this.creatOrder.status = 2
        this.creatOrder.unit = row.unit
        this.creatOrder.equip_spare = row.equip_spare
        this.dialogVisible1 = true
      }
    },
    handleDelete(row) {
      this.dialogForm.equip_spare.forEach((item, index) => {
        if (row.id === item.id) {
          this.dialogForm.equip_spare.splice(index, 1)
        }
      })
    },
    handleClose(done) {
      this.$refs.creatOrder.resetFields()
      this.dialogVisible1 = false
      if (done) {
        done()
      }
    },
    handleCloseAdd(done) {
      this.$refs.createForm.resetFields()
      this.dialogVisibleAdd = false
      if (done) {
        done()
      }
    },
    handleCloseAdd1(done) {
      this.$refs['List'].$refs.multipleTable.clearSelection()
      this.dialogVisibleAdd1 = false
      if (done) {
        done()
      }
    },
    submitFun() {
      this.dialogForm.status = 4
      this.dialogForm.equip_spare.forEach(d => {
        if (d.quantity === undefined) {
          d.quantity = 1
        }
      })
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoad = true
            await equipWarehouseOrder('post', null, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.handleCloseAdd(null)
            this.getList()
            this.btnLoad = false
            this.dialogVisibleAdd = false
          } catch (e) {
            this.btnLoad = false
            this.dialogVisibleAdd = true
          }
        } else {
          return false
        }
      })
    },
    submitFun1() {
      this.$refs.createForm.clearValidate()
      let data = []
      for (const i in this.dialogForm.equip_spare) {
        data = data.concat(this.dialogForm.equip_spare[i].id)
      }
      if (this.$refs['List'].multipleSelection.length > 0) {
        for (let index = 0; index < this.$refs['List'].multipleSelection.length; index++) {
          if (data.indexOf(this.$refs['List'].multipleSelection[index].equip_spare) === -1) {
            this.dialogForm.equip_spare.push({
              spare_code: this.$refs['List'].multipleSelection[index].spare__code,
              id: this.$refs['List'].multipleSelection[index].equip_spare,
              spare_name: this.$refs['List'].multipleSelection[index].spare_name,
              specification: this.$refs['List'].multipleSelection[index].specification,
              all_qty: this.$refs['List'].multipleSelection[index].qty,
              quantity: 1
            })
          }
        }
        this.$refs['List'].$refs.multipleTable.clearSelection()
        this.dialogVisibleAdd1 = false
      } else {
        this.$message.info('请选择一种物料')
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    }
  }
}
</script>

<style>

</style>
