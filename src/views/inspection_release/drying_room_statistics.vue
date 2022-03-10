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
          v-permission="['','']"
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
          <el-link
            type="primary"
            @click="DetailedList(scope.row)"
          >{{ scope.row.material_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="batch_no"
        label="立库内烘完库存(托)"
        min-width="20"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row)"
          >{{ scope.row.material_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="pdm_no"
        label="输送途中物料(托)"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row)"
          >{{ scope.row.material_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="unit"
        label="正在烘(托)"
        min-width="10"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row)"
          >{{ scope.row.material_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="quantity"
        label="已烘完(托)"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row)"
          >{{ scope.row.material_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="weight"
        label="烘房内小计(托)"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row)"
          >{{ scope.row.material_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="creater_time"
        label="已出烘房到二楼线体(托)"
        min-width="15"
      >
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="DetailedList(scope.row)"
          >{{ scope.row.material_name }}</el-link>
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
      title="烘房胶料信息详细列表"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="handleClose"
    >
      <el-table
        v-loading="loadingView"
        :data="tableDataView"
        max-height="500"
        border
      >
        <el-table-column
          prop="batch_no"
          label="烘箱编号"
          min-width="20"
        />
        <el-table-column
          prop="quality_status"
          label="状态"
          min-width="20"
        />
        <el-table-column
          prop="lot_no"
          label="物料名称"
          min-width="20"
        />
        <el-table-column
          prop="container_no"
          label="物料编码"
          min-width="20"
        />
        <el-table-column
          prop="location"
          label="批次号"
          min-width="20"
        />
        <el-table-column
          prop="in_storage_time"
          label="托盘号RFID"
          min-width="20"
        />
        <el-table-column
          prop="unit"
          label="入库时间"
          min-width="20"
        />
        <el-table-column
          prop="qty"
          label="出库时间"
          min-width="20"
        />
        <el-table-column
          prop="total_weight"
          label="入烘房时间"
          min-width="20"
        />
        <el-table-column
          prop="total_weight"
          label="出烘房时间"
          min-width="20"
        />
        <el-table-column
          prop="total_weight"
          label="二楼确认时间"
          min-width="20"
        />
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import { debounce } from '@/utils'
import { exportExcel } from '@/utils/index'
import page from '@/components/page'
import { wmsStorageSummary } from '@/api/jqy'
export default {
  name: 'DryingRoomStatistics',
  components: { page },
  data() {
    return {
      search: {
        page: 1,
        page_size: 10
      },
      searchView: {},
      total: 0,
      dialogVisible: false,
      datetimerange: [getDay(-1) + ' ' + time(), getDay(0) + ' ' + time()],
      tableDataView: [],
      loadingView: false,
      tableData: [{ material_name: 1 }],
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
        const data = await wmsStorageSummary('get', null, { params: this.search })
        this.tableData = data.results
        if (this.tableData.length > 0) {
          this.tableData.push({
            material_name: '合计',
            today_demanded: sum(this.tableData1, 'today_demanded'),
            current_stock: sum(this.tableData1, 'current_stock')
          })
        }
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async DetailedList(row) {
      try {
        this.searchView.material_name = row.material_name
        this.searchView.e_material_no = row.material_no
        this.searchView.zc_material_code = row.zc_material_code
        this.searchView.page_size = 1000000
        this.dialogVisible = true
        this.loadingView = true
        const data = await wmsStorageSummary('get', null, { params: this.searchView })
        this.tableDataView = data.results
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
      this.search.page = 1
      debounce(this, 'getList')
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
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
