<template>
  <div id="out-table">
    <!-- excel -->
    <el-table
      v-show="false"
      :data="tableData"
      style="width: 100%"
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
  </div>
</template>

<script>

import { exportExcel } from '@/utils/index'

export default {
  name: 'SummaryExcel',
  components: { },
  data() {
    return {
      tableData: [],
      total: 0,
      timeUnit: '秒'
    }
  },
  created() {
    this.tableData = this.$route.query.table
    this.timeUnit = this.$route.query.timeUnit
  },
  mounted() {
    setTimeout(() => {
      this.Excel()
    }, 300)
  },
  methods: {
    Excel() {
      exportExcel('胶料单车次时间汇总')
      const visitedViews = this.$store.state.tagsView.visitedViews
      this.$store.state.tagsView.visitedViews = visitedViews.filter(v => {
        return v.path !== this.$route.path
      })
      this.$router.go(-1)
    }
  }
}
</script>

<style>

</style>
