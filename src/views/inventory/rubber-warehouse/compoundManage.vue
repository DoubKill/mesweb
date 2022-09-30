<template>
  <div class="app-container outbound_manage">
    <!-- 胶片库出库计划 -->
    <el-form :inline="true">
      <el-form-item label="单据号">
        <el-input v-model="search.order_no" size="" clearable placeholder="请输入单据号" @input="changeList" />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-select v-model="search.product_no" allow-create filterable placeholder="请选择" clearable @visible-change="getProductList" @change="changeList2">
          <el-option
            v-for="item in options1"
            :key="item.material_no"
            :label="item.material_no"
            :value="item.material_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="建单起止时间">
        <el-date-picker
          v-model="dateSearch"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="searchDate"
        />
      </el-form-item>
      <el-form-item label="出库任务号">
        <el-input v-model="search.task_no" size="" clearable placeholder="请输入出库任务号" @input="changeList" />
      </el-form-item>
      <el-form-item label="追溯号">
        <el-input v-model="search.lot_no" size="" clearable placeholder="请输入追溯号" @input="changeList" />
      </el-form-item>
      <el-form-item label="托盘号">
        <el-input v-model="search.pallet_no" size="" clearable placeholder="请输入托盘号" @input="changeList" />
      </el-form-item>
      <el-form-item label="库区">
        <el-select
          v-model="search.warehouse"
          placeholder="请选择库区"
          clearable
          @change="changeList1"
        >
          <el-option
            v-for="item in ['终炼胶库','混炼胶库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出库口">
        <el-select
          v-model="search.station"
          placeholder="请选择出库口"
          clearable
          @visible-change="getStation"
          @change="changeList2"
        >
          <el-option
            v-for="item in stationList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出库方式">
        <el-select
          v-model="search.order_type"
          placeholder="请选择出库方式"
          :clearable="false"
          @change="changeList2"
        >
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="button-right" type="primary" @click="getList">查询</el-button>
        <el-button v-permission="['product_outbound_plan','add']" class="button-right" type="primary" @click="dialog">新建单据</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="新建胶料出库单据"
      :visible.sync="dialogVisibleNo"
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :inline="true"
        :model="creatOrder"
        :rules="rules"
      >
        <el-form-item style="marginLeft:25px" label="出库类别" prop="order_type">
          <el-select
            v-model="creatOrder.order_type"
            placeholder="请选择"
            @change="changeType"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="marginLeft:54px" label="库区" prop="warehouse">
          <el-select
            v-model="creatOrder.warehouse"
            placeholder="请选择"
            clearable
            @change="changeWarehouse"
          >
            <el-option
              v-for="item in ['终炼胶库','混炼胶库']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="marginLeft:40px" label="出库口" prop="station">
          <el-select
            v-model="creatOrder.station"
            placeholder="请选择"
            clearable
            @visible-change="getStation1"
          >
            <el-option
              v-for="item in stationList1"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <div v-if="creatOrder.order_type===1">
          <el-form-item style="marginLeft:25px" label="品质状态" prop="quality_status">
            <el-select
              v-model="creatOrder.quality_status"
              :disabled="unqualified"
              placeholder="请选择"
              clearable
              @change="clear2"
            >
              <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="marginLeft:25px" label="胶料编码" prop="product_no">
            <el-select
              v-model="creatOrder.product_no"
              placeholder="请选择胶料编码"
              filterable
              clearable
              @visible-change="productBatchingChanged"
              @change="clear1"
            >
              <el-option
                v-for="item in batchList"
                :key="item.material_no"
                :label="item.material_name"
                :value="item.material_no"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="marginLeft:10px" label="订单数量(车)" prop="order_qty">
            <el-input-number v-model="creatOrder.order_qty" controls-position="right" :min="1" />
          </el-form-item>
        </div>
        <div v-if="creatOrder.order_type===2">
          <el-form-item label="日期" prop="factory_date" style="marginLeft:54px">
            <el-date-picker
              v-model="creatOrder.factory_date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              @change="creatOrder.product_no = null"
            />
          </el-form-item>
          <el-form-item label="班次" prop="classes" style="marginLeft:54px">
            <classSelect
              :value-default="creatOrder.classes"
              @classSelected="classChanged"
            />
          </el-form-item>
          <el-form-item label="机台" prop="equip_no" style="marginLeft:54px">
            <selectEquip
              :equip_no_props.sync="creatOrder.equip_no"
              @changeSearch="changeSearch"
            />
          </el-form-item>
          <el-form-item style="marginLeft:25px" label="胶料编码" prop="product_no">
            <el-select
              v-model="creatOrder.product_no"
              placeholder="请选择胶料编码"
              filterable
              clearable
              @change="changeProduct"
              @visible-change="productBatchingChangedNew"
            >
              <el-option
                v-for="item in batchListNew"
                :key="item.product_no"
                :label="item.product_no"
                :value="item.product_no"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="车次" prop="begin_trains" style="marginLeft:54px">
            <el-input-number v-model="creatOrder.begin_trains" controls-position="right" :min="minTrains" :max="creatOrder.end_trains" />-
            <el-input-number v-model="creatOrder.end_trains" controls-position="right" :min="creatOrder.begin_trains" :max="maxTrains" />
          </el-form-item>
        </div>
        <el-form-item v-if="creatOrder.order_type===3" style="marginLeft:40px" label="托盘号" prop="pallet_no">
          <el-input
            v-model="creatOrder.pallet_no"
            placeholder="请输入托盘号"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose(false)">取 消</el-button>
        <el-button :loading="submit" type="primary" @click="generateFun">确 定</el-button>
      </span>
    </el-dialog>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        label="批量出库"
        width="95"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.status!==1||normal"
            size="mini"
            type="primary"
            @click="normalOutbound(scope)"
          >批量出库</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="指定出库"
        width="95"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.status!==1||assign"
            size="mini"
            type="primary"
            @click="assignOutbound(scope)"
          >指定出库</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="关闭"
        width="70"
      >
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.status!==1||close"
            size="mini"
            type="danger"
            @click="deleteList(scope)"
          >关闭</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="warehouse"
        label="库房"
        width="70"
      />
      <el-table-column
        prop="warehouse"
        label="出库类型"
        min-width="20"
        :formatter="(row)=>{
          return typeList.find(d=>d.id === row.order_type).name
        }"
      />
      <el-table-column
        prop="station"
        label="出库口"
        min-width="20"
      />
      <el-table-column
        prop="order_no"
        label="单据号"
        min-width="20"
      />
      <el-table-column
        v-if="search.order_type!==2"
        prop="product_no"
        label="物料编码"
        min-width="30"
      />
      <el-table-column
        v-if="search.order_type===1"
        prop="quality_status"
        label="品质状态"
        width="70"
      />
      <el-table-column
        v-if="search.order_type===2"
        prop="factory_date"
        label="日期"
        min-width="20"
      />
      <el-table-column
        v-if="search.order_type===2"
        prop="classes"
        label="班次"
        width="50"
      />
      <el-table-column
        v-if="search.order_type===2"
        prop="equip_no"
        label="机台"
        width="50"
      />
      <el-table-column
        v-if="search.order_type===2"
        label="车次"
        width="50"
        :formatter="(row)=>{
          if(row.begin_trains){
            return row.begin_trains+'-'+row.end_trains
          }
        }"
      />
      <el-table-column
        v-if="search.order_type===3"
        prop="pallet_no"
        label="托盘号"
        min-width="20"
      />
      <el-table-column
        prop="order_qty"
        label="订单数量(车)"
        min-width="12"
      />
      <el-table-column
        prop="need_qty"
        label="需求数量(车)"
        min-width="12"
      />
      <el-table-column
        prop="work_qty"
        label="工作数量(车)"
        min-width="12"
      />
      <el-table-column
        prop="finished_qty"
        label="完成数量(车)"
        min-width="12"
      />
      <el-table-column
        prop="created_username"
        label="创建人员"
        width="70"
      />
      <el-table-column
        prop="created_date"
        label="创建时间"
        width="90"
      />
      <el-table-column
        prop="latest_task_time"
        label="最新任务创建时间"
        width="90"
      />
      <el-table-column
        label="查看"
        width="80"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="showEditDialog(row)">查看</el-button>
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
      title="指定出库"
      :visible.sync="assignOutboundDialogVisible"
      :before-close="handleCloseNormal"
      width="80%"
    >
      <generate-assign-outbound
        ref="assignOutbound"
        :warehouse-name="warehouseName"
        :list="list"
        :warehouse-info="warehouseInfo"
        :show="assignOutboundDialogVisible"
        @getList="getList"
        @visibleMethod="visibleMethodNormal"
      />
    </el-dialog>
    <el-dialog
      title="正常出库"
      :visible.sync="normalOutboundDialogVisible"
      :before-close="handleCloseNormal"
      width="80%"
    >
      <generate-normal-outbound
        ref="normalOutbound"
        :warehouse-name="warehouseName"
        :list="list"
        :warehouse-info="warehouseInfo"
        :show="normalOutboundDialogVisible"
        @getList="getList"
        @visibleMethod="visibleMethodNormal"
      /></el-dialog>
    <el-dialog
      title="出库单据"
      :visible.sync="dialogVisibleView"
      width="90%"
      :before-close="handleCloseView"
    >
      <el-form :inline="true">
        <el-form-item label="仓库名称">
          {{ rowObj.warehouse }}
        </el-form-item>
        <el-form-item label="出库单号">
          {{ rowObj.order_no }}
        </el-form-item>
        <el-form-item label="出库位置">
          {{ rowObj.station }}
        </el-form-item>
        <el-form-item label="订单子编号">
          <el-input
            v-model="searchView.sub_no"
            style="width:150px"
            clearable
            placeholder="请输入内容"
            @input="getDebounceView"
          />
        </el-form-item>
        <el-form-item label="托盘号">
          <el-input
            v-model="searchView.pallet_no"
            style="width:150px"
            clearable
            placeholder="请输入内容"
            @input="getDebounceView"
          />
        </el-form-item>
        <el-form-item label="收皮条码">
          <el-input
            v-model="searchView.lot_no"
            style="width:220px"
            clearable
            placeholder="请输入内容"
            @input="getDebounceView"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchView.status"
            style="width:300px"
            placeholder="请选择状态"
            clearable
            multiple
            @change="searchStatus"
          >
            <el-option
              v-for="item in optionsState1"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="cancelOrderNo(selectionData)">取消任务</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        v-loading="loadingView"
        :data="tableDataView"
        border
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          :reserve-selection="true"
          :selectable="(row)=>{return row.status===2}"
        />
        <el-table-column
          prop="order_no"
          label="出库任务号"
          min-width="20"
        />
        <el-table-column
          prop="sub_no"
          label="订单子编号"
          width="90"
        />
        <el-table-column
          prop="material_no"
          label="物料编码"
          width="140"
        >
          <template>{{ rowObj.product_no }}</template>
        </el-table-column>
        <el-table-column
          prop="quality_status"
          label="品质状态"
          width="70"
        />
        <el-table-column
          prop="lot_no"
          label="Lot_No"
          min-width="25"
        />
        <el-table-column
          prop="pallet_no"
          label="托盘号"
          min-width="15"
        />
        <el-table-column
          prop="memo"
          label="车次"
          min-width="15"
        />
        <el-table-column
          prop="location"
          label="库位编号"
          min-width="20"
        />
        <el-table-column
          prop="created_username"
          label="任务创建人"
          min-width="20"
        />
        <el-table-column
          prop="created_date"
          label="任务创建时间"
          min-width="20"
        />
        <el-table-column
          prop="finish_time"
          label="出库时间"
          min-width="20"
        />
        <el-table-column
          prop="status"
          label="状态"
          min-width="10"
          :formatter="(row)=>{
            let obj = optionsState1.find(d=>d.id === row.status)
            return obj.name
          }"
        />
        <el-table-column
          label="操作"
          width="140"
        >
          <template slot-scope="{row}">
            <!-- <el-button :disabled="row.status===3||row.status===4||row.status===5" type="danger" @click="closeOrderNo(row)">关闭</el-button> -->
            <el-button :disabled="row.status!==2" type="primary" @click="cancelOrderNo([row])">取消任务</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page
        :old-page="false"
        :total="totalView"
        :current-page="searchView.page"
        @currentChange="currentChangeView"
      />
    </el-dialog>
  </div>
