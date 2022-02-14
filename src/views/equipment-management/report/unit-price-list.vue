<template>
  <div class="statisticalReportPrice">
    <!-- 绩效计算 单价表 -->
    <el-button
      v-permission="['equip_mtbf_mttr_setting', 'change']"
      type="primary"
      style="margin-bottom:10px;float:right"
      :loading="btnLoading"
      @click="submitFun"
    >保存
    </el-button>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      element-loading-spinner="el-icon-loading"
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
import { equipTargetMtbmttrSettings } from '@/api/base_w_four'
export default {
  name: 'StatisticalReportPrice',
  data() {
    return {
      options: [],
      tableData: [{ E580_pt: 1 }],
      loading: false,
      btnLoading: false
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipTargetMtbmttrSettings('get')
        this.tableData = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async submitFun() {
      try {
        console.log(this.tableData)
        this.btnLoading = true
        await equipTargetMtbmttrSettings('post', null, { data: this.tableData })
        this.$message.success('保存成功')
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
        if (e.message) {
          this.$message(e.message)
        }
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
