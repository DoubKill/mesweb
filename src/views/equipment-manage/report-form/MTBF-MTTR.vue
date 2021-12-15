<template>
  <div>
    <!-- MTBF/MTTR分析报表 -->
    <el-form :inline="true">
      <el-form-item label="起始月份">
        <el-date-picker
          v-model="search.s_time"
          type="month"
          value-format="yyyy-MM"
          format="yyyy-MM"
          placeholder="选择月"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getHeadSearch">查询</el-button>
        <el-button
          type="primary"
          :loading="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
        <el-button type="primary" @click="dialogVisible=true">目标MTBF/MTTR查看</el-button>
      </el-form-item>
    </el-form>
    <el-table
      id="out-table"
      v-loading="loading"
      :data="tableData"
      :span-method="objectSpanMethod"
      border
    >
      <el-table-column
        prop="equip_no"
        label="机台"
        min-width="20"
      />
      <el-table-column
        prop="content"
        label="内容"
        width="130"
      />
      <template v-for="(d,index) in tableHead">
        <el-table-column
          :key="index"
          :prop="d"
          :label="d"
          min-width="20"
        />
      </template>
    </el-table>
    <el-dialog
      :title="'MTBF/MTTR'"
      width="80%"
      :visible.sync="dialogVisible"
    >
      <mtbf />
    </el-dialog>
  </div>
</template>

<script>
import { equipMtbfmttpStatement } from '@/api/jqy'
import { exportExcel } from '@/utils/index'
import mtbf from '../master-data/MTBF-MTTR'
export default {
  name: 'EquipmentReportFormMTBFMTTR',
  components: { mtbf },
  data() {
    return {
      dateValue: [],
      btnExportLoad: false,
      search: { s_time: '' },
      tableHead: null,
      dialogVisible: false,
      loading: false,
      tableData: []
    }
  },
  created() {
    this.search.s_time = new Date().getFullYear() + '-01'
    this.tableHead = getHead(this.search.s_time)
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipMtbfmttpStatement('get', null, { params: this.search })
        this.tableData = data
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
    getHeadSearch() {
      if (!this.search.s_time) {
        this.$message('查询请先选择起始月份')
        return
      }
      this.tableHead = getHead(this.search.s_time)
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
    exportTable() {
      exportExcel('MTBF/MTTR分析报表')
      // const obj = Object.assign({ export: 1 }, this.search)
      // const _api = equipWarehouseRecord
      // _api('get', null, { params: obj, responseType: 'blob' })
      //   .then(res => {
      //     const link = document.createElement('a')
      //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
      //     link.style.display = 'none'
      //     link.href = URL.createObjectURL(blob)
      //     link.download = '备件出入库履历.xlsx' // 下载的文件名
      //     document.body.appendChild(link)
      //     link.click()
      //     document.body.removeChild(link)
      //     this.btnExportLoad = false
      //   }).catch(e => {
      //     this.btnExportLoad = false
      //   })
    }
  }
}
function getHead(month) {
  var dataArr = []
  var data = new Date(month)
  if (month.split('-')[1].split('0').length > 1) {
    month.split('-')[1] = month.split('-')[1].split('0')[1]
  }
  data.setMonth(month.split('-')[1] - 2)// 获取到当前月份,设置月份
  for (var i = 0; i < 12; i++) {
    data.setMonth(data.getMonth() + 1)// 每次循环一次 月份值加1
    var y = data.getFullYear()
    var m = data.getMonth() + 1
    m = m < 10 ? '0' + m : m
    dataArr.push(y + '年' + m + '月')
  }
  return dataArr
}
</script>

<style>

</style>

