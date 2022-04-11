<template>
  <div class="statisticalReportMixing">
    <!-- 密炼机台产量汇总表 -->
    <el-form :inline="true">
      <el-form-item label="工厂日期">
        <el-date-picker
          v-model="search.factory_date"
          type="date"
          :clearable="false"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择工厂日期"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="search.auto" @change="changeList">自动生产</el-checkbox>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="search.manual" @change="changeList">手动生产</el-checkbox>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          type="primary"
          @click="getList"
        >查询</el-button>
        <el-button
          v-permission="['summary_of_mill_output','export']"
          type="primary"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      style="width: 100%"
      :span-method="objectSpanMethod"
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
        factory_date: setDate(),
        auto:true,
        manual:true
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
        this.spanArr = []
        this.pos = null
        for (var i = 0; i < this.tableData.length; i++) {
          if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
            this.spanArr.push(1)
            this.pos = 0
          } else {
            if (this.tableData[i].equip_no === this.tableData[i - 1].equip_no) {
              // 如果a相等就累加，并且push 0  这里是根据一样的a匹配
              this.spanArr[this.pos] += 1
              this.spanArr.push(0)
            } else {
              // 不相等push 1
              this.spanArr.push(1)
              this.pos = i
            }
          }
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      this.getList()
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([0].includes(columnIndex) && this.spanArr) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
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
