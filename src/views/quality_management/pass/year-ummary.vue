<template>
  <div v-loading="loading">
    <!-- 综合合格率年度汇总 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.s_time"
          type="year"
          :clearable="false"
          value-format="yyyy-MM"
          format="yyyy"
          placeholder="选择年"
          @change="getList"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      :data="tableData"
      border
    >
      <el-table-column
        type="index"
        label="No"
        width="40px"
      />
      <el-table-column
        prop="name"
        align="center"
        label="合格率类型"
        width="100"
      />
      <el-table-column
        v-for="(d) in 12"
        :key="d"
        align="center"
        :label="d+'月'"
        min-width="20"
      >
        <template slot-scope="{row}">
          {{ row[d] }}{{ row[d]!==''?'%':'' }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { productSynthesisMonthRate } from '@/api/base_w_five'
import { setDate, exportExcel } from '@/utils'
export default {
  name: 'YearUmmary',
  data() {
    return {
      loading: false,
      tableData: [],
      search: {
        s_time: setDate(false, false, 'month')
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const aa = this.search.s_time.split('-')[0]
        const arr = await productSynthesisMonthRate('get', null, { params: { year: aa }})
        this.loading = false
        this.tableData = arr.data || []
      } catch (e) {
        this.loading = false
      }
    },
    exportTable() {
      exportExcel('综合合格率年度汇总', '综合合格率汇总')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
