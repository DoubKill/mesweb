<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="原材料类别">
        <el-input v-model="getParams.material_type" @input="changeSearch" />
      </el-form-item>
    </el-form>

    <el-table
      highlight-current-row
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column prop="sn" label="No" align="center" width="40px" />
      <el-table-column prop="material_type" label="原材料类型" align="center" />
      <el-table-column prop="material_no" label="原材料编码" align="center" />
      <el-table-column prop="material_name" label="原材料名称" align="center" />
      <el-table-column prop="site" label="产地" align="center" />
      <el-table-column prop="qty" label="库存数" align="center" />
      <el-table-column prop="unit" label="单位" align="center" />
      <el-table-column prop="unit_weight" label="单位重量" align="center" />
      <el-table-column prop="total_weight" label="总重量" align="center" />
      <el-table-column prop="standard_flag" label="品质状态" align="center" :formatter="StandardFlagFormatter" />
    </el-table>
    <page :total="total" :current-page="getParams.page" @currentChange="currentChange" />

  </div>
</template>

<script>
import page from '@/components/page'
import { material_repertory_url, materials_type_url } from '@/api/display_static_fun'
import { debounce } from '@/utils'
export default {
  components: { page },
  data: function() {
    return {
      tableData: [],
      total: 0,
      getParams: {
        page: 1
      },
      materialType: null,
      materialTypeOptions: []
    }
  },
  created() {
    this.material_repertory_list()
  },
  methods: {
    async material_repertory_list() {
      try {
        const material_repertoryData = await material_repertory_url('get', { params: this.getParams })
        this.tableData = material_repertoryData.results
        this.total = material_repertoryData.count
      } catch (e) { throw new Error(e) }
    },
    async materials_type_list() {
      try {
        const materials_type_list = await materials_type_url('get', {
          params: { }
        })
        if (materials_type_list.results.length !== 0) {
          this.materialTypeOptions = materials_type_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    materialTypeChange: function(bool) {
      if (bool) {
        this.materials_type_list()
      }
    },
    StandardFlagFormatter: function(row, column) {
      return this.StandardFlagChoice(row.standard_flag)
    },
    StandardFlagChoice: function(standard_flag) {
      switch (standard_flag) {
        case true:
          return '合格'
        case false:
          return '不合格'
      }
    },
    changeSearch() {
      this.getParams.page = 1
      debounce(this, 'material_repertory_list')
    },
    currentChange(page) {
      this.getParams.page = page
      this.material_repertory_list()
    }

  }
}

</script>

<style lang="scss" scoped>
</style>

