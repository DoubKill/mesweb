<template>
  <div>
    <!-- 物料需求量统计 -->
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="search_time"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="changeSearch"
        />
      </el-form-item>
      <el-form-item label="班次">
        <el-select
          v-model="classes_arrange"
          style="width: 150px"
          clearable
          placeholder="请选择"
          @visible-change="shifts_class_arrangeChange"
          @change="changeSearch"
        >
          <el-option
            v-for="item in classes_arrangeOptions"
            :key="item.global_name"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="胶料配料编码">
        <el-input v-model="rubber_recipe_no" @input="changeSearch" />
      </el-form-item>
    </el-form>
    <el-table
      highlight-current-row
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column width="40%" type="index" label="No" align="center" />
      <el-table-column width="60%" prop="classes" label="班次" align="center" />
      <el-table-column prop="product_no" label="胶料配料编码" align="center" />
      <el-table-column prop="material_type" label="物料类型" align="center" />
      <el-table-column prop="material_no" label="物料编码" align="center" />
      <el-table-column prop="material_name" label="物料名称" align="center" />

      <el-table-column align="center" label="物料库存">
        <el-table-column align="center" prop="qty" label="数量" width="90px" />
        <el-table-column align="center" prop="unit_weight" label="单位重量" width="80px" />
        <el-table-column align="center" prop="total_weight" label="总重量" width="110px" />
      </el-table-column>

      <el-table-column align="center" label="需求量">
        <el-table-column align="center" prop="need_qty" label="数量" width="90px" />
        <el-table-column align="center" prop="need_unit_weight" label="单位重量" width="90px" />
        <el-table-column align="center" prop="material_demanded" label="总重量" width="110px" />
      </el-table-column>
    </el-table>
    <page :total="total" :current-page="getParams.page" @currentChange="currentChange" />

  </div>
</template>

<script>
import page from '@/components/page'
import { material_quantity_url, class_arrange_url } from '@/api/display_static_fun'

export default {
  name: 'ScheduleMaterialRequirement',
  components: { page },
  data: function() {
    return {
      tableData: [],
      total: 0,
      getParams: {
        page: 1
      },
      search_time: null,
      classes_arrangeOptions: [],
      rubber_recipe_no: null,
      classes_arrange: null
    }
  },
  created() {
    this.getSearchTime()
    this.material_quantity_list()
  },
  methods: {
    async material_quantity_list() {
      try {
        const material_quantityData = await material_quantity_url('get', { params: this.getParams })
        this.tableData = material_quantityData.results
        this.total = material_quantityData.count
      } catch (e) { throw new Error(e) }
    },
    async class_arrange_list() {
      try {
        const class_arrange_list = await class_arrange_url('get', {
          params: { }
        })
        if (class_arrange_list.results.length !== 0) {
          this.classes_arrangeOptions = class_arrange_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    shifts_class_arrangeChange: function(bool) {
      if (bool) {
        this.class_arrange_list()
      }
    },
    changeSearch() {
      this.getParams['plan_date'] = this.search_time
      this.getParams['classes'] = this.classes_arrange
      this.getParams['product_no'] = this.rubber_recipe_no
      this.getParams.page = 1
      this.material_quantity_list()
    },
    getSearchTime() {
      const myDate = new Date()
      const Y = myDate.getFullYear()
      const m = myDate.getMonth() + 1
      const M = m < 10 ? '0' + m : m
      const d = myDate.getDate()
      const D = d < 10 ? ('0' + d) : d
      this.search_time = Y + '-' + M + '-' + D
      this.getParams['plan_date'] = this.search_time
    },
    currentChange(page) {
      this.getParams.page = page
      this.material_quantity_list()
    }

  }
}

</script>

<style lang="scss" scoped>
</style>

