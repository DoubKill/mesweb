<template>
  <div>
    <!-- 备件入库管理 -->
    <el-form :inline="true">
      <el-form-item label="入库单据号">
        <el-input
          v-model="search.order_id"
          style="width:150px"
          clearable
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="领料单号">
        <el-input
          v-model="search.barcode"
          style="width:150px"
          clearable
          @input="changeSearch"
        />
      </el-form-item>
      <el-form-item label="领料人">
        <el-input
          v-model="search.created_user"
          style="width:150px"
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
          style="width:150px"
          placeholder="请选择"
          clearable
          @change="changeSearch1"
        >
          <el-option
            v-for="item in [{label:'未入库',value:1},{label:'入库中',value:2},{label:'已入库',value:3},{label:'关闭',value:7}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input
          v-model="search.spare_code"
          style="width:150px"
          clearable
          @input="lengthSearch"
        />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input
          v-model="search.spare_name"
          style="width:150px"
          clearable
          @input="lengthSearch1"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-permission="['equip_in_warehouse', 'add']"
          type="primary"
          @click="onSubmit"
        >新建</el-button>
        <el-button
          v-permission="['equip_in_warehouse', 'add']"
          type="primary"
          :loading="btnLoad"
          @click="onSubmit1"
        >获取ERP领料单</el-button>
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
            v-if="scope.row.status_name!=='关闭'"
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
        label="入库单据号"
        min-width="20"
      />
      <el-table-column
        prop="barcode"
        label="领料单号"
        min-width="20"
      />
      <el-table-column
        prop="submission_department"
        label="提交部门"
        min-width="20"
      />
      <el-table-column
        prop="add_username"
        label="领料人"
        min-width="20"
      />
      <el-table-column
        prop="lluser"
        label="审核人"
        min-width="20"
      />
      <el-table-column
        prop="created_date"
        label="提交时间"
        min-width="20"
      />
      <el-table-column
        prop="status_name"
        label="状态"
        min-width="20"
      />
      <el-table-column
        prop="desc"
        label="备注"
        min-width="20"
      />
      <el-table-column
        label="操作"
        width="220"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['equip_in_warehouse', 'change']"
            type="primary"
            size="mini"
            @click="editOrder(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-permission="['equip_in_warehouse', 'delete']"
            type="danger"
            size="mini"
            @click="deleteOrder(scope.row)"
          >删除
          </el-button>
          <el-button
            v-if="scope.row.status_name!=='关闭'"
            v-permission="['equip_in_warehouse', 'delete']"
            size="mini"
            @click="closeOrder(scope.row)"
          >关闭
          </el-button>
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
      title="确认入库"
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
        <el-form-item label="备件代码">
          <el-input v-model="search1.spare_code" clearable />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="search1.spare_name" clearable />
        </el-form-item>
        <el-button
          type="primary"
          @click="searchDialog"
        >查询
        </el-button>
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
          prop="unique_id"
          label="ERP物料信息id"
          min-width="20"
        />
        <el-table-column
          prop="spare_code"
          label="备件代码"
          min-width="20"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="spareDialog(scope.row)"
            >{{ scope.row.spare_code }}</el-link>
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
          label="用途"
          min-width="20"
        />
        <el-table-column
          prop="plan_in_quantity"
          label="总数量"
          min-width="20"
        />
        <el-table-column
          prop="in_quantity"
          label="已入库数量"
          min-width="20"
        />
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
          prop="enter_time"
          label="入库时间"
          width="160"
        />
        <el-table-column
          prop="status_name"
          label="状态"
          min-width="20"
        />
      </el-table>
      <page
        :old-page="false"
        :total="total1"
        :current-page="search1.page"
        @currentChange="currentChange1"
      />
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
        <el-form-item label="备件代码">
          <el-input
            v-model="creatOrder.spare_code"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input
            v-model="creatOrder.spare_name"
            :disabled="true"
            style="width:250px"
          />
        </el-form-item>
        <el-form-item label="库区" prop="equip_warehouse_area">
          <el-select
            v-model="creatOrder.equip_warehouse_area"
            filterable
            placeholder="请选择"
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
            filterable
            placeholder="请选择"
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
        <el-form-item label="数量" prop="in_quantity">
          <el-input-number
            v-model="creatOrder.in_quantity"
            :min="1"
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
        <el-form-item label="领料人" prop="add_username">
          <el-select
            v-model="dialogForm.add_username"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.order_id"
              :value="item.order_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="lluser">
          <el-select
            v-model="dialogForm.lluser"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options2"
              :key="item.id"
              :label="item.global_name"
              :value="item.global_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item filterable label="提交部门" prop="submission_department">
          <el-select
            v-model="dialogForm.submission_department"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="dialogForm.desc"
            type="textarea"
            style="width:300px"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="入库物料详情列表" prop="equip_spare">
          <el-button type="primary" @click="Add">添加</el-button>
          <el-table
            max-height="400"
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
              prop="unique_id"
              label="ERP物料信息id"
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
      :title="`编辑入库单据`"
      :visible.sync="dialogVisibleEdit"
      width="50%"
      :before-close="handleCloseEdit"
    >
      <el-form
        ref="createForm"
        v-loading="loadingList"
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
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="dialogForm.desc"
            type="textarea"
            style="width:300px"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="入库物料详情列表" prop="equip_spare">
          <el-button v-if="dialogForm.status_name!=='关闭'&&dialogForm.status_name!=='已入库'" type="primary" :disabled="spare_code!==''" @click="Add">添加</el-button>
          <span :style="{marginLeft:dialogForm.status_name!=='关闭'&&dialogForm.status_name!=='已入库'?'20px':0}">备件编号：</span>
          <el-input
            v-model="spare_code"
            style="width:200px"
            clearable
            @input="codeSearch"
          />
          <el-table
            max-height="400"
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
              prop="unique_id"
              label="ERP物料信息id"
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
                  :min="row.in_quantity"
                  :max="99999"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130px">
              <template slot-scope="scope">
                <el-button
                  v-if="dialogForm.status_name!=='关闭'&&dialogForm.status_name!=='已入库'"
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
        <el-button @click="handleCloseEdit(false)">取 消</el-button>
        <el-button v-if="dialogForm.status_name!=='关闭'&&dialogForm.status_name!=='已入库'" type="primary" :loading="btnLoad" @click="submitEdit">确 定</el-button>
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
      width="500px"
    >
      <el-form
        label-width="100px"
        :model="SpareForm"
      >
        <el-form-item label="备件代码">
          <el-input v-model="SpareForm.spare_code" disabled style="width:300px" />
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
        <el-form-item label="用途">
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

  </div>
