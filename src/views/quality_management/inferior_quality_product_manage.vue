<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="生产日期">
      </el-form-item>
      <el-form-item label="状态">
      </el-form-item>
    </el-form>
    <el-table
      border
      fit
      style="width: 100%"
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="生产日期" />
      <el-table-column label="机台" />
      <el-table-column label="班次" />
      <el-table-column label="胶料编码" />
      <el-table-column label="lot追踪号" />
      <el-table-column label="检测结果" />
      <el-table-column label="等级" />
      <el-table-column label="不合格原因" />
      <el-table-column label="状态" />
      <el-table-column label="操作" />
      <el-table-column label="处理意见" />
      <el-table-column label="处理结果" />
      <el-table-column label="处理人" />
      <el-table-column label="确认人" />
    </el-table>
  </div>
</template>

<script>
export default {
    
}
</script>