<template>
  <div>
    <!-- 排程无硫库存单 -->
    <el-form :inline="true">
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="search.factory_date"
          type="date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="getList"
        />
      </el-form-item>
      <el-form-item label="胶料编码">
        <el-input v-model="search.product_no" clearable filterable placeholder="请输入" @change="changeList" />
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['aps_stock_summary','export']" type="primary" @click="exportTable">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <div style="width:70%">
      <el-table
        id="out-table"
        v-loading="loading"
        :data="tableData"
        border
      >
        <el-table-column
          align="center"
          prop="product_no"
          label="规格"
          min-width="20"
        />
        <el-table-column
          align="center"
          prop="HMB"
          label="HMB（kg）"
          min-width="20"
        />
        <el-table-column
          align="center"
          prop="CMB"
          label="CMB（kg）"
          min-width="20"
        />
        <el-table-column
          align="center"
          prop="1MB"
          label="1MB（kg）"
          min-width="20"
        />
        <el-table-column
          align="center"
          prop="2MB"
          label="2MB（kg）"
          min-width="20"
        />
        <el-table-column
          align="center"
          prop="3MB"
          label="3MB（kg）"
          min-width="20"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import { schedulingStockSummary } from '@/api/jqy'
import { setDate, exportExcel } from '@/utils'
export default {
  name: 'ScheduledInventory',
  data() {
    return {
      loading: false,
      tableData: [],
      search: { factory_date: setDate() }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await schedulingStockSummary('get', null, { params: this.search })
        this.tableData = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.$debounce(this, 'getList')
    },
    exportTable() {
      exportExcel('排程无硫库存单')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
