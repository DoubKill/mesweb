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
            :key="item.global_name"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="加硫：">
        共{{ sulfurAddition || 0 }}车
      </el-form-item>
      <el-form-item label="无硫：">
        共{{ sulfurFree || 0 }}车
      </el-form-item>
    </el-form>

    <el-table
      highlight-current-row
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column prop="sn" label="No" align="center" width="40px" />
      <el-table-column prop="material_type" label="胶料类型" align="center" width="90px" />
      <el-table-column prop="material_no" label="胶料编码" align="center">
        <template slot-scope="{row}">
          <!-- <el-link type="primary" @click="clickMaterialNo">{{ row.material_no }}</el-link> -->
          {{ row.material_no }}
        </template>
      </el-table-column>
      <el-table-column prop="material_name" label="胶料名称" align="center" />
      <el-table-column prop="site" label="产地" align="center" />
      <el-table-column prop="qty" label="库存数(车)" align="center" />
      <el-table-column prop="unit_weight" label="每车重量" align="center" />
      <el-table-column prop="total_weight" label="总重量" align="center" />
      <el-table-column prop="unit" label="重量单位" align="center" />
      <el-table-column prop="standard_flag" label="品质状态" align="center" :formatter="StandardFlagFormatter" />
    </el-table>
    <page :total="total" :current-page="getParams.page" @currentChange="currentChange" />
    <el-dialog
      title="物料库存列表"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-table
        border
        fit
        style="width: 100%"
        :data="tableDataDialog"
      >
        <el-table-column label="No" type="index" align="center" />
        <el-table-column label="物料类型" align="center" prop="material_type" />
        <el-table-column label="物料编码" align="center" prop="material_no" />
        <el-table-column label="lot" align="center" prop="lot_no" />
        <el-table-column label="托盘号" align="center" prop="container_no" />
        <el-table-column label="库存位" align="center" prop="location" />
        <el-table-column label="库存数" align="center" prop="qty" />
        <el-table-column label="单位" align="center" prop="unit" />
        <el-table-column label="单位重量" align="center" prop="unit_weight" />
        <el-table-column label="总重量" align="center" prop="total_weight" />
        <el-table-column label="品质状态" align="center" prop="quality_status" />
      </el-table>
      <page
        :total="totalDialog"
        :current-page="pageDialog"
        @currentChange="currentChangeDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
import page from '@/components/page'
import { getMaterialInventoryManage } from '@/api/material-inventory-manage'
import { rubber_repertory_url, stage_global_url } from '@/api/display_static_fun'

export default {
  components: { page },
  data: function() {
    return {
      tableData: [],
      tableDataDialog: [],
      total: 0,
      getParams: {
        page: 1,
        page_size: 10
      },
      RubberStage: null,
      RubberStageOptions: [],
      dialogVisible: false,
      totalDialog: 0,
      pageDialog: 1,
      sulfurAddition: 0,
      sulfurFree: 0
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
        this.sulfurAddition = rubber_repertoryData.fm_count
        this.sulfurFree = rubber_repertoryData.other_count
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
      this.getParams['stage'] = this.RubberStage
      this.getParams.page = 1
      this.rubber_repertory_list()
    },
    currentChange(page) {
      this.getParams.page = page
      this.rubber_repertory_list()
    },
    clickMaterialNo() {
      this.dialogVisible = true
      this.getTableData()
    },
    handleClose(done) {
      done()
    },
    currentChangeDialog(page) {
      this.pageDialog = page
    },
    getTableData() {
      getMaterialInventoryManage({ page: this.pageDialog })
        .then(response => {
          this.tableDataDialog = response.results
          this.totalDialog = response.count
        })
    }
  }
}

</script>

<style lang="scss" scoped>
</style>

