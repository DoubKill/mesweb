<template>
  <div class="statisticalReportPrice">
    <!-- 绩效计算 单价表 -->
    <el-form :inline="true">
      <el-form-item style="float:right">
        <el-button
          v-permission="['performance_unit_price','export']"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button
          v-permission="['performance_unit_price', 'save']"
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
        width="110"
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
            <span v-if="loading">{{ row.E580_pt }}</span>
            <el-input-number v-else v-model="row.E580_pt" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="E580_dj"
          label="丁基"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.E580_dj }}</span>
            <el-input-number v-else v-model="row.E580_dj" controls-position="right" :min="0" :max="99.99" :precision="2" />
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
            <span v-if="loading">{{ row.F370_pt }}</span>
            <el-input-number v-else v-model="row.F370_pt" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="F370_dj"
          label="丁基"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.F370_dj }}</span>
            <el-input-number v-else v-model="row.F370_dj" controls-position="right" :min="0" :max="99.99" :precision="2" />
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
            <span v-if="loading">{{ row.GK320_pt }}</span>
            <el-input-number v-else v-model="row.GK320_pt" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="GK320_dj"
          label="丁基"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.GK320_dj }}</span>
            <el-input-number v-else v-model="row.GK320_dj" controls-position="right" :min="0" :max="99.99" :precision="2" />
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
            <span v-if="loading">{{ row.GK255_pt }}</span>
            <el-input-number v-else v-model="row.GK255_pt" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="GK255_dj"
          label="丁基"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.GK255_dj }}</span>
            <el-input-number v-else v-model="row.GK255_dj" controls-position="right" :min="0" :max="99.99" :precision="2" />
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
            <span v-if="loading">{{ row.GK400_pt }}</span>
            <el-input-number v-else v-model="row.GK400_pt" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="GK400_dj"
          label="丁基"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.GK400_dj }}</span>
            <el-input-number v-else v-model="row.GK400_dj" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="辅助"
        min-width="20"
      >
        <el-table-column
          align="center"
          prop="fz_pt"
          label="普通"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.fz_pt }}</span>
            <el-input-number v-else v-model="row.fz_pt" controls-position="right" :min="0" :max="99.99" :precision="2" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="fz_dj"
          label="丁基"
          min-width="20"
        >
          <template slot-scope="{row}">
            <span v-if="loading">{{ row.fz_dj }}</span>
            <el-input-number v-else v-model="row.fz_dj" controls-position="right" :min="0" :max="99.99" :precision="2" />
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
    async exportTable() {
      await this.$set(this, 'loading', true)
      await exportExcel('绩效计算 单价表')
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    async submitFun() {
      try {
        this.tableData.forEach(d => {
          if (!d.E580_pt || !d.E580_dj || !d.F370_pt || !d.F370_dj || !d.GK320_pt ||
          !d.GK320_dj || !d.GK255_pt || !d.GK255_dj || !d.GK400_pt || !d.GK400_dj || !d.fz_pt || !d.fz_dj) {
            throw new Error('单价数据必填')
          }
        })
        this.btnLoading = true
        await performanceUnitPrice('post', null, { data: this.tableData })
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
            width:110px;
        }
    }
</style>
