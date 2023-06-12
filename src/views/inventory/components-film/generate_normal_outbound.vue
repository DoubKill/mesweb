<template>
  <div class="generate_normal_outbound">
    <!-- 正常出库 -->
    <el-form :inline="true">
      <el-form-item label="单据号">
        <el-input
          v-model="order_no"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="库区">
        <el-input
          v-model="warehouse"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="出库口">
        <el-input
          v-model="station"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="品质状态">
        <el-select
          v-model="getParams.quality_status"
          style="width:120px"
          :disabled="true"
          placeholder="请选择"
          clearable
          @change="quality_statusSearch"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入库起止时间">
        <el-date-picker
          v-model="dateSearch"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          @change="searchDate"
        />
      </el-form-item>
      <el-form-item label="机台">
        <selectEquip
          :equip_no_props.sync="getParams.equip_no"
          @changeSearch="quality_statusSearch"
        />
      </el-form-item>
      <el-form-item label="车次">
        <el-input-number v-model="getParams.begin_trains" controls-position="right" :min="1" :max="getParams.end_trains" @change="quality_statusSearch" />-
        <el-input-number v-model="getParams.end_trains" controls-position="right" :min="getParams.begin_trains" :max="99999" @change="quality_statusSearch" />
      </el-form-item>
      <br>
      <el-form-item label="巷道">
        <el-select
          v-model="getParams.tunnel"
          placeholder="请选择巷道"
          clearable
          @change="quality_statusSearch"
        >
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="指定出库数量(必填)">
        <el-input
          v-model="getParams.need_qty"
          on-keypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
          type="number"
        />
      </el-form-item>
      <el-form-item label="可用库存数">
        <el-input
          v-model="qty_total"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="quality_statusSearch1">查询</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitDialog">确 定</el-button>
        <el-button type="primary" @click="visibleMethod(true)">取 消</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      border
      style="width: 100%"
      :row-class-name="tableRowClassName"
      :data="tableData"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        :selectable="select"
        :reserve-selection="true"
      />
      <el-table-column :key="1" label="库房" width="80" align="center" prop="warehouse" />
      <el-table-column :key="4" label="物料名称" align="center" prop="material_no" />
      <el-table-column :key="3" label="机台" align="center" prop="equip_no" />
      <el-table-column :key="7" width="60" label="车次" align="center" prop="memo" />
      <el-table-column :key="8" label="重量kg" align="center" prop="total_weight" />
      <el-table-column :key="2" label="货位地址" align="center" prop="location" />
      <el-table-column :key="5" label="托盘号" align="center" prop="container_no" />
      <el-table-column :key="9" label="入库时间" align="center" prop="in_storage_time" />
      <el-table-column :key="6" label="品质状态" align="center" prop="quality_status" />
      <el-table-column :key="10" label="处理意见" align="center" prop="deal_suggestion" />
      <el-table-column :key="11" label="锁定状态" align="center" prop="deal_suggestion">
        <template v-if="row.locked_status" slot-scope="{row}">
          {{ row.locked_status===1?'工艺锁定':row.locked_status===2?'快检锁定':'工艺/快检锁定' }}
        </template>
      </el-table-column>
    </el-table>
    <el-alert
      style="color:black"
      title="表格背景色说明：红色超期报警；黄色超期预警；白色放置期正常；灰色未设置有效期"
      type="success"
    />

    <el-dialog
      title="胶料出库目的地选择"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :before-close="closeDialog"
      width="30%"
    >
      <el-form>
        <el-form-item label="胶料出库目的地">
          <el-select
            v-model="destination"
            style="width: 100%"
            placeholder="请选择"
            @visible-change="getDestinationList"
          >
            <el-option
              v-for="item in destinationList"
              :key="item.id"
              :value="item.global_name"
              :label="item.global_name"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="submitFun"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { outbound } from '@/api/jqy'
