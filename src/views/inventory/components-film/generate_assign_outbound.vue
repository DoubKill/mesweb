<template>
  <div class="assOutbound">
    <!-- 指定出库 混炼终练使用-->
    <el-form :inline="true">
      <el-form-item label="单据号">
        <el-input
          v-model="order_no"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="需求数量">
        <el-input
          v-model="need_qty"
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
      <br>
      <el-form-item label="品质状态">
        <el-select
          v-model="getParams.quality_status"
          :disabled="true"
          placeholder="请选择品质状态"
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
      <el-form-item>
        <el-button type="primary" @click="getTableData">查询</el-button>
        <el-button type="primary" :loading="loadingBtn" @click="submitFun">确 定</el-button>
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
      <el-table-column :key="6" label="处理意见" align="center" prop="deal_suggestion" />
    </el-table>
    <el-alert
      style="color:black"
      title="表格背景色说明：红色超期报警；黄色超期预警；白色放置期正常；灰色未设置有效期"
      type="success"
    />
    <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="visibleMethod(true)">取 消</el-button>
      <el-button type="primary" :loading="loadingBtn" @click="submitFun">确 定</el-button>
    </div> -->
  </div>
</template>

<script>
import { outbound } from '@/api/jqy'
import { checkPermission } from '@/utils'
import { bzMixinInventory, bzFinalInventory } from '@/api/material-inventory-manage'
import page from '@/components/page'
import selectEquip from '@/components/select_w/equip'
// import { stationInfo, stationInfoRawMaterial, drussPlanManagementStations } from '@/api/warehouse'
export default {
  components: { page, selectEquip },
  props: {
    warehouseName: {
      type: String,
      default: ''
    },
    list: {
      type: Object,
      default() {
        return {}
      }
    },
    warehouseInfo: {
      type: Number,
      default: null
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
      tableData: [],
      getParams: {
        page: 1,
        location_status: '有货货位'
      },
      period_of_validity: '',
      currentPage: 1,
      total: 0,
      options: ['一等品', '三等品', '待检品'],
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
      dateSearch: [],
      qtyTotal: 0,
      weightTotal: 0,
      qty_total: '',
      weight_total: '',
      loading: false,
      multipleSelection: [],
      loadingBtn: false,
      handleSelection: [],
      station: '',
      id: ''
    }
  },
  computed: {
  },
  watch: {
    show(bool) {
      if (bool) {
        this.period_of_validity = this.list.period_of_validity || null
        this.order_no = this.list.order_no || null
        this.need_qty = this.list.need_qty || null
        this.warehouse = this.list.warehouse || null
        this.station = this.list.station || null
        this.getParams.quality_status = this.list.quality_status || null
        this.getParams.material_no = this.list.product_no || null
        this.id = this.list.id || null
        this.tableData = []
        this.getTableData()
      }
    }
  },
  created() {
    this.period_of_validity = this.list.period_of_validity || null
    this.order_no = this.list.order_no || null
    this.need_qty = this.list.need_qty || null
    this.warehouse = this.list.warehouse || null
    this.station = this.list.station || null
    this.getParams.quality_status = this.list.quality_status || null
    this.getParams.material_no = this.list.product_no || null
    this.id = this.list.id || null
    this.getTableData()
  },
  methods: {
    checkPermission,
    getTableData() {
      if (this.warehouseName === '混炼胶库') {
        this.getParams.station = this.list.station
      } else {
        delete this.getParams.station
      }
      this.qtyTotal = 0
      this.weightTotal = 0
      this.loading = true
      console.log(this.warehouseName)
      const _api = this.warehouseName === '混炼胶库' ? bzMixinInventory : bzFinalInventory
      _api(this.getParams)
        .then(response => {
          this.tableData = response.results
          this.total = response.count
          this.qty_total = response.total_trains
          this.weight_total = response.total_weight
          this.tableData.forEach(D => {
            this.qtyTotal += Number(D.qty)
            this.weightTotal += Number(D.total_weight)
          })
          this.tableData.forEach(D => {
            D.warehouse = this.warehouse
          })
          this.tableData.push({ warehouse: '单页小计', qty: this.qtyTotal, total_weight: this.weightTotal.toFixed(3) },
            { warehouse: '汇总', qty: this.qty_total, total_weight: this.weight_total })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    },
    async submitFun() {
      console.log(this.multipleSelection)
      if (this.multipleSelection.length === 0) {
        this.$message.info('请选择出库')
        return
      } else {
        const obj = []
        this.multipleSelection.forEach(d => {
          obj.push({ pallet_no: d.container_no,
            location: d.location,
            lot_no: d.lot_no,
            memo: d.memo,
            qty: d.qty,
            weight: d.total_weight,
            quality_status: d.quality_status,
            inventory_time: d.in_storage_time,
            outbound_delivery_order: this.id })
        })
        try {
          this.loadingBtn = true
          await outbound('post', null, { data: obj })
          this.loadingBtn = false
          this.$message.success('出库成功')
          this.$refs.multipleTable.clearSelection()
          this.visibleMethod(true)
          this.$emit('getList')
          // this.getTableData()
        } catch (error) {
          this.loadingBtn = false
        }
      }
    },
    currentChange(page) {
      this.currentPage = page
      this.getParams.page = page
      this.getTableData()
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
      if (row.warehouse === '单页小计' || row.warehouse === '汇总') { // 判断条件
        return false // 不可勾选
      } else {
        return true // 可勾选
      }
    },
    quality_statusSearch() {
      this.getParams.page = 1
      this.getTableData()
    },
    searchDate(arr) {
      console.log(arr)
      this.getParams.st = arr ? arr[0] : ''
      this.getParams.et = arr ? arr[1] : ''
      this.getTableData()
    },
    creadVal() {
    },
    visibleMethod(bool) {
      if (bool) {
        this.creadVal()
        this.$emit('visibleMethod')
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="scss" >
.assOutbound{
  .dialog-footer{
    width:100%;
    text-align: right;
  }
  .el-table .warn-row {
    background: #F5F7FA;
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
