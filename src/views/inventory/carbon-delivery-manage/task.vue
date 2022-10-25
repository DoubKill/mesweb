<template>
  <div>
    <!-- 出库任务 -->
    <el-form :inline="true">
      <el-form-item label="出库单据号">
        <el-input v-model="search.task_order_no" clearable placeholder="请输入内容" @input="getDebounce" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="search.task_status" clearable placeholder="请选择" @change="changeDate">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="追踪码">
        <el-input v-model="search.lot_no" clearable placeholder="请输入内容" @input="getDebounce" />
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
        <!-- <el-input v-model="search.material_no" clearable placeholder="请输入内容" @input="getDebounce" /> -->
      </el-form-item>
      <el-form-item label="巷道">
        <el-select v-model="search.tunnel" filterable clearable placeholder="请选择" @change="changeDate">
          <el-option
            v-for="item in TunnelNameList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出库站台">
        <el-select v-model="search.entrance_name" filterable clearable placeholder="请选择" @change="changeDate">
          <el-option
            v-for="item in entranceList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库位码">
        <el-input v-model="search.location" clearable placeholder="请输入内容" @input="getDebounce" />
      </el-form-item>
      <el-form-item label="识别卡ID">
        <el-input v-model="search.pallet_no" clearable placeholder="请输入内容" @input="getDebounce" />
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="datetimerange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['08:00:00', '08:00:00']"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">刷新</el-button>
        <el-button type="primary" :loading="btnExportLoad" @click="exportTable">导出Excel</el-button>
      </el-form-item>
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
        width="50"
      />
      <el-table-column
        prop="task_order_no"
        label="出库单据号"
        min-width="20"
      />
      <el-table-column
        prop="order_no"
        label="下架任务号"
        min-width="20"
      />
      <el-table-column
        label="巷道编码"
        min-width="10"
      >
        <template slot-scope="{row}">
          {{ row.location?row.location.split('-')[1]:'' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="lot_no"
        label="追踪码"
        min-width="20"
      />
      <el-table-column
        prop="pallet_no"
        label="识别卡ID"
        min-width="20"
      />
      <el-table-column
        prop="location"
        label="库位码"
        min-width="20"
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
      <el-table-column
        prop="batch_no"
        label="批次号"
        min-width="20"
      />
      <el-table-column
        prop="created_time"
        label="创建时间"
        width="90"
      />
      <el-table-column
        prop="task_status"
        label="状态"
        width="70"
        :formatter="(row)=>{
          let obj = options.find(d=>d.id === row.task_status)
          return obj.name
        }"
      />
      <el-table-column
        prop="initiator"
        label="创建人"
        min-width="20"
      />
      <el-table-column
        prop="qty"
        label="数量"
        min-width="10"
      />
      <el-table-column
        prop="weight"
        label="重量"
        width="75"
      />
      <el-table-column
        prop="entrance_name"
        label="出库站台"
        min-width="18"
      />
    </el-table>
    <page
      v-if="!loading"
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { thOutTaskDetails } from '@/api/base_w_five'
import { thMaterials } from '@/api/jqy'
import { thTunnels } from '@/api/base_w_four'
import { thEntrance } from '@/api/base_w_three'
// import request from '@/utils/request-zc-th'
import page from '@/components/page'
import { debounce, setDate } from '@/utils'
export default {
  name: 'CarbonDeliveryTask',
  components: { page },
  data() {
    return {
      tableData: [],
      search: {
        page_size: 10,
        page: 1
      },
      options: [
        { name: '待处理', id: 1 },
        { name: '处理中', id: 2 },
        { name: '完成', id: 3 },
        { name: '已解绑', id: 4 },
        { name: '取消', id: 5 },
        { name: '异常', id: 6 },
        { name: '强制完成', id: 12 }
      ],
      options1: [],
      TunnelNameList: [],
      entranceList: [],
      datetimerange: [],
      loading: false,
      total: 0,
      btnExportLoad: false
    }
  },
  created() {
    this.getTunnelNameList()
    this.getEntranceList()
    this.getList()
  },
  methods: {
    async getMaterialsList(val) {
      if (val) {
        try {
          const data = await thMaterials('get', null, { params: { all: 1 }})
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
        const data = await thOutTaskDetails('get', null, { params: this.search })
        this.loading = false
        this.tableData = data.results || []
        this.total = data.count
      } catch (e) {
        //
      }
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    changeDate() {
      if (!this.search.task_status) {
        delete this.search.task_status
      }
      this.search.st = this.datetimerange ? this.datetimerange[0] : ''
      this.search.et = this.datetimerange ? this.datetimerange[1] : ''
      this.search.page = 1
      this.getList()
    },
    getDebounce() {
      this.search.page = 1
      debounce(this, 'getList')
    },
    async getTunnelNameList() {
      try {
        const data = await thTunnels('get')
        this.TunnelNameList = data || []
      } catch (e) {
        //
      }
    },
    async getEntranceList() {
      try {
        const data = await thEntrance('get')
        this.entranceList = data || []
      } catch (e) {
        //
      }
    },
    async exportTable() {
      if (!this.datetimerange || !this.datetimerange.length) {
        this.$message('请选择日期')
        return
      }
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      try {
        const data = await thOutTaskDetails('get', null, { responseType: 'blob', params: obj })
        const link = document.createElement('a')
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' })
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.download = `炭黑库-出库任务${setDate('', true)}.xlsx` // 下载的文件名
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.btnExportLoad = false
      } catch (e) {
        this.btnExportLoad = false
      }
    }
  }
}
</script>

<style>

</style>
