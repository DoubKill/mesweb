<template>
  <div>
    <!--硫磺库 库存查询 -->
    <el-form :inline="true">
      <el-form-item label="名称:">
        <el-input v-model="search.name" clearable @input="changeDebounce" />
      </el-form-item>
      <el-form-item label="物料编码:">
        <el-input v-model="search.product_no" clearable @input="changeDebounce" />
      </el-form-item>
      <el-form-item label="供应商:">
        <el-input v-model="search.provider" clearable @input="changeDebounce" />
      </el-form-item>
    </el-form>
    <el-row v-loading="loading">
      <el-col :span="16">
        <el-table
          ref="singleTable"
          :data="tableData"
          border
          highlight-current-row
          show-summary
          @current-change="handleCurrentChange"
        >
          <el-table-column
            prop="name"
            label="名称"
          />
          <el-table-column
            prop="product_no"
            label="物料编码"
          />
          <el-table-column
            prop="provider"
            label="供应商"
          />
          <el-table-column
            prop="lot_no"
            label="批号"
          />
          <el-table-column
            prop="num"
            label="现存数量/箱"
          />
        </el-table>
      </el-col>
      <el-col v-loading="loading" :span="8">
        <el-table
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
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { debounce } from '@/utils'
import { depotSulfur, depotSulfurInfo } from '@/api/base_w_four'
export default {
  name: 'SulphurStockRecord',
  components: { },
  data() {
    return {
      search: {},
      loading: false,
      tableData: [],
      tableData1: [],
      loading1: false
    }
  },
  created() {
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
        const data = await depotSulfur('get', null, { params: this.search })
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
        const data = await depotSulfurInfo('get', null, { params: { product_no: row.product_no }})
        this.tableData1 = data
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
      }
    },
    changeDebounce() {
      debounce(this, 'getList')
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
