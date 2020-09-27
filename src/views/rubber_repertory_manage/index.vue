<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="段次">
        <el-select
          v-model="RubberStage"
          style="width: 150px"
          clearable
          placeholder="请选择"
          @visible-change="RubberStageChange"
          @change="changeSearch"
        >
          <el-option
            v-for="item in RubberStageOptions"
            :key="item.id"
            :label="item.global_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-table
      highlight-current-row
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column prop="sn" label="No" align="center" />
      <el-table-column prop="material_type" label="胶料类型" align="center" />
      <el-table-column prop="material_no" label="胶料编码" align="center" />
      <el-table-column prop="material_name" label="胶料名称" align="center" />
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
import { rubber_repertory_url, stage_global_url } from '@/api/display_static_fun'

export default {
  components: { page },
  data: function() {
    return {
      tableData: [],
      total: 0,
      getParams: {
        page: 1
      },
      RubberStage: null,
      RubberStageOptions: []

    }
  },
  created() {
    this.rubber_repertory_list()
  },
  methods: {
    async rubber_repertory_list() {
      try {
        const rubber_repertoryData = await rubber_repertory_url('get', { params: this.getParams })
        this.tableData = rubber_repertoryData.results
        this.total = rubber_repertoryData.count
      } catch (e) { throw new Error(e) }
    },
    async stage_global_list() {
      try {
        const stage_global_list = await stage_global_url('get', {
          params: { }
        })
        if (stage_global_list.results.length !== 0) {
          this.RubberStageOptions = stage_global_list.results
        }
      } catch (e) { throw new Error(e) }
    },
    RubberStageChange: function(bool) {
      if (bool) {
        this.stage_global_list()
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
      this.getParams['stage_id'] = this.RubberStage
      this.getParams.page = 1
      this.rubber_repertory_list()
    },
    currentChange(page) {
      this.getParams.page = page
      this.rubber_repertory_list()
    }

  }
}

</script>

<style lang="scss" scoped>
</style>

