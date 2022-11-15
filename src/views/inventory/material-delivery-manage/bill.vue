<template>
  <div>
    <!-- 原材料 出库单据 -->
    <el-form :inline="true">
      <el-form-item label="出库单据号">
        <el-input
          v-model="search.order_no"
          clearable
          placeholder="请输入内容"
          @input="getDebounce"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="search.task_status"
          style="width:120px"
          clearable
          placeholder="请选择"
          @change="changeDate"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料名称">
        <el-select v-model="search.material_name" allow-create filterable placeholder="请选择" clearable @visible-change="getMaterialsList" @change="changeDate">
          <el-option
            v-for="item in options1"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <!-- <el-input
          v-model="search.material_name"
          clearable
          placeholder="请输入内容"
          @input="getDebounce"
        /> -->
      </el-form-item>
      <el-form-item label="物料编码">
        <el-select v-model="search.material_no" allow-create filterable placeholder="请选择" clearable @visible-change="getMaterialsList" @change="changeDate">
          <el-option
            v-for="item in options1"
            :key="item.code"
            :label="item.code"
            :value="item.code"
          />
        </el-select>
        <!-- <el-input
          v-model="search.material_no"
          clearable
          placeholder="请输入内容"
          @input="getDebounce"
        /> -->
      </el-form-item>
      <el-form-item label="起止创建日期">
        <el-date-picker
          v-model="dateValue"
          clearable
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日时"
          end-placeholder="结束日时"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
      </el-form-item>
      <el-button
        v-permission="['material_outbound_record', 'space']"
        type="primary"
        @click="showLocationDialog"
      >指定库位出库</el-button>
      <el-button
        v-permission="['material_outbound_record', 'weight']"
        type="primary"
        @click="showWeightDialog"
      >指定重量出库</el-button>
      <el-button type="primary" :loading="btnExportLoad" @click="templateDownload">导出Excel</el-button>
      <el-button
        type="primary"
        @click="getList"
      >刷新</el-button>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        label="序号"
        type="index"
        min-width="20"
      />
      <el-table-column
        prop="order_no"
        label="出库单据号"
        min-width="20"
      />
      <el-table-column
        prop="task_type"
        label="单据类型"
        min-width="20"
        :formatter="(row)=>{
          let obj = optionsType.find(d=>d.id === row.task_type)
          return obj.name
        }"
      />
      <el-table-column
        prop="start_time"
        label="创建时间"
        min-width="20"
      />
      <el-table-column
        prop="task_status"
        label="状态"
        min-width="20"
        :formatter="(row)=>{
          let obj = options.find(d=>d.id === row.task_status)
          return obj.name
        }"
      />
      <el-table-column
        prop="qty"
        label="数量"
        min-width="20"
      />
      <el-table-column
        prop="initiator"
        label="创建人"
        min-width="20"
      />
      <el-table-column
        label="操作"
        min-width="20"
      >
        <template slot-scope="{row}">
          <el-button
            size="mini"
            @click="showEditDialog(row)"
          >查看</el-button>
          <el-button
            type="warning"
            size="mini"
            @click="cancelFun(row)"
          >取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page
      v-if="!loading"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />

    <el-dialog
      title="物料明细"
      :visible.sync="dialogVisible"
      width="75%"
    >
      <el-table
        v-loading="loading1"
        :data="tableData1"
        style="width: 100%"
        border
      >
        <el-table-column
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column
          prop="material_no"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="material_name"
          label="物料名称"
          min-width="16"
        />
        <el-table-column
          prop="qty"
          label="数量"
          min-width="6"
        />
        <el-table-column
          prop="entrance"
          label="站台编码"
          min-width="12"
        />
        <el-table-column
          prop="entrance_name"
          label="站台名称"
          min-width="10"
        />
        <el-table-column
          label="状态"
          min-width="8"
          :formatter="(row)=>{
            return taskStateList[row.task_status]
          }"
        />
      </el-table>
    </el-dialog>

    <el-dialog
      :title="isLocation?'添加指定库位出库单据':'添加指定重量出库单据'"
      :visible.sync="dialogVisible1"
      width="80%"
      :before-close="handleClose1"
    >
      <el-form
        v-if="!loading2"
        :inline="true"
      >
        <el-form-item label="出库口(必选)">
          <el-select
            v-model="formSearch.entrance_name"
            placeholder="请选择"
            @change="changeEntrance"
          >
            <el-option
              v-for="item in optionsEntrance"
              :key="item.code"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料名称">
          <el-select v-model="formSearch.material_name" allow-create filterable placeholder="请选择" clearable @visible-change="getProduct" @change="getDialog">
            <el-option
              v-for="item in options2"
              :key="item.material_name"
              :label="item.material_name"
              :value="item.material_name"
            />
          </el-select>
          <!-- <el-input
            v-model="formSearch.material_name"
            clearable
            placeholder="请输入内容"
            @input="getDialogDebounce"
          /> -->
        </el-form-item>
        <el-form-item label="物料编码">
          <el-select v-model="formSearch.material_no" allow-create filterable placeholder="请选择" clearable @visible-change="getProduct" @change="getDialog">
            <el-option
              v-for="item in options2"
              :key="item.material_no"
              :label="item.material_no"
              :value="item.material_no"
            />
          </el-select>
          <!-- <el-input
            v-model="formSearch.material_no"
            clearable
            placeholder="请输入内容"
            @input="getDialogDebounce"
          /> -->
        </el-form-item>
        <el-form-item label="品质状态">
          <el-select
            v-model="formSearch.quality_status"
            placeholder="请选择"
            @change="getDialog"
          >
            <el-option
              v-for="(item,i) in qualityStatus"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isLocation"
          label="伸位"
        >
          <el-select
            v-model="formSearch.position"
            clearable
            placeholder="请选择"
            @change="getDialog"
          >
            <el-option
              v-for="(item,i) in [{name:'外伸位',id:'外'},{name:'内伸位',id:'内'}]"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isLocation"
          label="是否进烘房"
        >
          <el-select
            v-model="formSearch.is_entering"
            clearable
            placeholder="请选择"
            @change="getDialog"
          >
            <el-option
              v-for="(item,i) in [{name:'Y'},{name:'N'}]"
              :key="i"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="isLocation" label="批次号">
          <el-input
            v-model="formSearch.batch_no"
            clearable
            placeholder="请输入内容"
            @input="getDialogDebounce"
          />
        </el-form-item>
        <!-- <el-form-item v-if="isLocation" label="门尼值">
          <el-input-number v-model="formSearch.st_value" controls-position="right" :min="1" :max="formSearch.et_value" @change="getDialog" /> -
          <el-input-number v-model="formSearch.et_value" controls-position="right" :min="formSearch.st_value" :max="999" @change="getDialog" />
        </el-form-item> -->
        <el-form-item v-if="isLocation" label="门尼值等级">
          <el-select
            v-model="formSearch.mooney_level"
            clearable
            placeholder="请选择"
            @change="getDialog"
          >
            <el-option
              v-for="item in ['高门尼','标准门尼','低门尼']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="isLocation" label="巷道">
          <el-select v-model="formSearch.tunnel" filterable clearable placeholder="请选择" @visible-change="getTunnelNameList" @change="getDialog">
            <el-option
              v-for="item in TunnelNameList"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="托盘号">
          <el-input v-model="formSearch.pallet_no" clearable @input="getDialogDebounce" />
        </el-form-item>
      </el-form>
      <div
        v-if="isLocation"
        :key="1"
        v-loading="loading2"
      >
        <h3>库位货物列表</h3>
        <el-table
          :data="tableData2"
          style="width: 100%"
          border
          max-height="400px"
        >
          <el-table-column
            prop="MaterialName"
            label="物料名称"
            min-width="20"
          />
          <el-table-column
            prop="MaterialCode"
            label="物料编码"
            min-width="20"
          />
          <el-table-column
            prop="BatchNo"
            label="批次号"
            min-width="20"
          />
          <el-table-column
            prop="RFID"
            label="托盘RFID"
            min-width="20"
          />
          <el-table-column
            prop="is_entering"
            label="是否进烘培房"
            min-width="20"
            :formatter="(row)=>{
              if(row.RFID){
                let obj = row.RFID.split('')[0]
                return Number(obj) === 5?'Y':'N'
              }
              return ''
            }"
          />
          <el-table-column
            prop="StockDetailState"
            label="品质状态"
            min-width="15"
            :formatter="(row)=>{
              let obj = qualityStatus.find(d=>d.id === row.StockDetailState)
              return obj.name
            }"
          />
          <el-table-column
            prop="SpaceId"
            label="库位编号"
            min-width="20"
          />
          <el-table-column
            prop="unit"
            label="单位"
            min-width="20"
          />
          <el-table-column
            label="库位状态"
            min-width="15"
            :formatter="(row)=>{
              return '使用中'
            }"
          />
          <el-table-column
            prop="inventory_time"
            label="入库时间"
            min-width="20"
          />
          <el-table-column
            prop="position"
            label="伸位"
            min-width="20"
          />
          <el-table-column
            prop="mn_level"
            label="门尼值等级"
            min-width="20"
          />
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="{row,$index}">
              <el-button
                :disabled="row.btnDisabled||btnDisabled"
                @click="showDialog(row,$index)"
              >添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <page
          :total="total1"
          :page-size-props="15"
          :current-page="formSearch.page"
          @currentChange="currentChange1"
        />
        <h3>待出库库位货物</h3>
        <el-table
          :data="tableData4"
          style="width: 100%;margin-top:5px"
          border
        >
          <el-table-column
            label="序号"
            type="index"
            min-width="20"
          />
          <el-table-column
            prop="MaterialName"
            label="物料名称"
            min-width="20"
          />
          <el-table-column
            prop="MaterialCode"
            label="物料编码"
            min-width="20"
          />
          <el-table-column
            prop="BatchNo"
            label="批次号"
            min-width="20"
          />
          <el-table-column
            prop="StockDetailState"
            label="品质状态"
            min-width="20"
            :formatter="(row)=>{
              let obj = qualityStatus.find(d=>d.id === row.StockDetailState)
              return obj.name
            }"
          />
          <el-table-column
            prop="SpaceId"
            label="库位编号"
            min-width="20"
          />
          <el-table-column
            prop="unit"
            label="单位"
            min-width="20"
          />
          <el-table-column
            label="库位状态"
            min-width="20"
            :formatter="(row)=>{
              return '使用中'
            }"
          />
          <el-table-column
            prop="inventory_time"
            label="入库时间"
            min-width="20"
          />
          <el-table-column
            prop="position"
            label="伸位"
            min-width="20"
          />
          <el-table-column
            prop="mn_level"
            label="门尼值等级"
            min-width="20"
          />
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="{row}">
              <el-button @click="cancelDialog(row)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        v-else
        :key="2"
        v-loading="loading2"
      >
        <h3>可添加物料明细</h3>
        <el-table
          :data="tableData5"
          style="width: 100%"
          border
          max-height="400px"
        >
          <el-table-column
            prop="MaterialCode"
            label="物料编码"
            min-width="20"
          />
          <el-table-column
            prop="MaterialName"
            label="物料名称"
            min-width="20"
          />
          <el-table-column
            prop="WeightOfActual"
            label="所在巷道库存总重量/kg"
            min-width="20"
          />
          <el-table-column
            prop="quantity"
            label="库存总数量/托"
            min-width="20"
          />
          <el-table-column
            label="出库数量/托"
            min-width="20"
          >
            <template slot-scope="{row}">
              <el-input-number
                v-model="row.Unit"
                controls-position="right"
                :max="row.quantity"
                @change="changeUnit(row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="出库重量/kg"
            min-width="20"
            prop="WeightOfActualUnit"
          />
          <el-table-column
            label="品质状态"
            min-width="20"
            :formatter="(row)=>{
              let obj = qualityStatus.find(d=>d.id === row.quality_status)
              return obj?obj.name:''
            }"
          />
        </el-table>
      </div>
      <span
        v-if="!loading2"
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose1(false)">取 消</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="submitForm"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="选择内外伸位"
      :visible.sync="dialogVisible2"
      width="60%"
      :before-close="handleClose2"
    >
      <el-form :inline="true">
        <el-form-item label="物料名称">
          {{ positionObj.MaterialName }}
        </el-form-item>
        <el-form-item label="当前库位">
          {{ positionObj.SpaceId }}
        </el-form-item>
        <el-form-item label="伸位">
          {{ positionObj.position }}
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData3"
        border
      >
        <el-table-column
          width="55"
          label="选择"
        >
          <template slot-scope="{row}">
            <el-checkbox
              v-model="row.checked"
              :disabled="row.position==='外'"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="SpaceId"
          label="库位号"
          min-width="20"
        />
        <el-table-column
          prop="position"
          label="伸位"
          min-width="20"
        />
        <el-table-column
          prop="MaterialName"
          label="物料名称"
          min-width="20"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose2(false)">取 消</el-button>
        <el-button
          type="primary"
          @click="submitLocation"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { wmsOutTasks, wmsOutTaskDetails, wmsCancelTask, wmsOutboundOrder } from '@/api/base_w_five'
