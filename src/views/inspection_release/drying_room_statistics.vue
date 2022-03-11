<template>
  <div>
    <!--原材料库 烘房信息统计查询 -->
    <el-form :inline="true">
      <el-form-item label="查询时间">
        <el-date-picker
          v-model="datetimerange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-input v-model="search.material_name" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input v-model="search.material_no" clearable @input="debounceFun" />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['drying_room_statistics','export']"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        prop="material_name"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="material_no"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        prop="zc_material_code"
        label="立库内未烘库存(托)"
        min-width="20"
      >
        <template slot-scope="scope">
          <!-- <el-link
            v-if="scope.row.material_name!=='合计'"
            type="primary"
            @click="DetailedList(scope.row)"
          >{{ scope.row.stock_qty }}</el-link> -->
          <span>{{ scope.row.stock_qty }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="batch_no"
        label="立库内烘完库存(托)"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.material_name!=='合计'"
            type="primary"
            @click="DetailedList(scope.row)"
          >{{ }}</el-link>
          <span v-else>{{ }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="underway_qty"
        label="输送途中物料(托)"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.material_name!=='合计'"
            type="primary"
            @click="DetailedList(scope.row,'3')"
          >{{ scope.row.underway_qty }}</el-link>
          <span v-else>{{ scope.row.underway_qty }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="baking_qty"
        label="正在烘(托)"
        min-width="10"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.material_name!=='合计'"
            type="primary"
            @click="DetailedList(scope.row,'4')"
          >{{ scope.row.baking_qty }}</el-link>
          <span v-else>{{ scope.row.baking_qty }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="finished_qty"
        label="已烘完(托)"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.material_name!=='合计'"
            type="primary"
            @click="DetailedList(scope.row,'5')"
          >{{ scope.row.finished_qty }}</el-link>
          <span v-else>{{ scope.row.finished_qty }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="indoor_qty"
        label="烘房内小计(托)"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.material_name!=='合计'"
            type="primary"
            @click="DetailedList(scope.row,'6')"
          >{{ scope.row.indoor_qty }}</el-link>
          <span v-else>{{ scope.row.indoor_qty }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="outbound_qty"
        label="已出烘房到二楼线体(托)"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.material_name!=='合计'"
            type="primary"
            @click="DetailedList(scope.row,'7')"
          >{{ scope.row.outbound_qty }}</el-link>
          <span v-else>{{ scope.row.outbound_qty }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="烘房胶料信息详细列表"
      :visible.sync="dialogVisible"
      width="90%"
    >
      <el-table
        v-loading="loadingView"
        :data="tableDataView"
        max-height="500"
        border
      >
        <el-table-column
          prop="oven_no"
          label="烘箱编号"
          width="80"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="80"
          :formatter="(row)=>{
            let obj = status.find(d=>d.id === row.status)
            return obj.name
          }"
        />
        <el-table-column
          prop="material_name"
          label="物料名称"
          min-width="20"
        />
        <el-table-column
          prop="material_no"
          label="物料编码"
          min-width="20"
        />
        <!-- <el-table-column
          prop="batch_no"
          label="批次号"
          min-width="20"
        /> -->
        <el-table-column
          prop="pallet_no"
          label="托盘号RFID"
          min-width="20"
        />
        <!-- <el-table-column
          prop="inbound_time"
          label="入库时间"
          min-width="20"
        />
        <el-table-column
          prop="outbound_time"
          label="出库时间"
          min-width="20"
        /> -->
        <el-table-column
          prop="baking_start_time"
          label="入烘房时间"
          min-width="20"
        />
        <el-table-column
          prop="baking_end_time"
          label="出烘房时间"
          min-width="20"
        />
        <!-- <el-table-column
          prop="confirm_time"
          label="二楼确认时间"
          min-width="20"
        /> -->
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import { debounce } from '@/utils'
import { exportExcel } from '@/utils/index'
// import page from '@/components/page'
import { hfStock, hfStockDetail } from '@/api/jqy'
export default {
  name: 'DryingRoomStatistics',
  components: { },
  data() {
    return {
      search: {},
      searchView: {},
      status: [
        { id: 1, name: '入库中' },
        { id: 2, name: '烘烤运行中' },
        { id: 3, name: '出库中' },
        { id: 4, name: '等待烘烤' },
        { id: 5, name: '等待出库' },
        { id: 6, name: '已出库' }
      ],
      dialogVisible: false,
      datetimerange: [getDay(-1) + ' ' + time(), getDay(0) + ' ' + time()],
      tableDataView: [],
      loadingView: false,
      tableData: [],
      loading: false
    }
  },
  created() {
    this.search.st = this.datetimerange[0]
    this.search.et = this.datetimerange[1]
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await hfStock('get', null, { params: this.search })
        this.tableData = data
        if (this.tableData.length > 0) {
          this.tableData.push({
            material_name: '合计',
            underway_qty: sum(this.tableData, 'underway_qty'),
            baking_qty: sum(this.tableData, 'baking_qty'),
            finished_qty: sum(this.tableData, 'finished_qty'),
            indoor_qty: sum(this.tableData, 'indoor_qty'),
            outbound_qty: sum(this.tableData, 'outbound_qty')
          })
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async DetailedList(row, val) {
      try {
        this.searchView.material_no = row.material_no
        this.searchView.st = this.search.st
        this.searchView.et = this.search.et
        this.searchView.data_type = val
        this.dialogVisible = true
        this.loadingView = true
        const data = await hfStockDetail('get', null, { params: this.searchView })
        this.tableDataView = data
        this.loadingView = false
      } catch (e) {
        this.loadingView = false
      }
    },
    changeDate(date) {
      this.search.st = date ? date[0] : ''
      this.search.et = date ? date[1] : ''
      this.changeList()
    },
    exportTable() {
      exportExcel('烘房胶料信息统计列表')
    },
    debounceFun() {
      debounce(this, 'getList')
    },
    changeList() {
      this.getList()
    }
  }
}
function getDay(day) {
  var today = new Date()
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(targetday_milliseconds)
  var tYear = today.getFullYear()
  var tMonth = today.getMonth()
  var tDate = today.getDate()
  tMonth = doHandleMonth(tMonth + 1)
  tDate = doHandleMonth(tDate)
  return tYear + '-' + tMonth + '-' + tDate
}
function doHandleMonth(month) {
  var m = month
  if (month.toString().length === 1) {
    m = '0' + month
  }
  return m
}
function time() {
  var d = new Date()
  var hour = d.getHours()// 得到小时数
  var minute = d.getMinutes()// 得到分钟数
  var second = d.getSeconds()// 得到秒数
  const h = hour < 10 ? '0' + hour : hour
  const m = minute < 10 ? '0' + minute : minute
  const s = second < 10 ? '0' + second : second
  return h + ':' + m + ':' + s
}
function sum(arr, params) {
  var s = 0
  arr.forEach(function(val, idx, arr) {
    const a = val[params] ? Number(val[params]) : 0
    s += a
  }, 0)
  s = Math.round(s * 100) / 100
  return s
}
</script>

<style lang="scss" scoped>

</style>
