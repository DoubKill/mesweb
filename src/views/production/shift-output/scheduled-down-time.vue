<template>
  <div>
    <!-- 计划停机时间 -->
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
        <el-button type="primary" :disabled="btnExportLoad" @click="exportTable">导出Excel</el-button>
        <el-button>
          <a
            :href="`${templateFileUrl}scheduled-down-time.xlsx`"
            download="计划停机时间导入模板.xlsx"
          >导出Excel模板</a>
        </el-button>
        <el-upload
          style="margin-left:8px;display:inline-block"
          action="string"
          accept=".xls, .xlsx"
          :http-request="Upload"
          :show-file-list="false"
        >
          <el-button>导入Excel</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <h3 style="display: inline-block;margin:0">单位：min</h3>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
      :span-method="arraySpanMethod"
    >
      <el-table-column :fixed="!btnExportLoad" prop="equip_no" label="机台" width="100" />
      <el-table-column :key="1" label="日期" align="center">
        <el-table-column label="班次" align="center">
          <el-table-column label="班别" width="50" align="center" />
        </el-table-column>
      </el-table-column>
      <el-table-column v-for="(item,_key) in headData" :key="_key+new Date().getTime()" :label="_key.split('-')[0]" align="center">
        <el-table-column :label="_key.split('-')[1]" align="center">
          <el-table-column :label="item" align="center">
            <template slot-scope="{row}">
              {{ row[_key+'-'+item] }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { setDate, exportExcel } from '@/utils'
import { equipDownDetail } from '@/api/base_w_five'
export default {
  name: 'ScheduledDownTime',
  data() {
    return {
      search: {
        target_month: setDate(null, null, 'month')
      },
      tableData: [],
      headData: {},
      btnExportLoad: false,
      loading: false
    }
  },
  created() {
    this.templateFileUrl = process.env.BASE_URL
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipDownDetail('get', null, { params: this.search })
        this.headData = data.table_head || []
        this.tableData = data.data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return [1, 2]
      } else if (columnIndex === 1) {
        return [0, 0]
      }
    },
    exportTable() {
      this.btnExportLoad = true
      setTimeout(d => {
        exportExcel('计划停机时间', '综合合格率汇总')
        this.btnExportLoad = false
      })
    },
    Upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      equipDownDetail('post', null, { data: formData }).then(response => {
        this.$message({
          type: 'success',
          message: response
        })
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
