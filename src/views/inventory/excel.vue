<template>
  <div id="out-table">
    <!-- excel -->
    <el-table
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="id"
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column
        prop="materialCode"
        label="物料编码"
        min-width="20"
      />
      <el-table-column
        prop="materialName"
        label="物料名称"
        min-width="20"
      />
      <el-table-column
        prop="materialGroupName"
        label="物资组"
        min-width="20"
      />
      <el-table-column
        prop="zcMaterialCode"
        label="中策物料编码"
        min-width="20"
      />
      <el-table-column
        prop="pdm"
        label="中策pdm号"
        min-width="20"
      />
      <el-table-column
        prop="quantity"
        label="数量"
        min-width="8"
      />
      <el-table-column
        prop="batchNo"
        label="批次号"
        min-width="20"
      />
      <el-table-column
        prop="weightOfActual"
        label="总重量（kg）"
        min-width="20"
      />
      <el-table-column
        prop="weightUnit"
        label="重量单位"
        min-width="20"
      />
      <el-table-column
        prop="sl"
        label="件数"
        min-width="20"
      />
      <el-table-column
        prop="zl"
        label="麦头重量"
        min-width="20"
      />
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'Excel',
  components: { },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>

<style>

</style>
