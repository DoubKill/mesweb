<template>
  <div style="margin-top: 25px">
    <el-form :inline="true">
      <el-form-item label="胶料配方编码">
        <el-input v-model="recipe_no" @input="recipeNoChanged" />
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="No"
        width="50"
      />
      <el-table-column
        prop="stage_product_batch_no"
        label="胶料配方编码"
      />
      <el-table-column
        prop="product_no"
        label="胶料编码"
      />
      <el-table-column
        prop="stage_name"
        label="段次"
      />
      <el-table-column
        prop="dev_type_name"
        label="炼胶机类型"
      />
      <el-table-column
        prop="auto_material_weight"
        label="自动小料重量"
      />
      <el-table-column
        prop="manual_material_weight"
        label="手动小料重量"
      />
    </el-table>
    <page :total="total" :current-page="getParams.page" @currentChange="currentChange" />
  </div>
</template>

<script>
import { rubberMaterial } from '@/api/small-material-recipe'
import page from '@/components/page'
export default {
  components: { page },
  data: function() {
    return {
      recipe_no: '',
      getParams: {
        page: 1
      },
      tableData: [],
      currentPage: 1,
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    recipeNoChanged: function() {
      this.getParams['page'] = 1
      this.getParams['stage_product_batch_no'] = this.recipe_no
      this.getList()
    },
    getList() {
      rubberMaterial(this.getParams).then(response => {
        this.tableData = response.results
        this.total = response.count
      })
    },
    currentChange(page) {
      this.getParams.page = page
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
