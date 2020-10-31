<template>
  <div class="clearfix">
    <el-form :inline="true">
      <el-form-item label="胶料类型">
        <el-select />
      </el-form-item>
      <el-form-item label="仓库名称">
        <el-select />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input />
      </el-form-item>
      <el-form-item label="品质状态">
        <el-select />
      </el-form-item>
    </el-form>
    <el-table
      border
    >
      <el-table-column label="选择" align="center" />
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="物料类型" align="center" />
      <el-table-column label="物料编码" align="center" />
      <el-table-column label="lot" align="center" />
      <el-table-column label="托盘号" align="center" />
      <el-table-column label="库存位" align="center" />
      <el-table-column label="库存数" align="center" />
      <el-table-column label="单位" align="center" />
      <el-table-column label="单位重量" align="center" />
      <el-table-column label="总重量" align="center" />
      <el-table-column label="品质状态" align="center" />
    </el-table>
    <el-button style="float: right; margin-top: 22px">生成出库单</el-button>
  </div>
</template>
