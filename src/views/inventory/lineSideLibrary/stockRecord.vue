<template>
  <div>
    <!-- 库存查询 -->
    <el-form :inline="true">
      <el-form-item label="胶料编码:">
        <all-product-no-select @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
      <el-form-item label="库区:">
        //
      </el-form-item>
      <el-form-item label="库位:">
        //
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
            prop="date"
            label="胶料编码"
          />
          <el-table-column
            prop="date"
            label="线边库现存数量"
          />
        </el-table>
      </el-col>
      <el-col v-loading="loading" :span="14">
        <el-table
          :data="tableData1"
          border
        >
          <el-table-column
            prop="date"
            label="库区"
          />
          <el-table-column
            prop="date"
            label="库位"
          />
          <el-table-column
            prop="date"
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
import allProductNoSelect from '@/components/select_w/allProductNoSelect'

export default {
  name: 'LineSideStockRecord',
  components: { allProductNoSelect },
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
        // this.loading = true
        // const data = await spareInventory('get', null, { params: this.search })
        // this.tableData = data.results
        // this.total = data.count
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async getList1() {
      try {
        // this.loading1 = true
        // const data = await spareInventory('get', null, { params: this.search })
        // this.tableData1 = data.results
        this.loading1 = false
      } catch (e) {
        this.loading1 = false
      }
    },
    handleCurrentChange() {

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
