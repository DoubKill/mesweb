<template>
  <div v-loading="loading">
    <!-- 班次密炼时间汇总 -->
    <el-form :inline="true">
      <el-form-item label="时间:">
        <el-date-picker
          v-model="search.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="search.day_type" @change="changeRadio">
          <el-radio :label="1">自然日</el-radio>
          <el-radio :label="2">工厂时间</el-radio>
        </el-radio-group>
      </el-form-item>
      <br>
      <el-form-item label="时间跨度:">
        <time-span-select
          :default-val="search.dimension"
          @changeSelect="timeSpanChanged"
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
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        label="No"
      />
      <el-table-column
        :label="search.dimension === 3?'月份':search.dimension === 1?'班次':'时间'"
      >
        <template slot-scope="scope">
          <span v-if="search.dimension === 3">{{ setMonth(scope.row.month) }}</span>
          <span v-if="search.dimension === 1&&scope.row.classes">
            {{ (Object.prototype.hasOwnProperty.call(scope.row, 'factory_date')?
              scope.row.factory_date:
              scope.row.end_time__date)
              + ' / '+ scope.row.classes }}</span>
          <span v-if="search.dimension === 2">
            {{ Object.prototype.hasOwnProperty.call(scope.row, 'factory_date')?
              scope.row.factory_date:scope.row. end_time__date }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="equip_no"
        label="设备编码"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
      />
      <el-table-column
        prop="total_trains"
        label="总车数"
      />
      <el-table-column
        prop="total_time"
        label="总耗时/min"
      >
        <template slot-scope="{row}">
          {{ row.min_train_time |setTimeMin }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="f"
        label="总时间"
      /> -->
      <el-table-column
        label="单车最小耗时/min"
      >
        <template slot-scope="{row}">
          {{ row.min_train_time |setTimeMin }}
        </template>
      </el-table-column>
      <el-table-column
        prop="max_train_time"
        label="单车最大耗时/min"
      >
        <template slot-scope="{row}">
          {{ row.min_train_time |setTimeMin }}
        </template>
      </el-table-column>
      <el-table-column
        prop="avg_train_time"
        label="单车平均耗时/min"
      >
        <template slot-scope="{row}">
          {{ row.min_train_time |setTimeMin }}
        </template>
      </el-table-column>
      <el-table-column
        prop="j"
        label="利用率"
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
import timeSpanSelect from '@/components/select_w/timeSpan'
import { classesBanburySummary } from '@/api/base_w'
export default {
  components: { productNoSelect, page, equipSelect, timeSpanSelect },
  data() {
    return {
      total: 0,
      loading: false,
      search: {
        page: 1,
        equip_no: null,
        dimension: 1,
        day_type: 2,
        date: []
      },
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
        const data = await classesBanburySummary('get', null, { params: this.search })
        this.total = data.count
        this.tableData = data.results
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    setMonth(month) {
      if (!month) return
      const data = new Date(month)
      return data.getFullYear() + '/' + (data.getMonth() + 1)
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
    timeSpanChanged(val) {
      this.search.dimension = val
      this.getList()
      this.search.page = 1
    },
    changeDate(date) {
      this.search.st = date ? date[0] : ''
      this.search.et = date ? date[1] : ''
      this.getList()
      this.search.page = 1
    },
    changeRadio(val) {
      this.search.day_type = val
      this.getList()
      this.search.page = 1
    }
  }
}
</script>

<style>

</style>
