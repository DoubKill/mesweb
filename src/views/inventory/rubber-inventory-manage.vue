<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="物料类型">
        <el-select />
      </el-form-item>
      <el-form-item label="仓库名称">
        <el-select />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input />
      </el-form-item>
      <el-form-item label="托盘号">
        <el-input />
      </el-form-item>
    </el-form>
    <el-table
      border
      fit
      style="width: 100%"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="物料类型" align="center" prop="" />
      <el-table-column label="物料编码" align="center" prop="" />
      <el-table-column label="lot" align="center" prop="" />
      <el-table-column label="托盘号" align="center" prop="" />
      <el-table-column label="库存位" align="center" prop="" />
      <el-table-column label="库存数" align="center" prop="" />
      <el-table-column label="单位" align="center" prop="" />
      <el-table-column label="单位数量" align="center" prop="" />
      <el-table-column label="总重量" align="center" prop="" />
      <el-table-column label="品质状态" align="center" prop="" />
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  }
}
</script>
