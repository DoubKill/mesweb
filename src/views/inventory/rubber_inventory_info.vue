<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="胶种编码">
        <el-select />
      </el-form-item>
    </el-form>
    <el-table
      border
      fit
      style="width: 100%"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="胶种类" align="center" />
      <el-table-column label="各段次" align="center">
        <el-table-column label="HMB数量" align="center" />
        <el-table-column label="HMB数量" align="center" />
        <el-table-column label="各段次" align="center" />
      </el-table-column>
      <el-table-column label="不合格" align="center" />
    </el-table>
  </div>
</template>
