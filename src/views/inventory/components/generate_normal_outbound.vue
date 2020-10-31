<template>
  <div class="clearfix">
    <el-form>
      <el-form-item label="仓库名称">
        <el-select />
      </el-form-item>
      <el-form-item label="物料类型">
        <el-select />
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input />
      </el-form-item>
      <el-form-item label="需求数量">
        <el-input />
      </el-form-item>
      <el-form-item label="需求重量">
        <el-input />
      </el-form-item>
      <el-form-item label="可用库存数">
        <el-input />
      </el-form-item>
    </el-form>
    <el-button style="float: right; margin-top: 22px">生成出库单</el-button>
  </div>
</template>
