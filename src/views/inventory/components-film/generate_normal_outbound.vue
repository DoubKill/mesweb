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
      <el-form-item label="品质状态">
        <el-select
          v-model="getParams.quality_status"
          :disabled="unqualified"
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
      <el-table-column :key="2" label="货位地址" align="center" prop="location" />
      <el-table-column :key="3" label="物料编码" align="center" prop="material_no" />
      <el-table-column :key="4" label="物料名称" align="center" prop="material_no" />
      <el-table-column :key="5" label="托盘号" align="center" prop="container_no" />
      <el-table-column :key="6" label="品质状态" align="center" prop="quality_status" />
      <el-table-column :key="7" width="60" label="车数/托" align="center" prop="qty" />
      <el-table-column :key="8" label="重量kg" align="center" prop="total_weight" />
      <el-table-column :key="9" label="入库时间" align="center" prop="in_storage_time" />
    </el-table>
    <el-alert
      style="color:black"
      title="表格背景色说明：红色超期报警；黄色超期预警；白色放置期正常；灰色未设置有效期"
      type="success"
    />
  </div>
</template>
<script>
import { outbound } from '@/api/jqy'
import { checkPermission } from '@/utils'
import { bzFinalInventorySearch, bzMixinInventorySearch } from '@/api/base_w_four'
export default {
  components: { },
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
        quality_status: '一等品',
        need_qty: 99999
      },
      need_qty: 0,
      period_of_validity: '',
      dateSearch: [],
      unqualified: true,
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
        if (checkPermission(['product_outbound_plan', 'unqualified'])) {
          this.unqualified = false
        }
        this.getParams = {
          quality_status: '一等品',
          need_qty: 99999
        }
        this.period_of_validity = this.list.period_of_validity || null
        this.order_no = this.list.order_no || null
        this.warehouse = this.list.warehouse || null
        this.station = this.list.station || null
        this.getParams.material_no = this.list.product_no || null
        this.id = this.list.id || null
        this.tableData = []
        this.getTableData()
      }
    }
  },
  created() {
    if (checkPermission(['product_outbound_plan', 'unqualified'])) {
      this.unqualified = false
    }
    this.period_of_validity = this.list.period_of_validity || null
    this.order_no = this.list.order_no || null
    this.warehouse = this.list.warehouse || null
    this.station = this.list.station || null
    this.getParams.material_no = this.list.product_no || null
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
      this.$refs.multipleTable.toggleAllSelection()
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
      if (row.warehouse === '汇总') { // 判断条件
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