</template>

<script>
import GenerateAssignOutbound from '../components-film/generate_assign_outbound'
import GenerateNormalOutbound from '../components-film/generate_normal_outbound'
import { bzMixinInventorySummary, bzFinalInventorySummary } from '@/api/base_w_four'
import { compoundManage, userStation, outboundPproductInfo } from '@/api/jqy'
import { batchingMaterials } from '@/api/base_w'
import { mapGetters } from 'vuex'
import myMixin from '../components-zl-hl/mixin-zl-hl'
import { stationInfo } from '@/api/warehouse'
import { checkPermission } from '@/utils'
import page from '@/components/page'
import { debounce } from '@/utils/index'
import classSelect from '@/components/ClassSelect'
import selectEquip from '@/components/select_w/equip'

export default {
  name: 'CompoundManage',
  components: { selectEquip, classSelect, page, GenerateAssignOutbound, GenerateNormalOutbound },
  mixins: [myMixin],
  data() {
    return {
      loading: false,
      submit: false,
      search: {
        page: 1,
        warehouse: '',
        station: '',
        order_type: 1
      },
      creatOrder: {
        product_no: '',
        warehouse: '',
        station: '',
        order_qty: undefined,
        quality_status: '一等品',
        order_type: 1
      },
      options: ['一等品', '三等品', '待检品'],
      close: true,
      assign: true,
      normal: true,
      unqualified: true,
      dateSearch: [],
      stationList: [],
      batchList: [],
      batchListNew: [],
      stationList1: [],
      total: 0,
      list: {},
      tableData: [],
      dialogVisibleNo: false,
      assignOutboundDialogVisible: false,
      normalOutboundDialogVisible: false,
      currentIndex: null,
      rowVal: {},
      warehouseName: '',
      // 仓库id
      warehouseInfo: null,
      handleSelection: [],
      options1: [],
      optionsState1: [
        { name: '新建', id: 1 },
        { name: '执行中', id: 2 },
        { name: '已出库', id: 3 },
        { name: '取消', id: 4 },
        { name: '失败', id: 5 }
      ],
      minTrains: 1,
      maxTrains: 9999,
      typeList: [{ id: 1, name: '普通' }, { id: 2, name: '指定胶料信息' }, { id: 3, name: '指定托盘号' }],
      rules: {
        product_no: [
          { required: true, message: '请选择胶料编码', trigger: 'blur' }
        ],
        quality_status: [
          { required: true, message: '请选择品质状态', trigger: 'blur' }
        ],
        order_qty: [
          { pattern: /^[1-9]\d*$/, message: '只能输入正整数' }
        ],
        warehouse: [
          { required: true, message: '请选择库区', trigger: 'change' }
        ],
        station: [
          { required: true, message: '请选择出库口', trigger: 'change' }
        ],
        order_type: [
          { required: true, message: '请选择类别', trigger: 'change' }
        ],
        pallet_no: [
          { required: true, message: '请输入托盘号', trigger: 'blur' }
        ],
        factory_date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        classes: [{ required: true, message: '不能为空', trigger: 'change',
          validator: (rule, value, callback) => {
            if (!this.creatOrder.classes && !value) {
              callback(new Error('请选择班次'))
            } else {
              callback()
            }
          } }],
        equip_no: [{ required: true, message: '不能为空', trigger: 'change',
          validator: (rule, value, callback) => {
            if (!this.creatOrder.equip_no && !value) {
              callback(new Error('请选择机台'))
            } else {
              callback()
            }
          } }],
        begin_trains: [{ required: true, message: '不能为空', trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!this.creatOrder.begin_trains || !this.creatOrder.end_trains) {
              callback(new Error('请填写车次'))
            } else {
              callback()
            }
          } }]
      }
    }
  },
  computed: {
    ...mapGetters({ // 获取不到数据
      userId: 'userId'

    })
  },
  created() {
    this.getUser()
    if (checkPermission(['product_outbound_plan', 'close'])) {
      this.close = false
    }
    if (checkPermission(['product_outbound_plan', 'assign'])) {
      this.assign = false
    }
    if (checkPermission(['product_outbound_plan', 'normal'])) {
      this.normal = false
    }
    if (checkPermission(['product_outbound_plan', 'unqualified'])) {
      this.unqualified = false
    }
  },
  methods: {
    checkPermission,
    async getProductList(val) {
      if (val) {
        try {
          const data = await batchingMaterials('get', null, { params: { all: 1 }})
          this.options1 = data || []
        } catch (e) {
        //
        }
      }
    },
    dialog() {
      this.creatOrder.product_no = ''
      this.creatOrder.order_qty = null
      this.$set(this.creatOrder, 'factory_date', null)
      this.$set(this.creatOrder, 'classes', null)
      this.$set(this.creatOrder, 'equip_no', null)
      this.$set(this.creatOrder, 'begin_trains', null)
      this.$set(this.creatOrder, 'end_trains', null)
      this.$set(this.creatOrder, 'pallet_no', null)
      this.dialogVisibleNo = true
      if (this.$refs.ruleForm) {
        setTimeout(d => {
          this.$refs.ruleForm.clearValidate()
        }, 300)
      }
    },
    async productBatchingChangedNew() {
      try {
        if (!this.creatOrder.factory_date || !this.creatOrder.classes || !this.creatOrder.equip_no) {
          this.$message('请填入日期、班次、机台')
          return
        }
        const data = await outboundPproductInfo('get', null, { params: { factory_date: this.creatOrder.factory_date, equip_no: this.creatOrder.equip_no, classes: this.creatOrder.classes, warehouse: this.creatOrder.warehouse }})
        this.batchListNew = data
      } catch (e) {
        //
      }
    },
    async productBatchingChanged(val) {
      if (val === true) {
        if (this.creatOrder.warehouse === '' || this.creatOrder.warehouse === null) {
          this.batchList = []
          this.$message.info('请先选择库区')
        } else if (this.creatOrder.warehouse === '混炼胶库' && this.creatOrder.station === '') {
          this.batchList = []
          this.$message.info('请先选择出库口')
        } else {
          try {
            const _api = this.creatOrder.warehouse === '混炼胶库' ? bzMixinInventorySummary : bzFinalInventorySummary
            const obj = {}
            obj.location_status = '有货货位'
            obj.quality_status = this.creatOrder.quality_status
            if (this.creatOrder.warehouse === '混炼胶库') {
              obj.station = this.creatOrder.station
            }
            const data = await _api('get', null, { params: obj })
            this.batchList = data
          } catch (e) { this.batchList = [] }
        }
      }
    },
    async deleteList(scope) {
      try {
        await compoundManage('patch', scope.row.id, { data: { status: '4' }})
        this.$message.success('关闭成功')
        this.getList()
      } catch (e) { this.$message.info('关闭失败') }
    },
    generateFun() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          try {
            if (!this.creatOrder.order_qty) {
              delete this.creatOrder.order_qty
            }
            this.submit = true
            await compoundManage('post', null, { data: this.creatOrder })
            this.submit = false
            this.$message.success('新建成功')
            this.dialogVisibleNo = false
            this.getUser()
          } catch (e) { this.submit = false }
        } else {
          this.$message.info('输入必填项')
        }
      })
    },
    async getUser() {
      try {
        const data = await userStation('get', null, { params: { user_id: this.userId }})
        this.search.warehouse = data.warehouse || null
        this.search.station = data.station || null
        this.creatOrder.warehouse = data.warehouse || null
        this.creatOrder.station = data.station || null
        this.creatOrder.quality_status = data.quality_status || null
        this.getList()
      } catch (error) {
        this.getList()
      }
    },
    async getList() {
      try {
        this.loading = true
        this.tableData = []
        const data = await compoundManage('get', null, { params: this.search })
        this.total = data.count
        this.tableData = data.results
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    async getStation(val) {
      if (val === true) {
        try {
          if (this.search.warehouse !== '' && this.search.warehouse !== null) {
            const data1 = await stationInfo({ warehouse_name: this.search.warehouse })
            this.stationList = data1.results
          } else {
            this.stationList = []
            this.$message.info('请先选择库区')
          }
        } catch (error) {
          this.stationList = []
        }
      }
    },
    changeWarehouse() {
      if (this.creatOrder.station !== '') {
        this.creatOrder.station = ''
      }
      if (this.creatOrder.product_no !== '') {
        this.creatOrder.product_no = ''
      }
      if (this.creatOrder.order_type === 2) {
        this.creatOrder.product_no = null
        this.productBatchingChangedNew()
      }
    },
    clear1(val) {
      const val1 = this.batchList.filter(D => {
        return D.material_no === val
      })
      this.creatOrder.order_qty = val1[0].all_qty
    },
    clear2() {
      if (this.creatOrder.product_no !== '') {
        this.creatOrder.product_no = ''
      }
      if (this.creatOrder.order_qty) {
        this.creatOrder.order_qty = null
      }
    },
    async getStation1(val) {
      if (val === true) {
        try {
          if (this.creatOrder.warehouse !== '' && this.creatOrder.warehouse !== null) {
            const data1 = await stationInfo({ warehouse_name: this.creatOrder.warehouse })
            this.stationList1 = data1.results
          } else {
            this.stationList1 = []
            this.$message.info('请先选择库区')
          }
        } catch (error) {
          this.stationList1 = []
        }
      }
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    handleClose(done) {
      this.dialogVisibleNo = false
      if (done) {
        done()
      }
    },
    handleCloseNormal(done) {
      if (this.$refs.normalOutbound) {
        this.$refs.normalOutbound.creadVal()
      }
      if (this.$refs.assignOutbound) {
        this.$refs.assignOutbound.creadVal()
      }
      done()
    },
    changeList() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeList1() {
      this.search.station = ''
      this.search.page = 1
      this.getList()
    },
    changeList2() {
      this.search.page = 1
      this.getList()
    },
    searchDate(arr) {
      this.search.st = arr ? arr[0] : ''
      this.search.et = arr ? arr[1] : ''
      this.getList()
    },
    visibleMethodNormal() {
      this.normalOutboundDialogVisible = false
      this.assignOutboundDialogVisible = false
    },
    normalOutbound(scope) {
      this.list = scope.row
      this.warehouseName = scope.row.warehouse
      this.normalOutboundDialogVisible = true
    },
    assignOutbound(scope) {
      this.list = scope.row
      this.warehouseName = scope.row.warehouse
      this.assignOutboundDialogVisible = true
    },
    changeType() {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.clearValidate()
      }
    },
    classChanged(val) {
      this.creatOrder.classes = val
      this.creatOrder.product_no = null
    },
    changeSearch(val) {
      this.creatOrder.equip_no = val
      this.creatOrder.product_no = null
    },
    changeProduct(val) {
      const arr = this.batchListNew.filter(d => val === d.product_no)
      this.minTrains = arr[0] ? arr[0].min_trains : 1
      this.maxTrains = arr[0] ? arr[0].max_trains : 9999
      this.creatOrder.begin_trains = arr[0] ? arr[0].min_trains : this.creatOrder.begin_trains
      this.creatOrder.end_trains = arr[0] ? arr[0].max_trains : this.creatOrder.end_trains
    }
  }
}
</script>
<style lang="scss">
  .outbound_manage{
    .el-dialog{
      min-width: 500px !important;
    }
  }
</style>
