
<template>
  <div v-loading="loading">
    <!-- 胶架进出登记表汇总 -->
    <el-form :inline="true">
      <el-form-item label="年份">
        <el-date-picker
          v-model="search.target_month"
          type="year"
          :clearable="false"
          format="yyyy"
          value-format="yyyy"
          placeholder="选择年"
          @change="getList"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="['rubber_log', 'export']"
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      :data="tableData"
      :span-method="arraySpanMethod"
      border
    >
      <el-table-column
        prop="day"
        align="center"
        min-width="120"
        label="胶架进出"
        :fixed="!isExport"
      />
      <el-table-column
        v-for="(item) in tableheader"
        :key="item"
        align="center"
        :label="item"
      >
        <el-table-column align="center" label="进">
          <el-table-column align="center" label="大" min-width="120">
            <template slot-scope="{row}">
              <span v-if="row.day=='结余(大)'||row.day=='结余(小)'">{{ row[item] }}</span>
              <span v-if="row.day!=='结余(大)'&&row.day!=='结余(小)'">{{ row[item+'-进-大'] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="小" min-width="120">
            <template slot-scope="{row}">
              <span>{{ row[item+'-进-小'] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="出">
          <el-table-column align="center" label="大" min-width="120">
            <template slot-scope="{row}">
              <span v-if="row.day=='结余(大)'||row.day=='结余(小)'">{{ row[item] }}</span>
              <span v-if="row.day!=='结余(大)'&&row.day!=='结余(小)'">{{ row[item+'-出-大'] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="小" min-width="120">
            <template slot-scope="{row}">
              <span>{{ row[item+'-出-小'] }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { setDate, exportExcel } from '@/utils'
import { rubberLog } from '@/api/jqy'
export default {
  name: 'RubberAccessRepairTotal',
  data() {
    return {
      search: { target_month: setDate(null, null, 'year').toString(), display_type: 1 },
      loading: false,
      tableheader: [],
      btnExportLoad: false,
      isExport: false,
      btnLoading: false,
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        this.tableData = []
        const data = await rubberLog('get', null, { params: this.search })
        this.tableheader = data.title
        if (this.tableheader.length > 0) {
          this.tableheader.unshift('总计')
        }
        this.tableData = data.results || []
        this.tableData.forEach(d => {
          if (d.day === 32) {
            d.day = '合计'
          }
          if (d.day === 33) {
            d.day = '结余(大)'
          }
          if (d.day === 34) {
            d.day = '结余(小)'
          }
        })
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      const length1 = this.tableheader.concat(this.tableheaderAdd).length
      const length = this.tableData.length
      if (rowIndex === length - 1 || rowIndex === length - 2) {
        if (columnIndex <= (4 * length1)) {
          if ((columnIndex - 1) % 4 === 0) {
            return {
              rowspan: 1,
              colspan: 4
            }
          } else if (columnIndex === 0) {
            return {
              rowspan: 1,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    },
    async exportTable() {
      this.btnExportLoad = true
      this.loading = true
      setTimeout(d => {
        this.isExport = true
        setTimeout(d => {
          exportExcel('胶架进出登记表汇总')
          this.isExport = false
          this.btnExportLoad = false
          this.loading = false
        }, 1000)
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
