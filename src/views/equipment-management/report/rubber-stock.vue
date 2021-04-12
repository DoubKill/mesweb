<template>
  <div>
    <!-- 胶料库存明细 -->
    <el-form :inline="true">
      <el-form-item label="胶种编码:">
        <el-select v-model="search.no" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        label="No"
        type="index"
        width="50"
      />
      <el-table-column
        prop="date"
        label="胶种类"
        min-width="10"
      />
      <el-table-column label="立库各段位库存">
        <el-table-column
          prop="name"
          label="HMB"
          min-width="10"
        />
      </el-table-column>
      <el-table-column label="车间各段位库存">
        <el-table-column
          prop="name"
          label="HMB"
          min-width="10"
        />
      </el-table-column>
      <el-table-column
        prop="date"
        label="不合格(加硫)"
        min-width="10"
      />
      <el-table-column label="核算">
        <el-table-column
          prop="name"
          label="加硫(吨)"
          min-width="10"
        />
        <el-table-column
          prop="name"
          label="无硫(吨)"
          min-width="10"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  components: { },
  data() {
    return {
      search: {},
      options: [],
      tableData: [{}]
    }
  },
  methods: {
    productBatchingChanged(val) {
    //   this.search.product_no = val ? val.material_no : ''
    //   this.getList()
    //   this.search.page = 1
    }
  }
}
</script>

<style>

</style>
