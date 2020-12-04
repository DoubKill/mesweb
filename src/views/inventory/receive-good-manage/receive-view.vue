<template>
  <div class="app-container">
    <!-- 发货履历 -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="getParams.start_time"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select
          v-model="getParams.status"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in options1"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码">
        <material-code-select @changeSelect="materialCodeFun" />
      </el-form-item>
      <el-form-item label="发货类型">
        <deliverTypeSelect @changeSelect="deliverTypeSelectFun" />
      </el-form-item>
      <el-form-item label="目的地">
        <destinationSelect @changeSelect="destinationSelectFun" />
      </el-form-item>
    </el-form>
    <el-table
      border
      fit
      :cell-style="cellStyle"
      style="width: 100%"
      :data="tableData"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="创建时间" align="center" prop="created_date" />
      <el-table-column label="目的地" align="center" prop="dispatch_location_name" />
      <el-table-column label="发货单号" align="center">
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" @click="showDetail(scope.row.order_no)">{{ scope.row.order_no }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="发货类型" align="center" prop="dispatch_type_name" />
      <el-table-column label="物料编码" align="center" prop="material_name" />
      <el-table-column label="发货数量" align="center" prop="need_qty" />
      <el-table-column label="已发数量" align="center" prop="actual_qty" />
      <el-table-column label="发货重量" align="center" prop="need_weight" />
      <el-table-column label="已发重量" align="center" prop="actual_weight" />
      <el-table-column label="订单状态" align="center" prop="status_name" />
      <el-table-column label="发起人" align="center" prop="dispatch_user" />
      <el-table-column label="完成时间" align="center" prop="fin_time" />
    </el-table>
    <page
      :total="total"
      :current-page="getParams.page"
      @currentChange="currentChange"
    />
    <el-dialog
      title="发货明细"
      width="80%"
      :visible.sync="detailDialogVisible"
      :close-on-click-modal="false"
    >
      <el-table
        border
        fit
        style="width: 100%"
        :data="detailTable"
      >
        <el-table-column label="No" type="index" align="center" />
        <el-table-column label="创建时间" align="center" prop="created_date" />
        <el-table-column label="发货单号" align="center" prop="order_no" />
        <el-table-column label="物料编码" align="center" prop="material_no" />
        <el-table-column label="lot_no" align="center" prop="lot_no" />
        <el-table-column label="托盘号" align="center" prop="pallet_no" />
        <el-table-column label="单托重量" align="center" prop="weight" />
        <el-table-column label="发货人" align="center" prop="dispatch_user" />
        <el-table-column label="发货时间" align="center" prop="order_created_time" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            {{ scope.row.status===1?'发货':'撤销' }}
          </template>
        </el-table-column>
      </el-table>
      <page
        :total="totalDetail"
        :current-page="detailParams.page"
        @currentChange="currentChangeDetail"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getDispatchPlan, getDispatchLog } from '@/api/receive'
import { setDate } from '@/utils/index'
import page from '@/components/page'
import commitVal from '@/utils/common'
import MaterialCodeSelect from '@/components/materialCodeSelect'
import deliverTypeSelect from '@/components/select_w/deliverTypeSelect'
import destinationSelect from '@/components/select_w/destinationSelect'
export default {
  components: { page, MaterialCodeSelect, deliverTypeSelect, destinationSelect },
  data() {
    return {
      tableData: [],
      detailTable: [],
      options1: commitVal.statusList,
      getParams: {
        start_time: setDate(),
        page: 1
      },
      detailParams: {
        page: 1
      },
      detailDialogVisible: false,
      total: 1,
      totalDetail: 1
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      getDispatchPlan(this.getParams).then(response => {
        this.tableData = response.results
        this.total = response.count
      })
    },
    changeList() {
      this.getParams.page = 1
      this.getTableData()
    },
    materialCodeFun(val) {
      this.getParams.material = val
      this.getParams.page = 1
      this.getTableData()
    },
    deliverTypeSelectFun(val) {
      this.getParams.dispatch_type = val
      this.getParams.page = 1
      this.getTableData()
    },
    destinationSelectFun(val) {
      this.getParams.dispatch_location = val
      this.getParams.page = 1
      this.getTableData()
    },
    getDetailTable() {
      getDispatchLog(this.detailParams).then(response => {
        this.detailTable = response.results
        this.totalDetail = response.count
      })
    },
    showDetail(order_no) {
      console.log(order_no)
      this.detailParams.order_no = order_no
      this.detailParams.page = 1
      this.detailDialogVisible = true
      this.getDetailTable()
    },
    currentChange(page) {
      this.getParams.page = page
      this.getTableData()
    },
    currentChangeDetail(page) {
      this.detailParams.page = page
      this.getDetailTable()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      var cc = column.property
      if (row[cc] && cc === 'status_name') {
        if (row[cc] === '关闭') {
          return 'color: #888888'
        }
        if (row[cc] === '新建') {
          return 'color: #000093'
        }
        if (row[cc] === '执行中') {
          return 'color: #F5A623'
        }
        if (row[cc] === '完成') {
          return 'color: #7ED321'
        }
        if (row[cc] === '失败') {
          return 'color: #FF0000'
        }
      }
    }
  }
}
</script>

<style>

</style>