import { checkPermission } from '@/utils'
import { globalCodesUrl } from '@/api/base_w'
import { bzFinalInventorySearch, bzMixinInventorySearch } from '@/api/base_w_four'
import selectEquip from '@/components/select_w/equip'
export default {
  components: { selectEquip },
  props: {
    warehouseName: {
      type: String,
      default() {
        return ''
      }
    },
    list: {
      type: Object,
      default() {
        return {}
      }
    },
    warehouseInfo: {
      type: Number,
      default() {
        return null
      }
    },
    getList: {
      type: Function,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      getParams: {
        need_qty: 99999
      },
      need_qty: 0,
      dialogVisible: false,
      destination: null,
      destinationList: [],
      period_of_validity: '',
      dateSearch: [],
      qty_total: 0,
      options1: [{
        value: '1',
        label: '1#巷道'
      }, {
        value: '2',
        label: '2#巷道'
      }, {
        value: '3',
        label: '3#巷道'
      }, {
        value: '4',
        label: '4#巷道'
      }],
      loading: false,
      loadingBtn: false,
      tableData: [],
      multipleSelection: [],
      options: ['一等品', '三等品', '待检品']
    }
  },
  watch: {
    show(bool) {
      if (bool) {
        this.getParams = {
          need_qty: 99999
        }
        this.multipleSelection = []
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection()
        }
        this.period_of_validity = this.list.period_of_validity || null
        this.order_no = this.list.order_no || null
        this.warehouse = this.list.warehouse || null
        this.station = this.list.station || null
        this.getParams.quality_status = this.list.quality_status || null
        this.getParams.material_no = this.list.product_no || null
        this.getParams.outbound_order_id = this.list.id || null
        this.id = this.list.id || null
        this.tableData = []
        this.getTableData()
      }
    }
  },
  created() {
    this.period_of_validity = this.list.period_of_validity || null
    this.order_no = this.list.order_no || null
    this.warehouse = this.list.warehouse || null
    this.station = this.list.station || null
    this.getParams.quality_status = this.list.quality_status || null
    this.getParams.material_no = this.list.product_no || null
    this.getParams.outbound_order_id = this.list.id || null
    this.id = this.list.id || null
    this.tableData = []
    this.getTableData()
  },
  methods: {
    checkPermission,
    // getTableData1() {
    //   if (this.getParams.need_qty !== '') {
    //     this.quality_statusSearch1()
    //   } else {
    //     this.$refs.multipleTable.clearSelection()
    //     this.getParams.need_qty = (this.need_qty !== 0 ? this.need_qty : 99999)
    //     this.getTableData()
    //   }
    // },
    submitDialog() {
      if (this.multipleSelection.length === 0) {
        this.$message.info('请选择出库')
        return
      } else {
        this.dialogVisible = true
      }
    },
    closeDialog() {
      this.destination = null
      this.dialogVisible = false
    },
    async getDestinationList() {
      try {
        const data = await globalCodesUrl('get', {
          params: {
            class_name: '胶料出库目的地'
          }
        })
        this.destinationList = data.results || []
      } catch (error) {
        //
      }
    },
    async getTableData() {
      if (this.warehouseName === '混炼胶库') {
        this.getParams.station = this.list.station
      } else {
        delete this.getParams.station
      }
      this.qtyTotal = 0
      this.weightTotal = 0
      this.loading = true
      const _api = this.warehouseName === '混炼胶库' ? bzMixinInventorySearch : bzFinalInventorySearch
      try {
        const data = await _api('get', null, { params: this.getParams })
        this.tableData = data.data
        this.qty_total = data.total_trains
        this.tableData.forEach(D => {
          this.qtyTotal += Number(D.qty)
          this.weightTotal += Number(D.total_weight)
        })
        this.tableData.forEach(D => {
          D.warehouse = this.warehouse
        })
        this.$refs.multipleTable.clearSelection()
        this.tableData.push({ warehouse: '汇总', qty: this.qtyTotal, total_weight: this.weightTotal.toFixed(3) })
        this.handleSelectionChange()
        this.loading = false
      } catch (error) {
        this.loading = false
      }
      if (this.tableData.length > 1) {
        this.$refs.multipleTable.toggleAllSelection()
      }
    },
    async submitFun() {
      if (this.multipleSelection.length === 0) {
        this.$message.info('请选择出库')
        return
      } else {
        const obj = []
        this.multipleSelection.forEach(d => {
          obj.push({ pallet_no: d.container_no,
            location: d.location,
            lot_no: d.lot_no,
            destination: this.destination,
            memo: d.memo,
            qty: d.qty,
            weight: d.total_weight,
            quality_status: d.quality_status,
            inventory_time: d.in_storage_time,
            product_no: d.material_no,
            outbound_delivery_order: this.id })
        })
        try {
          this.loadingBtn = true
          await outbound('post', null, { data: obj })
          this.loadingBtn = false
          this.$message.success('出库成功')
          this.$refs.multipleTable.clearSelection()
          this.dialogVisible = false
          this.visibleMethod(true)
          this.$emit('getList')
        } catch (error) {
          this.loadingBtn = false
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      const time = new Date(row.in_storage_time)
      var nowTime = new Date()
      var timeDifference = nowTime.getTime() - time.getTime()
      var days = timeDifference / (24 * 3600 * 1000)
      if (this.period_of_validity >= 0 && this.period_of_validity !== null) {
        if (days >= (0.5 * this.period_of_validity) && days < this.period_of_validity) {
          return 'warning-row'
        } else if (days >= this.period_of_validity) {
          return 'maxwarning-row'
        } else { return 'summary-cell-style' }
      } else {
        if (days) {
          return 'warn-row'
        } else {
          return 'summary-cell-style'
        }
      }
    },
    select(row, index) {
      if (row.warehouse === '汇总' || row.locked_status === 1 || row.locked_status === 2 || row.locked_status === 3) { // 判断条件
        return false // 不可勾选
      } else {
        return true // 可勾选
      }
    },
    quality_statusSearch() {
      this.$refs.multipleTable.clearSelection()

      this.getParams.page = 1
      this.getParams.need_qty = 99999
      this.getTableData()
    },
    quality_statusSearch1() {
      if (this.getParams.need_qty === '' || this.getParams.need_qty <= 0) {
        this.$message.info('请填写大于0的指定出库数量，再点击查询')
      } else {
        if (this.multipleSelection !== undefined) {
          if ((this.tableData.length - 1) === this.multipleSelection.length) {
            this.$refs.multipleTable.toggleAllSelection()
            this.getParams.page = 1
            this.getTableData()
          } else {
            this.tableData = []
            this.multipleSelection = []
            this.getParams.page = 1
            this.getTableData()
          }
        } else {
          this.$message.info('可用库存为0')
        }
      }
    },
    searchDate(arr) {
      this.$refs.multipleTable.clearSelection()
      this.getParams.need_qty = 99999
      // this.getParams.need_qty = (this.need_qty !== 0 && this.need_qty !== '') ? this.need_qty : 99999
      this.getParams.st = arr ? arr[0] : ''
      this.getParams.et = arr ? arr[1] : ''
      this.getTableData()
    },
    creadVal() {
      this.$refs.multipleTable.clearSelection()
    },
    visibleMethod(bool) {
      if (bool) {
        this.creadVal()
        this.$emit('visibleMethod')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.getParams.need_qty = 0
      this.multipleSelection.forEach(d => {
        this.getParams.need_qty += Number(d.qty)
      })
    }
  }}
</script>

<style lang="scss">
.generate_normal_outbound{
  // .el-input{
    // width:280px;
  // }
  // .el-select{
    // width:280px;
  // }
  .dialog-footer{
    margin-top: 20px;
    width:100%;
    text-align: right;
  }
  .el-input-number{
     width:auto;
  }
  .el-table .warn-row {
    background:   #F5F7FA;
  }
  .el-table .warning-row {
    background: #e6a23c;
  }
  .el-table .maxwarning-row {
    background: red;
    color:white;
  }
  .el-table__row:hover > td {
    background-color: transparent !important;
  }
  .el-table__row--striped:hover > td {
    background-color: transparent !important;
  }}
</style>