// import request from '@/utils/request-zc'
import { wmsMaterials } from '@/api/jqy'
import { materialCount } from '@/api/base_w'
import page from '@/components/page'
import { debounce, checkPermission, setDate } from '@/utils'
import { wmsTunnels } from '@/api/base_w_four'
import { wmsStock, wmsWeightStock, wmsEntrance, wmsInstock } from '@/api/base_w_three'
export default {
  name: 'DeliveryBill',
  components: { page },
  data() {
    return {
      loading: false,
      search: {
        page_size: 10,
        page: 1
      },
      tableData: [],
      total: 0,
      options: [
        { name: '已创建', id: 1 },
        { name: '等待出库', id: 2 },
        { name: '出库中', id: 3 },
        { name: '已出库', id: 4 },
        { name: '异常出库', id: 5 },
        { name: '取消', id: 6 }
      ],
      options1: [],
      options2: [],
      optionsType: [
        { name: '生产正常出库', id: 1 },
        { name: 'mes指定库位出库', id: 2 },
        { name: 'mes指定重量出库', id: 3 },
        { name: '自主创建', id: 4 }
      ],
      dialogVisible: false,
      loading1: false,
      tableData1: [],
      dialogVisible1: false,
      formSearch: {
        quality_status: 1,
        is_entering: 'N',
        st_value: undefined,
        et_value: undefined
      },
      tableData2: [],
      tableData3: [],
      tableData4: [],
      EntranceCode: '',
      isLocation: '',
      tableData5: [{}],
      loading2: false,
      total1: 0,
      optionsEntrance: [],
      btnLoading: false,
      qualityStatus: [
        { id: 1, name: '合格' },
        { id: 2, name: '抽检中' },
        { id: 3, name: '不合格' },
        { id: 4, name: '过期' },
        { id: 5, name: '待检品' }
      ],
      taskStateList: {
        1: '待处理',
        2: '处理中',
        3: '完成',
        4: '已解绑',
        5: '取消',
        6: '异常',
        7: '盘点下架中',
        8: '盘点下架完成',
        9: '盘点上架中',
        10: '盘点下线',
        11: '盘点下线完成',
        12: '强制完成',
        13: '盘点确认无货',
        14: '检测下架',
        15: '检测下架完成',
        16: '检测上架中',
        17: '盘点上架移库中'
      },
      dialogVisible2: false,
      btnDisabled: false,
      positionObj: {},
      dateValue: [],
      btnExportLoad: false,
      TunnelNameList: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    const a = checkPermission(['material_outbound_record', 'unqualified'])
    const b = checkPermission(['material_outbound_record', 'untested'])

    if (!a) {
      this.qualityStatus = [{ id: 1, name: '合格' }]
      if (b) {
        this.qualityStatus.push({ id: 5, name: '待检品' })
      }
    }
  },
  methods: {
    checkPermission,
    async getProduct(val) {
      if (val) {
        try {
          const data = await materialCount('get', null, { params: { store_name: '原材料库' }})
          this.options2 = data || []
        } catch (e) {
        //
        }
      }
    },
    async getMaterialsList(val) {
      if (val) {
        try {
          const data = await wmsMaterials('get', null, { params: { all: 1 }})
          this.options1 = data || []
        } catch (e) {
        //
        }
      }
    },
    async getList() {
      this.loading = true
      this.tableData = []
      try {
        const data = await wmsOutTasks('get', null, { params: this.search })
        this.tableData = data.results || []
        this.total = data.count
      } catch (e) {
        //
      } this.loading = false
    },
    async getTunnelNameList(val) {
      if (val) {
        try {
          const data = await wmsTunnels('get')
          this.TunnelNameList = data || []
        } catch (e) {
        //
        }
      }
    },
    changeUnit(row) {
      row.WeightOfActualUnit = Math.round(row.Unit * row.avg_weight)
      if (row.WeightOfActualUnit > row.WeightOfActual) {
        row.WeightOfActualUnit = row.WeightOfActual
      }
    },
    getDebounce() {
      this.search.page = 1
      if (this.search.order_no) {
        this.search.order_no = this.search.order_no.trim()
      }
      debounce(this, 'getList')
    },
    getDialogDebounce() {
      if (this.formSearch.pallet_no) {
        this.formSearch.pallet_no = this.formSearch.pallet_no.trim()
      }
      if (this.formSearch.batch_no) {
        this.formSearch.batch_no = this.formSearch.batch_no.trim()
      }
      if (this.isLocation) {
        this.formSearch.page = 1
        debounce(this, 'getDialogGoods')
      } else {
        debounce(this, 'getWeight')
      }
    },
    getDialog() {
      if (this.isLocation) {
        this.formSearch.page = 1
        this.getDialogGoods()
      } else {
        this.getWeight()
      }
    },
    changeDate() {
      if (!this.search.State) {
        delete this.search.State
      }
      this.search.st = this.dateValue ? this.dateValue[0] : ''
      this.search.et = this.dateValue ? this.dateValue[1] : ''
      this.search.page = 1
      this.getList()
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    showEditDialog(row) {
      this.dialogVisible = true
      this.getDialogList(row.id)
    },
    cancelFun(row) {
      this.$confirm('是否确定取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await wmsCancelTask('post', null, { data: { 'task_num': row.order_no }})
          this.$message.success('操作成功')
        } catch (e) {
        //
        }
      })
    },
    async getDialogList(id) {
      this.loading1 = true
      try {
        const data = await wmsOutTaskDetails('get', null, { params: { page_size: 99999, task: id }})
        this.tableData1 = data.results || []
      } catch (e) {
        this.tableData1 = []
      } this.loading1 = false
    },
    async getDialogGoods() {
      try {
        this.loading2 = true
        const data = await wmsStock('get', null, { params: this.formSearch })
        this.tableData2 = data.results
        this.loading2 = false
        this.total1 = data.count
        if (this.tableData4.length > 0) {
          this.tableData2.forEach(d => {
            let arr = []
            arr = this.tableData4.filter(D => D.Sn === d.Sn)
            if (arr.length > 0) {
              d.btnDisabled = true
            } else {
              d.btnDisabled = false
            }
          })
        }
      } catch (error) {
        this.loading2 = false
      }
    },
    handleClose1(done) {
      this.dialogVisible1 = false
      this.tableData4 = []
      this.formSearch = {}
      this.formSearch.entrance_name = this.optionsEntrance[0].name
      this.formSearch.code = this.optionsEntrance[0].code
      this.formSearch.quality_status = 1
      this.formSearch.is_entering = 'N'
      this.formSearch.st_value = undefined
      this.formSearch.et_value = undefined
      this.EntranceCode = ''
      if (done) {
        done()
      }
    },
    showLocationDialog() {
      this.isLocation = true
      this.getEntrance()
      this.dialogVisible1 = true
    },
    showWeightDialog() {
      this.isLocation = false
      this.dialogVisible1 = true
      this.getEntrance()
    },
    async getWeight() {
      try {
        this.tableData5 = []
        this.loading2 = true
        const data = await wmsWeightStock('get', null, { params: this.formSearch })
        this.tableData5 = data.results
        this.loading2 = false
      } catch (error) {
        this.loading2 = false
      }
    },
    handleClose2(done) {
      this.dialogVisible2 = false
      if (done) {
        done()
      }
    },
    async setWmsInstock(row, index) {
      try {
        this.btnDisabled = true
        const data = await wmsInstock('get', null, {
          params: {
            material_no: row.MaterialCode, entrance_name: this.formSearch.entrance_name,
            space_id: row.SpaceId
          }
        })
        this.btnDisabled = false
        if (data.length > 0) {
          // 内伸位有货 弹弹框
          this.positionObj = row
          this.dialogVisible2 = true
          this.tableData3 = data
          this.tableData3.forEach(d => {
            if (d.position === '外') {
              d.checked = true
            } else {
              this.$set(d, 'checked', false)
            }
          })
        } else {
          this.showDialog(row, index, true)
        }
      } catch (error) {
        this.btnDisabled = false
      }
    },
    showDialog(row, index, bool) {
      if (row.position === '外' && !bool) {
        // 是外伸位
        this.setWmsInstock(row, index)
        return
      }
      this.$set(this.tableData2[index], 'btnDisabled', true)
      row.Quantity = 1
      row.TaskDetailNumber = 'MesD' + new Date().getTime()
      row.SpaceCode = row.SpaceId
      this.tableData4.push(row)
    },
    submitLocation() {
      const _table = []
      const preRow = this.tableData3[0].MaterialCode
      let bool
      this.tableData3.forEach((d, i) => {
        if (d.checked) {
          d.Quantity = 1
          d.TaskDetailNumber = 'MesD' + (new Date().getTime() + i)
          d.SpaceCode = d.SpaceId
          _table.push(d)
        }
        if (d.position === '内' && !d.checked) {
          // 内伸位有货
          bool = '1'
        } if (d.checked && d.MaterialCode !== preRow) {
          // 物料不一样
          bool = '2'
        }
      })
      if (bool === '1' || bool === '2') {
        this.$confirm(bool === '1' ? '建议内伸位也打钩出库,是否继续？' : '内伸位物料与所选择的物料不同，是否确定出库？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitLocationFor(_table)
        })
      } else {
        this.submitLocationFor(_table)
      }
    },
    submitLocationFor(_table) {
      const arr = _table.map(d => d.Sn)
      this.tableData2.forEach((d, i) => {
        const a = arr.indexOf(d.Sn)
        if (a > -1) {
          this.$set(this.tableData2[i], 'btnDisabled', true)
        }
      })
      _table.forEach(d => {
        const _arr = this.tableData4.filter(D => D.Sn === d.Sn)
        if (_arr.length === 0) {
          this.tableData4.push(d)
        }
      })
      this.dialogVisible2 = false
    },
    cancelDialog(row) {
      const arr = this.tableData4.filter(d => d.Sn !== row.Sn)
      this.tableData4 = arr
      this.tableData2.forEach(d => {
        if (d.Sn === row.Sn) {
          this.$set(d, 'btnDisabled', false)
        }
      })
    },
    currentChange1(page) {
      this.formSearch.page = page
      this.getDialogGoods()
    },
    changeEntrance(val) {
      let obj
      if (val) {
        obj = this.optionsEntrance.find(d => d.name && d.name === val)
      }
      if (obj.name === '烘房站台') {
        this.formSearch.is_entering = 'Y'
      } else {
        this.formSearch.is_entering = 'N'
      }
      this.formSearch.code = obj.code || ''
      if (this.isLocation) {
        this.tableData4 = []
        this.formSearch.page = 1
        this.getDialogGoods()
      } else {
        this.getWeight()
      }
      setCookie('entrance_namewms', this.formSearch.entrance_name, 9999)
      setCookie('codewms', this.formSearch.code, 9999)
    },
    async getEntrance() {
      try {
        this.loading2 = true
        const data = await wmsEntrance('get')
        this.optionsEntrance = data
        if (getCookie('entrance_namewms')) {
          this.formSearch.entrance_name = getCookie('entrance_namewms')
          this.formSearch.code = getCookie('codewms')
        } else {
          this.formSearch.entrance_name = data ? this.optionsEntrance[0].name : ''
          this.formSearch.code = data ? this.optionsEntrance[0].code : ''
        }
        if (this.formSearch.entrance_name === '烘房站台') {
          this.formSearch.is_entering = 'Y'
        } else {
          this.formSearch.is_entering = 'N'
        }
        if (this.isLocation) {
          this.getDialogGoods()
        } else {
          this.getWeight()
        }
      } catch (error) {
        //
      }
    },
    async submitForm() {
      const obj = {
        entrance_code: this.formSearch.code,
        outbound_data: JSON.parse(JSON.stringify(this.tableData4)),
        outbound_type: 1
      }
      if (!this.isLocation) {
        obj.outbound_type = 2
        const arr = []
        this.tableData5.forEach(d => {
          if (Number(d.WeightOfActualUnit) > 0) {
            const aaa = JSON.parse(JSON.stringify(d))
            aaa.WeightOfActual = aaa.WeightOfActualUnit
            aaa.StockDetailState = aaa.quality_status
            delete aaa.avg_weight
            delete aaa.quality_status
            delete aaa.quantity
            arr.push(aaa)
          }
        })
        obj.outbound_data = arr
      }
      if (obj.outbound_data.length === 0) {
        this.$message.info('未添加物料')
        return
      }
      this.btnLoading = true
      try {
        await wmsOutboundOrder('post', null, { data: obj })
        this.$message.success('添加成功')
        this.handleClose1(false)
        this.search.page = 1
        this.getList()
      } catch (error) {
        //
      } this.btnLoading = false
    },
    templateDownload() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      const _api = wmsOutTasks
      _api('get', null, { responseType: 'blob', params: obj })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = `原材料出库单据${setDate('', true)}.xlsx` // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    }
  }
}
function getCookie(cName) {
  if (document.cookie.length > 0) {
    var cStart = document.cookie.indexOf(cName + '=')
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1
      var cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) cEnd = document.cookie.length
      return document.cookie.substring(cStart, cEnd)
    }
  }
  return ''
}

// 设置cookie
function setCookie(cName, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = cName + '=' + value + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
}
</script>

<style>

</style>
