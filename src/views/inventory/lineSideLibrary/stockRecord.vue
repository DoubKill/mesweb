<template>
  <div>
    <!--线边库 库存查询 -->
    <el-form :inline="true">
      <el-form-item label="胶料编码:">
        <el-select v-model="search.product_no" clearable filterable placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in tableData"
            :key="item.id"
            :label="item.product_no"
            :value="item.product_no"
          />
        </el-select>
        <!-- <all-product-no-select @productBatchingChanged="productBatchingChanged" /> -->
      </el-form-item>
      <el-form-item label="库区:">
        <el-select v-model="search.depot" clearable filterable placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.depot_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库位:">
        <el-select v-model="search.depot_site" clearable filterable placeholder="请选择" @change="changeList">
          <el-option
            v-for="item in options1"
            :key="item.id"
            :label="item.depot_site_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-row v-loading="loading">
      <el-col :span="10">
        <el-table
          ref="singleTable"
          :data="tableData"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column
            prop="product_no"
            label="胶料编码"
          />
          <el-table-column
            prop="num"
            label="现存数量/托"
          />
          <el-table-column
            prop="trains"
            label="车数"
          />
          <el-table-column
            prop="actual_weight"
            label="重量"
          />
        </el-table>
      </el-col>
      <el-col :span="14">
        <el-table
          v-loading="loading1"
          :data="tableData1"
          border
        >
          <el-table-column
            prop="depot_name"
            label="库区"
          />
          <el-table-column
            prop="depot_site_name"
            label="库位"
          />
          <el-table-column
            prop="enter_time"
            label="入库时间"
          />
          <el-table-column
            prop="date"
            label="生产信息"
          />
          <el-table-column
            prop="date"
            label="快检信息"
          />
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import allProductNoSelect from '@/components/select_w/allProductNoSelect'
import { depot, depotSite, depotPallet, depotPalletInfo } from '@/api/base_w_four'

export default {
  name: 'LineSideStockRecord',
  components: { },
  data() {
    return {
      search: {},
      loading: false,
      tableData: [],
      tableData1: [],
      loading1: false,
      options: [],
      options1: []
    }
  },
  created() {
    this.getDepotList()
    this.getDepotSiteList()
    this.getList()
  },
  methods: {
    async getList() {
      try {
        // 取消选中
        if (this.$refs.singleTable) {
          this.$refs.singleTable.setCurrentRow()
        }
        this.tableData1 = []
        this.loading = true
        const data = await depotPallet('get', null, { params: this.search })
        this.tableData = data.results
        if (this.tableData.length > 0) {
          this.$refs.singleTable.setCurrentRow(this.tableData[0])
        }
        this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getList1(row) {
      try {
        this.loading1 = true
        const obj = { product_no: row.product_no }
        Object.assign(obj, this.search)
        const data = await depotPalletInfo('get', null, { params: obj })
        this.tableData1 = data
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
      }
    },
    async getDepotList() {
      try {
        const data = await depot('get', null, { params: { all: 1 }})
        this.options = data.results
      } catch (e) {
        //
      }
    },
    async getDepotSiteList() {
      try {
        const data = await depotSite('get', null, { params: { all: 1 }})
        this.options1 = data.results
      } catch (e) {
        //
      }
    },
    handleCurrentChange(row) {
      this.getList1(row)
    },
    changeList() {
      this.getList()
    },
    productBatchingChanged(val) {
      this.search.product_no = val ? val.material_no : ''
      this.getList()
    }
  }
}
</script>

<style>

</style>
