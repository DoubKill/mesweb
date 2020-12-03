<template>
  <div style="margin-top: 25px">
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="planDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          @change="planDateChange"
        />
      </el-form-item>
      <el-form-item label="原材料类别">
        <el-select
          v-model="materialType"
          clearable
          placeholder="请选择"
          @change="materialTypeChange"
          @visible-change="materialTypeVisibleChange"
        >
          <el-option
            v-for="item in materialTypeOptions"
            :key="item.global_name"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="原材料名称">
        <el-input v-model="materialName" @input="materialNameChanged" />
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        label="S"
        prop="unit"
        width="30"
      />
      <el-table-column
        type="index"
        label="No"
        width="30"
      />
      <el-table-column
        prop="material_type"
        label="原材料类别"
      />
      <el-table-column
        prop="material_no"
        label="原材料代码"
      />
      <el-table-column
        prop="material_name"
        label="原材料名称"
      />
      <el-table-column
        prop="storage_weight"
        label="原材料库存（Kg）"
      />
      <el-table-column
        align="center"
        label="原材料需要量（Kg）"
      >
        <el-table-column
          prop="class_details.早班"
          label="早班"
        />
        <el-table-column
          prop="class_details.中班"
          label="中班"
        />
        <el-table-column
          prop="class_details.夜班"
          label="夜班"
        />
        <el-table-column
          label="总计"
        >
          <template slot-scope="scope">
            <span v-text="(scope.row.class_details.早班 ? scope.row.class_details.早班:0) + (scope.row.class_details.中班 ? scope.row.class_details.中班:0) + (scope.row.class_details.夜班 ? scope.row.class_details.夜班:0)" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="领料计划（Kg）"
      >
        <el-table-column
          label="早班"
        />
        <el-table-column
          label="中班"
        />
        <el-table-column
          label="夜班"
        />
        <el-table-column
          label="总计"
        />
      </el-table-column>
    </el-table>
    <page :total="total" :current-page="getParams.page" @currentChange="currentChange" />
  </div>
</template>

<script>
import { materialDemandeds, globalCodes } from '@/api/material-requisitions-plan'
import page from '@/components/page'
export default {
  components: { page },
  data: function() {
    return {
      tableData: [],
      planDate: null,
      materialType: '',
      materialName: '',
      materialTypeOptions: [],
      getParams: {
        page: 1
      },
      currentPage: 1,
      total: 0
    }
  },
  created() {
    this.getMaterialDemanded()
  },
  methods: {
    beforeGetData() {
      this.getParams['plan_date'] = this.planDate
      this.getParams['material_type'] = this.materialType
      this.getParams['material_name'] = this.materialName
    },
    planDateChange: function() {
      this.getParams.page = 1
      this.beforeGetData()
      this.getMaterialDemanded()
    },
    materialTypeVisibleChange(bool) {
      if (bool) {
        this.getMaterialType()
      }
    },
    materialTypeChange: function() {
      this.getParams.page = 1
      this.beforeGetData()
      this.getMaterialDemanded()
    },
    materialNameChanged: function() {
      this.getParams.page = 1
      this.beforeGetData()
      this.getMaterialDemanded()
    },
    getMaterialDemanded() {
      this.beforeGetData()
      materialDemandeds(this.getParams).then(response => {
        this.tableData = response.results
        this.total = response.count
      })
    },
    getMaterialType() {
      globalCodes({ 'class_name': '原材料类别' }).then(response => {
        this.materialTypeOptions = response.results
      })
    },
    currentChange(page) {
      this.getParams.page = page
      this.getMaterialDemanded()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
