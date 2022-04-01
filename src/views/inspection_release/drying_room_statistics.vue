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
          :default-time="['08:00:00', '08:00:00']"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="物料名称">
        <el-select v-model="search.material_name" allow-create filterable placeholder="请选择" clearable @visible-change="getMaterialsList" @change="changeList">
          <el-option
            v-for="item in options"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <!-- <el-input v-model="search.material_name" clearable @input="debounceFun" /> -->
      </el-form-item>
      <el-form-item label="物料编码">
        <el-select v-model="search.material_no" allow-create filterable placeholder="请选择" clearable @visible-change="getMaterialsList" @change="changeList">
          <el-option
            v-for="item in options"
            :key="item.code"
            :label="item.code"
            :value="item.code"
          />
        </el-select>
        <!-- <el-input v-model="search.material_no" clearable @input="debounceFun" /> -->
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['material_hf_summary','export']"
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
        width="220"
      />
      <el-table-column
        prop="material_no"
        label="物料编码"
        width="330"
      />
      <el-table-column
        align="center"
        label="入箱托数"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row,'1',scope.row.in_qty)"
          >{{ scope.row.in_qty }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="出箱托数"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row,'2',scope.row.out_qty)"
          >{{ scope.row.out_qty }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="stock_qty"
        label="立库内未烘库存(托)"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="stockList(scope.row)"
          >{{ scope.row.stock_qty }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="batch_no"
        label="立库内烘完库存(托)"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row)"
          >{{ }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="underway_qty"
        label="输送途中物料(托)"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row,'3',scope.row.underway_qty)"
          >{{ scope.row.underway_qty }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="underway_qty"
        label="等待烘烤(托)"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row,'8',scope.row.waiting_qty)"
          >{{ scope.row.waiting_qty }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="baking_qty"
        label="正在烘(托)"
        min-width="10"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row,'4',scope.row.baking_qty)"
          >{{ scope.row.baking_qty }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="finished_qty"
        label="已烘完(托)"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row,'5',scope.row.finished_qty)"
          >{{ scope.row.finished_qty }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="indoor_qty"
        label="烘房内小计(托)"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row,'6',scope.row.indoor_qty)"
          >{{ scope.row.indoor_qty }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="outbound_qty"
        label="已出烘房到二楼线体(托)"
        width="170"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row,'7',scope.row.outbound_qty)"
          >{{ scope.row.outbound_qty }}</el-link>
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
          width="100"
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
          width="380"
        />
        <!-- <el-table-column
          prop="batch_no"
          label="批次号"
          min-width="20"
        /> -->
        <el-table-column
          prop="pallet_no"
          label="托盘号RFID"
          width="120"
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
      <page
        v-if="pageIf"
        :old-page="false"
        :total="total1"
        :current-page="searchView.page"
        @currentChange="currentChange1"
      />
    </el-dialog>

    <el-dialog
      title="库存明细"
      :visible.sync="dialogVisibleList"
      width="90%"
    >
      <el-table
        v-loading="loadingView"
        :data="tableDataList"
        border
      >
        <el-table-column label="No" type="index" align="center" width="40" />
        <el-table-column label="物料名称" align="center" prop="material_name" min-width="35" />
        <el-table-column label="物料编码" align="center" prop="material_no" min-width="35" />
        <el-table-column label="质检条码" align="center" prop="lot_no" min-width="35" />
        <el-table-column label="批次号" align="center" prop="batch_no" min-width="16" />
        <el-table-column label="货位状态" align="center" prop="location_status" min-width="16" />
        <el-table-column label="托盘号" align="center" prop="container_no" min-width="18" />
        <el-table-column label="是否进烘房" align="center" prop="is_entering" min-width="16" />
        <el-table-column label="供应商" align="center" prop="supplier_name" min-width="16" />
        <el-table-column label="库存位" align="center" prop="location" min-width="18" />
        <el-table-column label="库存数" align="center" prop="qty" min-width="16" />
        <el-table-column label="单位" align="center" prop="unit" min-width="20" />
        <el-table-column label="单位重量" align="center" prop="unit_weight" min-width="16" />
        <el-table-column label="总重量" align="center" prop="total_weight" min-width="16" />
        <el-table-columnlabel="核酸管控" align="center" prop="in_charged_tag" min-width="16" />
        <el-table-column label="品质状态" align="center" prop="quality_status" min-width="15" />
        <el-table-column label="入库时间" align="center" prop="in_storage_time" min-width="15" />
        <el-table-column label="件数" align="center" prop="sl" min-width="15" />
        <el-table-columnlabel="唛头重量" align="center" prop="zl" min-width="15" />
      </el-table>
      <page
        :total="total"
        :current-page="getParams.page"
        @currentChange="currentChange"
      />
    </el-dialog>

  </div>
</template>

<script>
import { debounce } from '@/utils'
import { wmsMaterials } from '@/api/jqy'
import { exportExcel } from '@/utils/index'
import page from '@/components/page'
import { hfStock, hfStockDetail, wmsStorage } from '@/api/jqy'
export default {
  name: 'DryingRoomStatistics',
  components: { page },
  data() {
    return {
      search: {},
      searchView: {},
      getParams: { is_entering: 'Y' },
      status: [
        { id: 1, name: '入库中' },
        { id: 2, name: '烘烤运行中' },
        { id: 3, name: '出库中' },
        { id: 4, name: '等待烘烤' },
        { id: 5, name: '等待出库' },
        { id: 6, name: '已出库' }
      ],
      dialogVisible: false,
      total: 0,
      total1: 0,
      dialogVisibleList: false,
      datetimerange: [getDay(-1) + ' ' + '08:00:00', getDay(0) + ' ' + '08:00:00'],
      tableDataView: [],
      options: [],
      tableDataList: [],
      pageIf: false,
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
    async getMaterialsList(val) {
      if (val) {
        try {
          const data = await wmsMaterials('get', null, { params: { all: 1 }})
          this.options = data || []
        } catch (e) {
        //
        }
      }
    },
    async getList() {
      try {
        this.loading = true
        const data = await hfStock('get', null, { params: this.search })
        this.tableData = data
        if (this.tableData.length > 0) {
          this.tableData.push({
            material_name: '合计',
            in_qty: sum(this.tableData, 'in_qty'),
            out_qty: sum(this.tableData, 'out_qty'),
            stock_qty: sum(this.tableData, 'stock_qty'),
            underway_qty: sum(this.tableData, 'underway_qty'),
            waiting_qty: sum(this.tableData, 'waiting_qty'),
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
    async currentChange(page) {
      this.getParams.page = page
      try {
        this.loadingView = true
        const data = await wmsStorage('get', null, { params: this.getParams })
        this.tableDataList = data.results
        this.total = data.count
        this.loadingView = false
      } catch (e) {
        this.loadingView = false
      }
    },
    async currentChange1(page, page_size) {
      this.searchView.page = page
      this.searchView.page_size = page_size
      try {
        this.loadingView = true
        const data = await hfStockDetail('get', null, { params: this.searchView })
        this.total1 = data.count
        this.tableDataView = data.result
        this.loadingView = false
      } catch (e) {
        this.loadingView = false
      }
    },
    async stockList(row) {
      var arr = JSON.parse(JSON.stringify(this.tableData))
      arr.length = this.tableData.length - 1
      try {
        this.getParams.material_nos = ''
        if (row.material_name === '合计') {
          if (row.stock_qty === 0) {
            return
          }
          delete this.getParams.e_material_no
          arr.forEach(d => {
            if (d.stock_qty) {
              this.getParams.material_nos += d.material_no + ','
            } else {
              return
            }
          })
          this.getParams.material_nos = this.getParams.material_nos.substr(0, this.getParams.material_nos.length - 1)
        } else {
          delete this.getParams.material_nos
          this.getParams.e_material_no = row.material_no
        }
        this.dialogVisibleList = true
        this.loadingView = true
        const data = await wmsStorage('get', null, { params: this.getParams })
        this.tableDataList = data.results
        this.total = data.count
        this.loadingView = false
      } catch (e) {
        this.loadingView = false
      }
    },
    async DetailedList(row, val, num) {
      if (num === 0) {
        return
      }
      try {
        if (row.material_name === '合计') {
          this.searchView.material_no = ''
        } else {
          this.searchView.material_no = row.material_no
        }
        if (val === '1' || val === '2' || val === '7') {
          this.pageIf = true
          this.searchView.page = 1
          this.searchView.page_size = 10
        } else {
          this.pageIf = false
          this.searchView.page = 1
          this.searchView.page_size = 10000000
        }

        this.searchView.st = this.search.st
        this.searchView.et = this.search.et
        this.searchView.data_type = val
        this.dialogVisible = true
        this.loadingView = true
        const data = await hfStockDetail('get', null, { params: this.searchView })
        this.total1 = data.count
        this.tableDataView = data.result
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
// function time() {
//   var d = new Date()
//   var hour = d.getHours()// 得到小时数
//   var minute = d.getMinutes()// 得到分钟数
//   var second = d.getSeconds()// 得到秒数
//   const h = hour < 10 ? '0' + hour : hour
//   const m = minute < 10 ? '0' + minute : minute
//   const s = second < 10 ? '0' + second : second
//   return h + ':' + m + ':' + s
// }
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
