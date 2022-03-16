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
        prop="id"
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column
        prop="materialCode"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        prop="materialName"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="materialGroupName"
        label="物资组"
        min-width="20"
      />
      <el-table-column
        prop="quantity"
        label="数量"
        min-width="8"
      />
      <el-table-column
        prop="batchNo"
        label="批次号"
        min-width="20"
      />
      <el-table-column
        prop="weightOfActual"
        label="总重量（kg）"
        min-width="20"
      />
      <el-table-column
        prop="sl"
        label="件数"
        min-width="20"
      />
      <el-table-column
        prop="zl"
        label="麦头重量"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>

import { exportExcel } from '@/utils/index'

export default {
  name: 'Excel',
  components: { },
  data() {
    return {
      tableData: [],
      total: 0
    }
  },
  created() {
    this.tableData = this.$route.query.table
  },
  mounted() {
    setTimeout(() => {
      this.Excel()
    }, 300)
  },
  methods: {
    Excel() {
      exportExcel('报表')
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
