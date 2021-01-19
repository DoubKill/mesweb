<template>
  <div v-loading="loading" class="app-container">
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="searchDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          v-model="search.type"
          placeholder="请选择"
          clearable
          @change="changeList"
        >
          <el-option
            v-for="item in options1"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出库/入库">
        <el-select
          v-model="search.order_type"
          placeholder="请选择"
          clearable
          @change="changeList"
        >
          <el-option
            v-for="item in ['出库','入库']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库存位置">
        <warehouseSelect :is-clear="true" @changSelect="warehouseSelectFun" />
        <!-- <el-select v-model="search.b" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input v-model="search.material_no" @input="changeList" />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      fit
    >
      <el-table-column label="No" type="index" align="center" width="40" />
      <el-table-column label="类型" align="center" prop="order_type" width="50" />
      <el-table-column label="出入库单号" align="center" prop="order_no" />
      <el-table-column label="仓库类型" align="center" prop="warehouse_type" />
      <el-table-column label="托盘号" align="center" prop="pallet_no" />
      <el-table-column label="物料编码" align="center" prop="material_no" />
      <el-table-column label="出入库原因" align="center" prop="inout_reason" />
      <el-table-column label="出入库类型" align="center" prop="inout_num_type" />
      <el-table-column label="出入库数" align="center" prop="qty" width="50" />
      <el-table-column label="单位" align="center" prop="unit" width="40" />
      <el-table-column label="重量" align="center" prop="weight" width="80" />
      <el-table-column label="发起人" align="center" prop="initiator" width="80" />
      <el-table-column label="发起时间" align="center" prop="fin_time" />
      <el-table-column label="完成时间" align="center" prop="end_time" />
    </el-table>
    <page
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>
<script>
import { inventoryLog } from '@/api/base_w'
import page from '@/components/page'
import warehouseSelect from '@/components/select_w/warehouseSelect'
import { setDate } from '@/utils'
export default {
  components: { page, warehouseSelect },
  data() {
    return {
      search: {
        page: 1
      },
      searchDate: [setDate(null, true), setDate(null, true)],
      total: 0,
      loading: false,
      options1: ['指定出库', '正常出库'],
      options2: [],
      tableData: [
        {
          a: 1,
          b: 2
        }
      ]
    }
  },
  created() {
    this.search.start_time = setDate(null, true)
    this.search.end_time = setDate(null, true)
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await inventoryLog('get', null, { params: this.search })
        this.tableData = data.results
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    changeDate(val) {
      this.search.start_time = val ? val[0] : ''
      this.search.end_time = val ? val[1] : ''
      this.search.page = 1
      this.getList()
    },
    warehouseSelectFun(val) {
      this.search.page = 1
      this.search.store_name = val ? val.name : ''
      this.getList()
    },
    changeList() {
      this.search.page = 1
      this.getList()
    }
  }
}
</script>

<style>

</style>
