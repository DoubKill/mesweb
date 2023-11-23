<template>
  <div class="output-details-summary">
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
      <el-form-item label="">
        <el-checkbox v-model="td_flag" @change="changeList">是否包含当日产量</el-checkbox>
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
      :cell-class-name="cellClassName"
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
            <span :style="{background:row['trains_max'] === item.global_name?'rgb(147,208,11)':row['trains_min'] === item.global_name?'rgb(218 123 123)':''}">
              {{ row['trains_'+item.global_name]?row['trains_'+item.global_name]:'' }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-for="item in groups" :key="item.id+'d'" :label="item.global_name" align="center">
        <el-table-column label="工作时长/班" align="center">
          <template slot-scope="{row}">
            <span :style="{background:row['days_max'] === item.global_name?'rgb(147,208,11)':row['days_min'] === item.global_name?'rgb(218 123 123)':''}">
              {{ row['days_'+item.global_name]?row['days_'+item.global_name]:'' }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-for="item in groups" :key="item.id+'a'" :label="item.global_name" align="center">
        <el-table-column label="停机时间/min" align="center">
          <template slot-scope="{row}">
            <span :style="{background:row['down_max'] === item.global_name?'rgb(147,208,11)':row['down_min'] === item.global_name?'rgb(218 123 123)':''}">
              {{ row['down_'+item.global_name]?row['down_'+item.global_name]:'' }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-for="item in groups" :key="item.id+'b'" :label="item.global_name" align="center">
        <el-table-column label="平均产量" align="center">
          <template slot-scope="{row}">
            <span :style="{background:row['ave_max'] === item.global_name?'rgb(147,208,11)':row['ave_min'] === item.global_name?'rgb(218 123 123)':''}">
              {{ row['ave_'+item.global_name]?row['ave_'+item.global_name]:'' }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="目标值"
        prop="target_trains"
      />
      <el-table-column v-for="item in groups" :key="item.id+'c'" :label="item.global_name" align="center">
        <el-table-column label="完成率%" align="center">
          <template slot-scope="{row}">
            <span :style="{background:row['completion_max'] === item.global_name?'rgb(147,208,11)':row['completion_min'] === item.global_name?'rgb(218 123 123)':''}">
              {{ row['completion_'+item.global_name]?row['completion_'+item.global_name]:'' }}
            </span>
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
      td_flag: false,
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
        // 平均产量=总产量/（工作时长-停机时间/60/12）
        // 完成率=平均产量/目标值
        this.tableData = data || []
        this.tableData.forEach(d => {
          let trainsMax = 0; let daysMax = 0; let downMax = 0; let aveMax = 0; let completionMax = 0
          let trainsMaxName = ''; let daysMaxName = ''; let downMaxName = ''; let aveMaxName = ''; let completionMaxName = ''
          let trainsMin = 0; let daysMin = 0; let downMin = 0; let aveMin = 0; let completionMin = 0
          let trainsMinName = ''; let daysMinName = ''; let downMinName = ''; let aveMinName = ''; let completionMinName = ''
          this.groups.forEach(dd => {
            d['ave_' + dd.global_name] = d['trains_' + dd.global_name] /
            (d['days_' + dd.global_name] - (d['down_' + dd.global_name] ? d['down_' + dd.global_name] / 60 / 12 : 0))
            d['ave_' + dd.global_name] = d['trains_' + dd.global_name] ? Math.round(d['ave_' + dd.global_name] * 100) / 100 : undefined

            d['completion_' + dd.global_name] = d['ave_' + dd.global_name] / d.target_trains
            d['completion_' + dd.global_name] = d['ave_' + dd.global_name] ? Math.round((d['completion_' + dd.global_name] * 100) * 100) / 100 : undefined

            if (d[`trains_${dd.global_name}`] > trainsMax) {
              trainsMax = d[`trains_${dd.global_name}`]
              trainsMaxName = dd.global_name
            }
            if (d[`days_${dd.global_name}`] > daysMax) {
              daysMax = d[`days_${dd.global_name}`]
              daysMaxName = dd.global_name
            }
            if (d[`down_${dd.global_name}`] > downMax) {
              downMax = d[`down_${dd.global_name}`]
              downMaxName = dd.global_name
            }
            if (d[`ave_${dd.global_name}`] > aveMax) {
              aveMax = d[`ave_${dd.global_name}`]
              aveMaxName = dd.global_name
            }
            if (d[`completion_${dd.global_name}`] > completionMax) {
              completionMax = d[`completion_${dd.global_name}`]
              completionMaxName = dd.global_name
            }
            if (trainsMin === 0 || d[`trains_${dd.global_name}`] < trainsMin) {
              trainsMin = d[`trains_${dd.global_name}`]
              trainsMinName = dd.global_name
            }
            if (daysMin === 0 || d[`days_${dd.global_name}`] < daysMin) {
              daysMin = d[`days_${dd.global_name}`]
              daysMinName = dd.global_name
            }
            if (downMin === 0 || d[`down_${dd.global_name}`] < downMin) {
              downMin = d[`down_${dd.global_name}`]
              downMinName = dd.global_name
            }
            if (aveMin === 0 || d[`ave_${dd.global_name}`] < aveMin) {
              aveMin = d[`ave_${dd.global_name}`]
              aveMinName = dd.global_name
            }
            if (completionMin === 0 || d[`completion_${dd.global_name}`] < completionMin) {
              completionMin = d[`completion_${dd.global_name}`]
              completionMinName = dd.global_name
            }
          })
          d.trains_max = trainsMaxName
          d.days_max = daysMaxName
          d.down_max = downMaxName
          d.ave_max = aveMaxName
          d.completion_max = completionMaxName
          d.trains_min = trainsMinName
          d.days_min = daysMinName
          d.down_min = downMinName
          d.ave_min = aveMinName
          d.completion_min = completionMinName
        })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.search.td_flag = this.td_flag ? 'Y' : undefined
      this.getList()
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
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
    }
  }
}
</script>

<style lang="scss">
.output-details-summary{
 .el-table td{
    padding:0 !important;
  }
  .el-table .cell{
    padding:0 !important;
  }
  .cell span{
    width: 100% !important;
    display: inline-block;
  }
}
</style>
