<template>
  <div>
    <!-- 各班产量统计 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.s_time"
          type="month"
          value-format="yyyy-MM"
          format="yyyy-MM"
          placeholder="选择月"
        />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="日期"
        width="150"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ShiftOutputIndex',
  data() {
    return {
      search: {},
      tableData: []
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
