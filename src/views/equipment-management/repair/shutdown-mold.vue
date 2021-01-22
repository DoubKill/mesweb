<template>
  <div>
    <!-- 停机类型定义 -->
    <el-button style="margin-bottom:10px">新建</el-button>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        label="No"
        width="40"
        type="index"
      />
      <el-table-column
        prop="date"
        label="停机类型"
      />
      <el-table-column
        prop="name"
        label="停机类型编码"
      />
      <el-table-column
        prop="date"
        label="创建人"
      />
      <el-table-column
        prop="name"
        label="创建时间"
      />
      <el-table-column
        prop="address"
        label="操作"
      >
        <el-button
          size="mini"
          type="danger"
        >删除</el-button>
      </el-table-column>
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

<style>

</style>
