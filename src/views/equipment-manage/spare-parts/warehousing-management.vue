<template>
  <div>
    <!-- 入库管理 -->
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
            v-for="item in [{label:'未入库',value:1},{label:'入库中',value:2},{label:'已入库',value:3}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-permission="['equip_in_warehouse', 'add']"
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
            v-permission="['equip_in_warehouse', 'enter']"
            type="primary"
            size="mini"
            @click="dialog(scope.row)"
          >入库
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
            >确定入库
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
          prop="order_quantity"
          label="总数量"
          min-width="20"
        />
        <el-table-column
          prop="in_quantity"
          label="已入库数量"
          min-width="20"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="inQuantityDialog(scope.row)"
            >{{ scope.row.in_quantity }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="unit"
          label="标准单位"
          min-width="20"
        />
        <el-table-column
          prop="created_username"
          label="入库人"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
          label="入库时间"
          width="160"
        />
        <el-table-column
          prop="status_name"
          label="状态"
          min-width="20"
        />
        <el-table-column
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="print(scope.row)"
            >打印标签
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible=false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="备件人工入库"
      :visible.sync="dialogVisible1"
      :before-close="handleClose"
      width="30%"
    >
      <el-form ref="creatOrder" :inline="true" label-width="150px" :rules="rules1" :model="creatOrder">
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
        <el-form-item label="库区" prop="equip_warehouse_area">
          <el-select
            v-model="creatOrder.equip_warehouse_area"
            placeholder="请选择"
            clearable
            @change="clear"
          >
            <el-option
              v-for="item in warehouseAreaList"
              :key="item.id"
              :label="item.area_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="库位" prop="equip_warehouse_location">
          <el-select
            v-model="creatOrder.equip_warehouse_location"
            placeholder="请选择"
            clearable
            @visible-change="getWarehouseLocation"
          >
            <el-option
              v-for="item in warehouseLocationList"
              :key="item.id"
              :label="item.location_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input
            v-model="creatOrder.in_quantity"
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
      :title="`新建入库单据`"
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
          >
            <el-option
              v-for="item in ['设备部']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入库物料详情列表" prop="equip_spare">
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
              prop="quantity"
              label="数量"
              width="140px"
            >
              <template slot-scope="{row}">
                <el-input-number
                  v-model="row.quantity"
                  size="small"
                  :min="1"
                  :max="999"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="one_piece"
              label="单件个数"
              width="140px"
            >
              <template slot-scope="{row}">
                <el-input-number
                  v-model="row.one_piece"
                  size="small"
                  :min="1"
                  :max="99999"
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
      :title="`备品备件库 入库物料选择`"
      :visible.sync="dialogVisibleAdd1"
      width="80%"
      :before-close="handleCloseAdd1"
    >
      <material
        ref="List"
        :show="dialogVisibleAdd1"
        type="入库"
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
      :title="`备件条码打印`"
      :visible.sync="dialogVisiblePrint"
      width="30%"
    >
      <el-form
        label-width="150px"
        :model="printForm"
      >
        <el-form-item
          label="备件编号"
          prop="spare_name"
        >
          <el-input v-model="printForm.spare_code" disabled style="width:200px" />
        </el-form-item>
        <el-form-item
          label="备件名称"
          prop="spare_name"
        >
          <el-input v-model="printForm.spare_name" disabled style="width:200px" />
        </el-form-item>
        <el-form-item label="备件条码列表">
          <el-table
            :data="printForm.spare_codeList"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              label="选择"
              type="selection"
            />
            <el-table-column
              prop="spare_code"
              label="备件条码"
            />
            <el-table-column
              prop="one_piece"
              label="单件个数"
            />
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblePrint=false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFunPrint">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`入库单据明细`"
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
        <el-form-item label="入库物料详情列表">
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
  </div>
</template>

<script>
import material from '../components/material-dialog'
import { getOrderId, equipWarehouseOrder, equipWarehouseOrderDetail, getCode, equipWarehouseArea, equipWarehouseLocation, equipWarehouseRecord, equipCodePrint } from '@/api/jqy'
import page from '@/components/page'
import { debounce } from '@/utils'
export default {
  name: 'WarehousingManagement',
  components: { page, material },
  data() {
    return {
      search: { order: 'in' },
      search1: {},
      btnLoad: false,
      btnLoading: false,
      dialogForm: { submission_department: '', equip_spare: [] },
      printForm: {},
      dateValue: [],
      SpareForm: {},
      dialogVisibleSpare: false,
      tableData: [],
      quantityForm: {},
      tableDataView: [],
      warehouseAreaList: [],
      warehouseLocationList: [],
      total: 0,
      status: null,
      selectionList: [],
      checkList: [],
      loading: false,
      loadingView: false,
      dialogVisibleAdd: false,
      dialogVisiblePrint: false,
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
      rules1: {
        equip_warehouse_area: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        equip_warehouse_location: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      creatOrder: { one_piece: '', equip_warehouse_area: '',
        equip_warehouse_location: '' }
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
    async submitFunPrint() {
      try {
        this.btnLoading = true
        await equipCodePrint('post', null, { data: { status: 2, spare_list: this.selectionList }})
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
      }
    },
    handleSelectionChange(val) {
      this.selectionList = val
    },
    changeDate(date) {
      this.search.s_time = date ? date[0] : ''
      this.search.e_time = date ? date[1] : ''
      this.changeSearch1()
    },
    async onSubmit() {
      try {
        const orderId = await getOrderId('get', null, { params: { status: '入库' }})
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
    clear() {
      if (this.creatOrder.equip_warehouse_location) {
        this.creatOrder.equip_warehouse_location = null
      }
    },
    async getWarehouseLocation(val) {
      if (val) {
        if (this.creatOrder.equip_warehouse_area) {
          try {
            const data = await equipWarehouseLocation('get', null, { params: { equip_warehouse_area_id: this.creatOrder.equip_warehouse_area }})
            this.warehouseLocationList = data.results
          } catch (e) {
            this.warehouseLocationList = []
          }
        } else {
          this.$message.info('请先选择库位')
          this.warehouseLocationList = []
        }
      }
    },
    async inQuantityDialog(row) {
      if (row.in_quantity > 0) {
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
      this.status = row._status
      try {
        const data = await equipWarehouseOrderDetail('get', null, { params: this.search1 })
        this.tableDataView = data || []
      } catch (e) {
        // this.loading = false
      }
      this.dialogVisible = true
    },
    async print(row) {
      this.order = row.id
      try {
        const data = await getCode('get', null, { params: { order: this.order, all: 1 }})
        this.printForm.spare_code = data.spare_code
        this.printForm.spare_name = data.spare_name
        this.printForm.spare_codeList = data.results
      } catch (e) {
        // this.loading = false
      }
      this.dialogVisiblePrint = true
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
      if (row.order_quantity === row.in_quantity) {
        this.$message('已经全部入库')
      } else {
        this.order = row.id
        try {
          const data = await getCode('get', null, { params: { order: this.order }})
          this.creatOrder.spare_code = data.spare_code
          this.creatOrder.one_piece = data.one_piece
        } catch (e) {
        // this.loading = false
        }
        this.creatOrder.spare_name = row.spare_name
        var date = new Date()
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        var d = date.getDate()
        if (m < 10) {
          m = '0' + m
        }
        if (d < 10) {
          d = '0' + d
        }
        this.creatOrder.lot_no = 'LOT' + y + m + d
        this.creatOrder.in_quantity = 1
        this.creatOrder.order_id = row.order_id
        this.creatOrder.unit = row.unit
        this.creatOrder.status = 1
        this.dialogVisible1 = true
        this.creatOrder.equip_spare = row.equip_spare
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
      this.dialogVisibleAdd = false
      this.$refs.createForm.resetFields()
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
      this.dialogForm.status = 1
      this.dialogForm.equip_spare.forEach(d => {
        if (d.quantity === undefined) {
          d.quantity = 1
        }
      })
      this.dialogForm.equip_spare.forEach(d => {
        if (d.one_piece === undefined) {
          d.one_piece = 1
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
          if (data.indexOf(this.$refs['List'].multipleSelection[index].id) === -1) {
            this.dialogForm.equip_spare.push({
              spare_code: this.$refs['List'].multipleSelection[index].spare__code,
              id: this.$refs['List'].multipleSelection[index].id,
              spare_name: this.$refs['List'].multipleSelection[index].spare_name,
              specification: this.$refs['List'].multipleSelection[index].specification,
              quantity: 1,
              one_piece: 1
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
