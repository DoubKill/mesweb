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
      fromPath: '',
      tableData: [],
      search: {},
      total: 0,
      excelName: null
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //  这里的vm指的就是vue实例，可以用来当做this使用
      vm.fromPath = from.path // 获取上一级路由的路径
    })
  },
  created() {
    this.tableData = this.$route.query.table
    this.excelName = this.$route.query.name
    this.search = this.$route.query.search
  },
  mounted() {
    setTimeout(() => {
      this.Excel()
    }, 300)
  },
  methods: {
    Excel() {
      exportExcel(this.excelName, 'excel')
      const visitedViews = this.$store.state.tagsView.visitedViews
      this.$store.state.tagsView.visitedViews = visitedViews.filter(v => {
        return v.path !== this.$route.path
      })
      this.$router.push({
        path: this.fromPath,
        query: {
          search: this.search
        }})
      // this.$router.go(-1)
    }

  }
}
</script>

<style>

</style>
