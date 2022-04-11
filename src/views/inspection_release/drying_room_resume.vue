<template>
  <div>
    <!-- 入出烘房履历 -->
    <el-form :inline="true">
      <el-form-item label="查询时间">
        <el-date-picker
          v-model="date_time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['08:00:00', '08:00:00']"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="入出烘房">
        <el-select v-model="search.inventory_type" placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in ['入烘房','出烘房']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
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
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="changeList"
        >查询</el-button>
        <el-button
          v-permission="['material_hf_summary','export']"
          v-loading="btnExportLoad"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        label="类别"
        min-width="20"
      >
        <template>
          {{ search.inventory_type }}
        </template>
      </el-table-column>
      <el-table-column
        prop="oven_no"
        label="烘箱编号"
        min-width="20"
      />
      <el-table-column
        label="状态"
        min-width="20"
        :formatter="(row)=>{
          return row.status
        }"
      />
      <el-table-column
        prop="material_name"
        label="物料名称"
        min-width="30"
      />
      <el-table-column
        prop="material_no"
        label="物料编码"
        min-width="30"
      />
      <el-table-column
        prop="batch_no"
        label="批次号"
        min-width="20"
      />
      <el-table-column
        prop="pallet_no"
        label="托盘号RFID"
        min-width="20"
      />
      <el-table-column
        v-if="search.inventory_type==='出烘房'"
        prop="baking_end_time"
        label="出烘房时间"
        min-width="30"
      />
      <el-table-column
        v-if="search.inventory_type==='入烘房'"
        prop="baking_start_time"
        label="入烘房时间"
        min-width="30"
      />
      <el-table-column
        prop="lot_no"
        label="质检条码"
        min-width="30"
      />
      <el-table-column
        prop="supplier"
        label="供应商"
        min-width="20"
      />
      <el-table-column
        prop="unit"
        label="单位"
        min-width="20"
      />
      <el-table-column
        prop="weight"
        label="单位重量"
        min-width="20"
      />
      <el-table-column
        prop="piece_count"
        label="件数"
        min-width="20"
      />
    </el-table>
    <page
      :old-page="false"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { wmsMaterials } from '@/api/jqy'
import { hfInventoryLog } from '@/api/base_w_five'
import page from '@/components/page'
export default {
  name: 'DryingRoomResume',
  components: { page },
  data() {
    return {
      date_time: [getDay(-1) + ' ' + '08:00:00', getDay(0) + ' ' + '08:00:00'],
      search: {
        st: '',
        et: '',
        inventory_type: '入烘房'
      },
      loading: false,
      tableData: [],
      options: [],
      total: 0,
      btnExportLoad: false,
      status: [
        { id: 1, name: '入库中' },
        { id: 2, name: '烘烤运行中' },
        { id: 3, name: '出库中' },
        { id: 4, name: '等待烘烤' },
        { id: 5, name: '等待出库' },
        { id: 6, name: '已出库' }
      ]
    }
  },
  created() {
    this.search.st = this.date_time[0]
    this.search.et = this.date_time[1]
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.tableData = []
        this.loading = true
        const data = await hfInventoryLog('get', null, { params: this.search })
        this.tableData = data.result
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
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
    changeDate(arr) {
      this.search.st = arr ? arr[0] : ''
      this.search.et = arr ? arr[1] : ''
      this.changeList()
    },
    changeList() {
      this.search.page = 1
      this.getList()
    },
    currentChange(page, page_size) {
      this.search.page = page
      this.search.page_size = page_size
      this.getList()
    },
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      delete obj.page
      delete obj.page_size
      hfInventoryLog('get', null, { responseType: 'blob', params: obj })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '原材料库-入出烘房履历.xlsx' // 下载的文件名
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
</script>

<style>

</style>
