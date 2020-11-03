<template>
  <div v-loading="loading">
    <!-- 胶料单车次时间汇总 -->
    <el-form :inline="true">
      <el-form-item label="开始时间:">
        <el-date-picker
          v-model="search.st"
          type="date"
          placeholder="开始日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="班次:">
        <class-select
          @classSelected="classChanged"
        />
      </el-form-item>
      <el-form-item label="设备编码:">
        <equip-select
          :equip_no_props.sync="search.equip_no"
          @changeSearch="equipChanged"
        />
      </el-form-item>
      <el-form-item label="胶料编码:">
        <product-no-select @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item label="总耗时/s:">
        {{ allData.sum_time }}
      </el-form-item>
      <el-form-item label="最小耗时/s:">
        {{ allData.min_time }}
      </el-form-item>
      <el-form-item label="最大耗时/s:">
        {{ allData.max_time }}
      </el-form-item>
      <el-form-item label="平均耗时/s:">
        {{ allData.avg_time }}
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        label="No"
      />
      <el-table-column
        prop="equip_no"
        label="设备编码"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
      />
      <el-table-column
        prop="actual_trains"
        label="车次"
      />
      <el-table-column
        prop="time_consuming"
        label="耗时/s"
      />
    </el-table>
    <page
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import productNoSelect from '@/components/ProductNoSelect'
import equipSelect from '@/components/select_w/equip'
import page from '@/components/page'
import classSelect from '@/components/ClassSelect'
import { collectTrainsFeed } from '@/api/base_w'
export default {
  components: { productNoSelect, page, equipSelect, classSelect },
  data() {
    return {
      total: 0,
      loading: false,
      search: {
        page: 1,
        equip_no: null,
        date: ''
      },
      allData: {},
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await collectTrainsFeed('get', null, { params: this.search })
        this.total = data.count
        this.allData = data.results.pop() || {}
        this.tableData = data.results || []
        console.log(this.tableData, this.allData)
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    currentChange(page) {
      this.search.page = page
      this.getList()
    },
    productBatchingChanged(val) {
      this.search.product_no = val ? val.stage_product_batch_no : ''
      this.getList()
      this.search.page = 1
    },
    equipChanged(val) {
      this.search.equip_no = val
      this.getList()
      this.search.page = 1
    },
    timeSpanChanged() {},
    changeDate(date) {
      this.search.st = date
      this.getList()
      this.search.page = 1
    },
    classChanged(val) {
      this.search.classes = val
      this.getList()
      this.search.page = 1
    }
  }
}
</script>

<style>

</style>