</template>

<script>
import material from '../components/material-dialog'
import { mapGetters } from 'vuex'
import { classesListUrl } from '@/api/base_w'
import { sectionTree } from '@/api/base_w_four'
import { getOrderId, equipWarehouseOrder, equipWarehouseOrderDetail, equipWarehouseArea, equipWarehouseLocation, getSpareOrder, closeOrder, equipAutoPlan } from '@/api/jqy'
import page from '@/components/page'
import { debounce } from '@/utils'
export default {
  name: 'WarehousingManagement',
  components: { page, material },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value.length === 0 && this.firstList.length === 0) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    return {
      search: { order: 'in' },
      search1: {},
      btnLoad: false,
      dialogForm: { submission_department: '', equip_spare: [] },
      dateValue: [],
      order: null,
      options: [],
      options1: [],
      options2: [],
      SpareForm: {},
      dialogVisibleSpare: false,
      dialogVisibleEdit: false,
      tableData: [],
      quantity: null,
      tableDataView: [],
      warehouseAreaList: [],
      warehouseLocationList: [],
      total: 0,
      total1: 0,
      status: null,
      spare_code: '',
      loading: false,
      loadingView: false,
      loadingList: false,
      firstList: [],
      dialogVisibleAdd: false,
      dialogVisibleAdd1: false,
      dialogVisible: false,
      dialogVisible1: false,
      submit: false,
      rules: {
        add_username: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        lluser: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        submission_department: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        equip_spare: [
          { validator: validatePass, required: true, trigger: 'change' }
        ]
      },
      rules1: {
        equip_warehouse_area: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        equip_warehouse_location: [
          { required: true, message: '不能为空', trigger: 'bulr' }
        ],
        in_quantity: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      creatOrder: { in_quantity: null, equip_warehouse_area: '',
        equip_warehouse_location: '' }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getList()
    this.getSection()
  },
  methods: {
    generateFun() {
      this.$refs.creatOrder.validate(async(valid) => {
        if (valid) {
          try {
            this.submit = true
            await equipWarehouseOrderDetail('post', null, { data: this.creatOrder })
            this.$message.success('操作成功')
            this.submit = false
            const data = await equipWarehouseOrderDetail('get', null, { params: this.search1 })
            this.tableDataView = data || []
            this.handleClose(null)
            this.dialog(false)
            this.getList()
            this.dialogVisible1 = false
          } catch (e) {
            this.submit = false
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
    async getSection() {
      try {
        const data = await sectionTree('get', null, { params: { all: 1 }})
        const data1 = await equipAutoPlan('get', null, { params: { default_staff: 1, section_name: '设备科' }})
        const data2 = await classesListUrl('get', null, { params: { all: 1, class_name: '备品备件领用审核人' }})
        this.options = data.results || []
        this.options1 = data1.data || []
        this.options2 = data2.results || []
      } catch (e) {
        //
      }
    },
    changeDate(date) {
      this.search.s_time = date ? date[0] : ''
      this.search.e_time = date ? date[1] : ''
      this.changeSearch1()
    },
    async onSubmit() {
      try {
        const orderId = await getOrderId('get', null, { params: { status: '入库' }})
        this.dialogForm = {
          lluser: null,
          add_username: this.name,
          order_id: orderId,
          equip_spare: [],
          submission_department: '设备科' }
        this.dialogVisibleAdd = true
      } catch {
        this.dialogVisibleAdd = false
      }
    },
    onSubmit1() {
      this.$confirm('此操作将同步ERP领料单是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.btnLoad = true
        getSpareOrder('get', null, {})
          .then(response => {
            this.btnLoad = false
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
          .catch(response => {
            this.btnLoad = false
          })
      })
    },
    // async getWarehouseArea(val) {
    //   if (val) {
    //     try {
    //       const data = await equipWarehouseArea('get', null, { params: { equip_spare: this.creatOrder.equip_spare }})
    //       this.warehouseAreaList = data.data
    //     } catch (e) {
    //     // this.loading = false
    //     }
    //   }
    // },
    async clear() {
      if (this.creatOrder.equip_warehouse_location) {
        this.creatOrder.equip_warehouse_location = null
      }
      try {
        const data = await equipWarehouseLocation('get', null, { params: { equip_warehouse_area_id: this.creatOrder.equip_warehouse_area, all: 1 }})
        this.warehouseLocationList = data
        if (data.length > 0) {
          this.creatOrder.equip_warehouse_location = data[0].id
        }
      } catch (e) {
        this.warehouseLocationList = []
      }
    },
    async getWarehouseLocation(val) {
      if (val) {
        if (this.creatOrder.equip_warehouse_area) {
          try {
            const data = await equipWarehouseLocation('get', null, { params: { equip_warehouse_area_id: this.creatOrder.equip_warehouse_area, all: 1 }})
            this.warehouseLocationList = data
          } catch (e) {
            this.warehouseLocationList = []
          }
        } else {
          this.$message.info('请先选择库区')
          this.warehouseLocationList = []
        }
      }
    },
    async editOrder(row) {
      this.dialogVisibleEdit = true
      try {
        this.spare_code = ''
        this.loadingList = true
        const data = await equipWarehouseOrder('get', row.id, {})
        this.dialogForm = data
        this.dialogForm.equip_spare = []
        this.dialogForm.order_detail.forEach(d => {
          this.dialogForm.equip_spare.push({
            id: d.equip_spare,
            in_quantity: d.in_quantity,
            unique_id: d.unique_id,
            quantity: d.plan_in_quantity,
            spare_code: d.spare_code,
            spare_name: d.spare_name,
            status: d.status
          })
        })
        this.firstList = JSON.parse(JSON.stringify(this.dialogForm.equip_spare))
        this.loadingList = false
      } catch {
        this.loadingList = false
      }
    },
    deleteOrder: function(row) {
      this.$confirm('此操作将删除' + row.order_id + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        equipWarehouseOrder('delete', row.id, {})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
    },
    closeOrder: function(row) {
      this.$confirm('此操作将关闭' + row.order_id + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        closeOrder('post', null, { data: { id: row.id }})
          .then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
      })
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
    codeSearch() {
      if (this.spare_code) {
        this.$set(this.dialogForm, 'equip_spare', this.firstList.filter(d => d.spare_code.indexOf(this.spare_code) !== -1))
      } else {
        this.dialogForm.equip_spare = JSON.parse(JSON.stringify(this.firstList))
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
    lengthSearch() {
      if (this.search.spare_code.length > 0 && this.search.spare_code.length < 4) {
        return
      }
      this.search.page = 1
      debounce(this, 'getList')
    },
    lengthSearch1() {
      if (this.search.spare_name.length > 0 && this.search.spare_name.length < 2) {
        return
      }
      this.search.page = 1
      debounce(this, 'getList')
    },
    async dialog(row) {
      if (row) {
        this.dialogVisible = true
        this.search1.order_id = row.order_id
        this.search1.page = 1
        this.status = row.status_name
      }
      try {
        this.loadingView = true
        const data = await equipWarehouseOrderDetail('get', null, { params: this.search1 })
        this.loadingView = false
        this.total1 = data.count
        this.tableDataView = data.results || []
      } catch (e) {
        this.loadingView = false
      }
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
      // if (row.plan_in_quantity <= row.in_quantity) {
      //   this.$message('已经全部入库')
      // } else {
      this.order = row.id
      this.quantity = row.plan_in_quantity - row.in_quantity
      this.creatOrder.spare_code = row.spare_code
      this.creatOrder.spare_name = row.spare_name
      this.creatOrder.in_quantity = row.plan_in_quantity - row.in_quantity
      this.creatOrder.equip_warehouse_order = row.equip_warehouse_order
      this.creatOrder.unit = row.unit
      this.creatOrder.status = 1
      this.creatOrder.equip_spare = row.equip_spare
      const data = await equipWarehouseArea('get', null, { params: { equip_spare: this.creatOrder.equip_spare }})
      this.warehouseAreaList = data.data.results
      if (data.data.first) {
        this.$set(this.creatOrder, 'equip_warehouse_area', data.data.first.area_id)
        this.warehouseLocationList = await equipWarehouseLocation('get', null, { params: { equip_warehouse_area_id: this.creatOrder.equip_warehouse_area, all: 1 }})
        // this.warehouseLocationList = data1.filter(d => d.equip_warehouse_area === this.creatOrder.equip_warehouse_area)
        if (data.data.first.location_id) {
          this.$set(this.creatOrder, 'equip_warehouse_location', data.data.first.location_id)
        } else {
          this.$set(this.creatOrder, 'equip_warehouse_location', this.warehouseLocationList[0].id)
        }
      }
      this.dialogVisible1 = true
      // }
    },
    handleDelete(row) {
      if (row.status === 2 || row.status === 3) {
        this.$message('备件已有入库,不能删除')
      } else {
        this.dialogForm.equip_spare.forEach((item, index) => {
          if (row.id === item.id) {
            this.dialogForm.equip_spare.splice(index, 1)
          }
        })
        this.firstList.forEach((item, index) => {
          if (row.id === item.id) {
            this.firstList.splice(index, 1)
          }
        })
      }
    },
    searchDialog() {
      this.search1.page = 1
      this.dialog(false)
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
    handleCloseEdit(done) {
      this.dialogVisibleEdit = false
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
    submitEdit() {
      if (this.dialogForm.status_name === '关闭') {
        this.$message('该单据已经关闭,不可修改')
        return
      }
      if (this.spare_code !== '') {
        this.spare_code = ''
        this.dialogForm.equip_spare = this.firstList
      }
      this.dialogForm.status = 1
      this.dialogForm.equip_spare.forEach(d => {
        if (d.quantity === undefined || d.quantity === 0) {
          d.quantity = d.in_quantity > 0 ? d.in_quantity : 1
        }
      })
      if (this.dialogForm.desc === undefined) {
        this.dialogForm.desc = null
      }
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            this.btnLoad = true
            await equipWarehouseOrder('put', this.dialogForm.id, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.btnLoad = false
            this.handleCloseEdit(null)
            this.getList()
          } catch (e) {
            this.btnLoad = false
            this.dialogVisibleEdit = true
          }
        } else {
          return false
        }
      })
    },
    submitFun() {
      this.dialogForm.status = 1
      this.dialogForm.equip_spare.forEach(d => {
        if (d.quantity === undefined) {
          d.quantity = 1
        }
      })
      if (this.dialogForm.desc === undefined) {
        this.dialogForm.desc = null
      }
      // this.dialogForm.equip_spare.forEach(d => {
      //   if (d.one_piece === undefined) {
      //     d.one_piece = 1
      //   }
      // })
      this.$refs.createForm.validate(async(valid) => {
        if (valid) {
          try {
            if (this.dialogForm.equip_spare.length === 0) {
              throw new Error('入库物料未添加')
            }
            this.btnLoad = true
            await equipWarehouseOrder('post', null, { data: this.dialogForm })
            this.$message.success('操作成功')
            this.btnLoad = false
            this.handleCloseAdd(null)
            this.getList()
          } catch (e) {
            if (e.message) {
              this.$message(e.message)
            }
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
      let data1 = []
      for (const i in this.dialogForm.equip_spare) {
        data = data.concat(this.dialogForm.equip_spare[i].id)
        data1 = data1.concat(this.firstList[i].id)
      }
      if (this.$refs['List'].multipleSelection.length > 0) {
        for (let index = 0; index < this.$refs['List'].multipleSelection.length; index++) {
          if (data.indexOf(this.$refs['List'].multipleSelection[index].id) === -1) {
            this.dialogForm.equip_spare.unshift({
              spare_code: this.$refs['List'].multipleSelection[index].spare_code,
              id: this.$refs['List'].multipleSelection[index].id,
              spare_name: this.$refs['List'].multipleSelection[index].spare_name,
              unique_id: this.$refs['List'].multipleSelection[index].unique_id,
              quantity: 1
            })
          }
          if (data1.indexOf(this.$refs['List'].multipleSelection[index].id) === -1) {
            this.firstList.unshift({
              spare_code: this.$refs['List'].multipleSelection[index].spare_code,
              id: this.$refs['List'].multipleSelection[index].id,
              spare_name: this.$refs['List'].multipleSelection[index].spare_name,
              unique_id: this.$refs['List'].multipleSelection[index].unique_id,
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
    },
    currentChange1(page, page_size) {
      this.search1.page = page
      this.search1.page_size = page_size
      this.dialog()
    }
  }
}
</script>

<style>

</style>
