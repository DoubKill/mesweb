<template>
  <div class="statisticalReportPrice">
    <!-- 绩效计算 单价表 -->
    <el-form :inline="true">
      <el-form-item style="float:right">
        <el-button
          v-permission="['equip_part','export']"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button
          v-permission="['equip_mtbf_mttr_setting', 'change']"
          type="primary"
          :loading="btnLoading"
          @click="submitFun"
        >保存
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
    >
      <el-table-column
        align="center"
        prop="state"
        label="段次"
        min-width="20"
      />
      <el-table-column
        align="center"
        prop="E580"
        label="E580"
        min-width="20"
      >
        <el-table-column
          align="center"
          prop="E580_pt"
          label="普通"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.E580_pt" controls-position="right" :min="0" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="E580_dj"
          label="丁基"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.E580_dj" controls-position="right" :min="0" :precision="2" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        prop="F370"
        label="F370"
        min-width="20"
      >
        <el-table-column
          align="center"
          prop="F370_pt"
          label="普通"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.F370_pt" controls-position="right" :min="0" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="F370_dj"
          label="丁基"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.F370_dj" controls-position="right" :min="0" :precision="2" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        prop="GK320"
        label="GK320"
        min-width="20"
      >
        <el-table-column
          align="center"
          prop="GK320_pt"
          label="普通"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.GK320_pt" controls-position="right" :min="0" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="GK320_dj"
          label="丁基"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.GK320_dj" controls-position="right" :min="0" :precision="2" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        prop="GK255"
        label="GK255"
        min-width="20"
      >
        <el-table-column
          align="center"
          prop="GK255_pt"
          label="普通"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.GK255_pt" controls-position="right" :min="0" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="GK255_dj"
          label="丁基"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.GK255_dj" controls-position="right" :min="0" :precision="2" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        prop="GK400"
        label="GK400"
        min-width="20"
      >
        <el-table-column
          align="center"
          prop="GK400_pt"
          label="普通"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.GK400_pt" controls-position="right" :min="0" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="GK400_dj"
          label="丁基"
          min-width="20"
        >
          <template slot-scope="{row}">
            <el-input-number v-model="row.GK400_dj" controls-position="right" :min="0" :precision="2" />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { exportExcel } from '@/utils/index'
import { performanceUnitPrice } from '@/api/jqy'
export default {
  name: 'StatisticalReportPrice',
  data() {
    return {
      options: [],
      tableData: [],
      loading: false,
      btnLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await performanceUnitPrice('get')
        this.tableData = data.result || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    exportTable() {
      exportExcel('绩效计算 单价表')
    },
    async submitFun() {
      try {
        console.log(this.tableData)
        this.btnLoading = true
        await performanceUnitPrice('post', null, { data: this.tableData })
        this.$message.success('保存成功')
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
      }
    }
  }
}
</script>

<style lang="scss">
    .statisticalReportPrice{
        .el-input-number{
            width:120px;
        }
    }
</style>
