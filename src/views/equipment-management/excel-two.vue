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
        prop="time"
        label="时间"
      />
      <el-table-column
        prop="equip_no"
        label="设备编码"
      />
      <el-table-column
        prop="plan_classes_uid_age"
        label="切换前计划号"
      />
      <el-table-column
        prop="plan_classes_uid_later"
        label="切换后计划号"
      />
      <el-table-column
        prop="cut_ago_product_no"
        label="切换前胶料编码"
      />
      <el-table-column
        prop="cut_later_product_no"
        label="切换后胶料编码"
      />
      <el-table-column
        :label="'耗时/'+(timeUnit==='秒'?'s':'min')"
      >
        <template slot-scope="{row}">
          <span v-if="timeUnit==='秒'">{{ row.time_consuming }}</span>
          <span v-else>{{ row.time_consuming |setTimeMin }}</span>
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
      exportExcel('规格切换时间汇总')
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
