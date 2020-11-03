<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="search.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="search.a" placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库存位置">
        <el-select v-model="search.b" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码">
        <el-input />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      fit
    >
      <el-table-column label="No" type="index" align="center" />
      <el-table-column label="类型" align="center" prop="" />
      <el-table-column label="出入库单号" align="center" prop="" />
      <el-table-column label="仓库类型" align="center" prop="" />
      <el-table-column label="托盘号" align="center" prop="" />
      <el-table-column label="物料编码" align="center" prop="" />
      <el-table-column label="出入库原因" align="center" prop="" />
      <el-table-column label="出入库类型" align="center" prop="" />
      <el-table-column label="出入库数" align="center" prop="" />
      <el-table-column label="单位" align="center" prop="" />
      <el-table-column label="重量" align="center" prop="" />
      <el-table-column label="发起人" align="center" prop="" />
      <el-table-column label="发起时间" align="center" prop="" />
      <el-table-column label="完成时间" align="center" prop="" />
    </el-table>
    <!-- <el-dialog
      title="指定出库"
      :visible.sync="visibleDialog1"
      width="80%"
    >
      <generate-assign-outbound />
    </el-dialog>
    <el-dialog
      title="正常出库"
      :visible.sync="visibleDialog2"
    >
      <generate-normal-outbound /></el-dialog> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      search: {},
      options1: [],
      options2: [],
      tableData: [
        {
          a: 1,
          b: 2
        }
      ]
    }
  },
  created() {},
  methods: {}
}
</script>

<style>

</style>
