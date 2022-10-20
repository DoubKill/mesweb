<template>
  <div>
    <!-- 班组产量明细汇总 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.target_month"
          type="month"
          value-format="yyyy-MM"
          format="yyyy-MM"
          placeholder="选择月"
          :clearable="false"
          @change="getList"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        label="产量汇总"
        align="center"
        :fixed="!btnExportLoad"
      >
        <el-table-column label="班组" align="center" prop="equip_no" />
      </el-table-column>
      <el-table-column v-for="item in groups" :key="item.id" :label="item.global_name" align="center">
        <el-table-column label="总产量/车" align="center">
          <template slot-scope="{row}">
            {{ row['trains_'+item.global_name]?row['trains_'+item.global_name]:'' }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-for="item in groups" :key="item.id+'d'" :label="item.global_name" align="center">
        <el-table-column label="工作时长/天" align="center">
          <template slot-scope="{row}">
            {{ row['days_'+item.global_name]?row['days_'+item.global_name]:'' }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-for="item in groups" :key="item.id+'a'" :label="item.global_name" align="center">
        <el-table-column label="停机时间/min" align="center">
          <template slot-scope="{row}">
            {{ row['down_'+item.global_name]?row['down_'+item.global_name]:'' }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-for="item in groups" :key="item.id+'b'" :label="item.global_name" align="center">
        <el-table-column label="平均产量" align="center">
          <template slot-scope="{row}">
            {{ row['ave_'+item.global_name]?row['ave_'+item.global_name]:'' }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="目标值"
        prop="target_trains"
      />
      <el-table-column v-for="item in groups" :key="item.id+'c'" :label="item.global_name" align="center">
        <el-table-column label="完成率" align="center">
          <template slot-scope="{row}">
            {{ row['completion_'+item.global_name]?row['completion_'+item.global_name]+'%':'' }}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { setDate, exportExcel } from '@/utils'
import { groupProductionSummary } from '@/api/base_w_two'
import { globalCodesUrl } from '@/api/base_w'
export default {
  name: 'OutputDetailsSummary',
  data() {
    return {
      search: {
        target_month: setDate(null, null, 'month')
      },
      groups: [],
      tableData: [],
      btnExportLoad: false,
      loading: false
    }
  },
  async created() {
    await this.getClassGroup()
    await this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await groupProductionSummary('get', null, { params: this.search })
        // 平均产量=总产量/（工作时长-停机时间/60/24）
        // 完成率=平均产量/目标值
        this.tableData = data || []
        this.tableData.forEach(d => {
          this.groups.forEach(dd => {
            d['ave_' + dd.global_name] = d['trains_' + dd.global_name] /
            (d['days_' + dd.global_name] - (d['down_' + dd.global_name] ? d['down_' + dd.global_name] / 60 / 24 : 0))
            d['ave_' + dd.global_name] = d['trains_' + dd.global_name] ? Math.round(d['ave_' + dd.global_name] * 100) / 100 : ''

            d['completion_' + dd.global_name] = d['ave_' + dd.global_name] / d.target_trains
            d['completion_' + dd.global_name] = d['ave_' + dd.global_name] ? Math.round((d['completion_' + dd.global_name] * 100) * 100) / 100 : ''
          })
        })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    getClassGroup(val) {
      globalCodesUrl('get', {
        params: {
          class_name: '班组'
        }
      }).then((response) => {
        this.groups = response.results
      }).catch(function() {
        this.groups = []
      })
    },
    exportTable() {
      this.btnExportLoad = true
      setTimeout(d => {
        exportExcel('班组产量明细汇总', '综合合格率汇总')
        this.btnExportLoad = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
