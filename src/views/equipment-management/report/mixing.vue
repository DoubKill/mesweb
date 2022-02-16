<template>
  <div class="statisticalReportMixing">
    <!-- 密炼机台产量汇总表 -->
    <el-form :inline="true">
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="search.date"
          type="date"
          :clearable="false"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择工厂日期"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="getList"
        >查询</el-button>
        <el-button
          v-permission="['monthly_output_statistics_and_performance','export']"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      style="width: 100%"
      :data="tableData"
      border
    >
      <el-table-column width="120px">
        <template
          slot="header"
          slot-scope="{row}"
        >
          <span v-if="false">{{ row }}</span>
          <div v-if="!exportTableShow" class="header-style">
            <div style="width:100%;text-align:right;margin:8px 0 20px 0">段次</div>
            <span>机台</span>
            <div class="header-style-line three-line" />
          </div>
          <div v-else>机台</div>
        </template>
        <template
          slot-scope="{row}"
        >
          <span>{{ row.equip_no }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        align="center"
        label=""
        width="90"
      />
      <el-table-column
        v-for="(d,index) in tableHead"
        :key="Date.now()+index"
        align="center"
        :label="d"
        min-width="40"
      >
        <el-table-column
          align="center"
          :prop="d+'-早'"
          label="早"
          min-width="20"
        />
        <el-table-column
          align="center"
          :prop="d+'-晚'"
          label="晚"
          min-width="20"
        />
      </el-table-column>
      <el-table-column
        prop="count"
        align="center"
        label="合计"
        width="90"
      />
    </el-table>
  </div>
</template>

<script>
import { summaryOfMillOutput } from '@/api/jqy'
import { exportExcel } from '@/utils/index'
import { setDate } from '@/utils'
export default {
  name: 'StatisticalReportMixing',
  data() {
    return {
      search: {
        date: setDate()
      },
      machineList: [],
      loading: false,
      tableHead: [],
      tableData: [],
      exportTableShow: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await summaryOfMillOutput('get', null, { params: this.search })
        this.tableHead = data.state_list || []
        this.tableData = data.results.concat(data.count)
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.getList()
    },
    async exportTable() {
      await this.$set(this, 'exportTableShow', true)
      await exportExcel('密炼机台产量汇总表')
      setTimeout(() => {
        this.exportTableShow = false
      }, 300)
    }
  }
}
</script>

<style lang="scss">
.statisticalReportMixing{
    .el-table th{
        padding:0;
    }
    .header-style{
        position: relative;
    }
    .header-style-line{
        height: 1px;
        background:  #e4e6e9;
    }
    .three-line{
        transform-origin:left center;
        transform:rotate(31.5deg);
        width:140px;
        position: absolute;
        top:-8px;
        left:-6px;
    }
    .el-table .wl-row{
        background: #F6ECFF;
    }
}
</style>
