<template>
  <div>
    <!-- 快检设备监控 -->
    <div v-for="(item,i) in 6" :key="i" class="tagBox">
      <!-- danger -->
      <el-tag type="success">标签二</el-tag>
      <el-tag type="info" effect="plain">
        2021-07-08 17:18:55
      </el-tag>
    </div>
    <el-table
      :data="tableData"
      border
      style="margin-top:10px;"
    >
      <el-table-column
        prop="date"
        label="日期"
        min-width="20"
      />
      <el-table-column
        prop="name"
        label="姓名"
        min-width="20"
      />
      <el-table-column
        prop="address"
        label="地址"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'DeviceMonitor',
  data() {
    return {
      tableData: []
    }
  }
}
</script>

<style lang="scss" scoped>
    .tagBox{
        display: inline-block;
        margin: 0 20px 10px 0;
    }
</style>
