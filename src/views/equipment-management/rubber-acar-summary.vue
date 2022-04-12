<template>
  <div v-loading="loading">
    <!-- 胶料单车次时间汇总 -->
    <el-form :inline="true">
      <el-form-item label="时间:">
        <el-date-picker
          v-model="search.st"
          type="date"
          placeholder="日期"
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
          :is-created="true"
          @changeSearch="equipChanged"
        />
      </el-form-item>
      <el-form-item label="胶料编码:">
        <all-product-no-select @productBatchingChanged="productBatchingChanged" />
      </el-form-item>
      <el-form-item label="时间单位:">
        <el-select v-model="timeUnit" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="btnExportLoad"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item
        :label="'总耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.sum_time ||0 }}</span>
        <span v-else>{{ allData.sum_time |setTimeMin }}</span>
      </el-form-item>
      <el-form-item
        :label="'最小耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.min_time ||0 }}</span>
        <span v-else>{{ allData.min_time |setTimeMin }}</span>
      </el-form-item>
      <el-form-item
        :label="'最大耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.max_time ||0 }}</span>
        <span v-else>{{ allData.max_time |setTimeMin }}</span>
      </el-form-item>
      <el-form-item
        :label="'平均耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <span v-if="timeUnit==='秒'">{{ allData.avg_time ||0 }}</span>
        <span v-else>{{ allData.avg_time |setTimeMin }}</span>
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
        prop="classes"
        label="班次"
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
        :label="'耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <template slot-scope="{row}">
          <span v-if="timeUnit==='秒'">{{ row.time_consuming }}</span>
          <span v-else>{{ row.time_consuming |setTimeMin }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="interval_time"
        :label="'间隔时间/'+(timeUnit==='秒'?'s':'min')"
      >
        <template slot-scope="{row}">
          <span v-if="timeUnit==='秒'">{{ row.interval_time }}</span>
          <span v-else>{{ row.interval_time |setTimeMin }}</span>
        </template>
      </el-table-column>
    </el-table>
    <page
      :total="total"
      :current-page="search.page"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
// import productNoSelect from '@/components/ProductNoSelect'
import equipSelect from '@/components/select_w/equip'
import page from '@/components/page'
import classSelect from '@/components/ClassSelect'
import { collectTrainsFeed, sumSollectTrains } from '@/api/base_w'
import { setDate } from '@/utils/index'
import allProductNoSelect from '@/components/select_w/allProductNoSelect'
export default {
  name: 'RubberAcarSummary',
  components: { allProductNoSelect, page, equipSelect, classSelect },
  data() {
    return {
      total: 0,
      btnExportLoad: false,
      loading: false,
      search: {
        page: 1,
        equip_no: null,
        st: ''
      },
      allData: {},
      tableData: [],
      options: ['秒', '分钟'],
      timeUnit: '秒'
    }
  },
  created() {
    this.search.st = setDate()
    // this.getList()
  },
  methods: {
    exportTable() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      collectTrainsFeed('get', null, { params: obj, responseType: 'blob' })
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = '胶料单车次时间汇总.xlsx' // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    async getList() {
      try {
        this.loading = true
        const arr = await Promise.all([
          collectTrainsFeed('get', null, { params: this.search }),
          sumSollectTrains('get', null, { params: this.search })
        ])
        // console.log(arr, 444)
        // const data = await collectTrainsFeed('get', null, { params: this.search })
        this.total = arr[0].count
        this.tableData = arr[0].results || []
        this.allData = arr[1].results
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
      this.search.product_no = val ? val.material_no : ''
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
      this.getList()
      this.search.page = 1
    },
    classChanged(val) {
      this.search.classes = val
      this.search.page = 1
      this.getList()
    }
  }
}
</script>

<style>

</style>
