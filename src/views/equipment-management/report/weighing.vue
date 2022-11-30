<template>
  <div>
    <!-- 称量机台产量汇总表 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.factory_date"
          type="month"
          :clearable="false"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button
          v-permission="['summary_of_weighing_output','export']"
          type="primary"
          @click="exportTable('产量')"
        >导出产量汇总Excel</el-button>
      </el-form-item>

      <el-form-item v-permission="['summary_of_weighing_output','save']" style="float:right">
        <el-table
          :data="tableDataPrice"
          style="width:400px"
          border
        >
          <el-table-column
            prop="xl"
            align="center"
            label="细料单价"
          >
            <template slot-scope="{row}">
              <el-input-number v-model="row.xl" controls-position="right" :min="0" :precision="2" />
            </template>
          </el-table-column>
          <el-table-column
            prop="lh"
            align="center"
            label="硫磺单价"
          >
            <template slot-scope="{row}">
              <el-input-number v-model="row.lh" controls-position="right" :min="0" :precision="2" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-permission="['summary_of_weighing_output','save']" style="float:right">
        <el-button v-permission="['summary_of_weighing_output','save']" :loading="btnLoading" type="primary" @click="savePrice">保存单价</el-button>
      </el-form-item>
    </el-form>
    <h3 style="font-size:17px;font-weight:bold">称量机台产量汇总表（包数）</h3>
    <el-table
      :id="exportTableShow?'out-table':'false'"
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        :fixed="!isExport"
        prop="equip_no"
        align="center"
        label="机台"
        width="90"
      />
      <el-table-column
        v-for="(d,index) in tableHead"
        :key="Date.now()+index"
        align="center"
        :label="d.label"
        width="120"
      >
        <el-table-column
          :prop="d.prop+'早班'"
          align="center"
          label="早班"
          width="60"
        />
        <el-table-column
          :prop="d.prop+'中班'"
          align="center"
          label="中班"
          width="60"
        />
        <el-table-column
          :prop="d.prop+'夜班'"
          align="center"
          label="夜班"
          width="60"
        />
      </el-table-column>
      <el-table-column
        prop="hj"
        align="center"
        label="合计"
        width="90"
      />
    </el-table>
    <br>
    <div v-permission="['summary_of_weighing_output','save']">
      <el-form>
        <el-form-item>
          <span style="font-size:17px;font-weight:bold">称量机台员工绩效计算</span>
          <el-button
            v-permission="['summary_of_weighing_output','export']"
            style="margin-left:20px"
            type="primary"
            @click="exportTable('绩效')"
          >导出员工绩效Excel</el-button>
          <el-button
            v-permission="['summary_of_weighing_output','export']"
            style="margin-left:20px"
            type="primary"
            :loading="btnExportLoad"
            @click="exportTable1"
          >导出员工考勤</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :id="exportTableShow?'false':'out-table'"
        v-loading="loading"
        :data="tableDataUser"
        border
      >
        <el-table-column
          :fixed="!isExport"
          prop="name"
          align="center"
          label="姓名"
          width="90"
        />
        <el-table-column
          v-for="(d,index) in tableHead"
          :key="Date.now()+index"
          align="center"
          :label="d.label"
          width="120"
        >
          <el-table-column
            align="center"
            label="早班"
            width="60"
          >
            <template slot-scope="{row}">
              <el-link
                type="primary"
                @click="dialogResult(row,d.prop,'早班')"
              >{{ row[d.prop+'早班'] }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="中班"
            width="60"
          >
            <template slot-scope="{row}">
              <el-link
                type="primary"
                @click="dialogResult(row,d.prop,'中班')"
              >{{ row[d.prop+'中班'] }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="夜班"
            width="60"
          >
            <template slot-scope="{row}">
              <el-link
                type="primary"
                @click="dialogResult(row,d.prop,'夜班')"
              >{{ row[d.prop+'夜班'] }}</el-link>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="xl"
          align="center"
          label="细料合计"
          width="90"
        />
        <el-table-column
          prop="lh"
          align="center"
          label="硫磺合计"
          width="90"
        />
      </el-table>
    </div>
    <el-dialog
      title="配料明细"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-table
        v-loading="loadingDialog"
        max-height="600"
        :data="tableDataDialog"
        :span-method="objectSpanMethod"
        border
      >
        <el-table-column
          prop="equip_no"
          align="center"
          label="机台"
          min-width="90"
        />
        <el-table-column
          prop="section"
          align="center"
          label="岗位"
          min-width="90"
        />
        <el-table-column
          prop="num"
          align="center"
          label="包数"
          min-width="90"
        />
        <el-table-column
          prop="total"
          align="center"
          label="合计"
          min-width="90"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { summaryOfWeighingOutput, setThePrice, summaryOfWeighingOutputDown } from '@/api/jqy'
import { exportExcel } from '@/utils/index'
import { setDate } from '@/utils'
export default {
  name: 'StatisticalReportWeighing',
  data() {
    return {
      search: {
        factory_date: setDate(null, null, 'month')
      },
      btnExportLoad: false,
      isExport: false,
      machineList: [],
      loadingDialog: false,
      dialogVisible: false,
      tableDataDialog: [],
      loading: false,
      tableHead: [],
      btnLoading: false,
      tableDataPrice: [{ lh: 0, xl: 0 }],
      tableData: [],
      tableDataUser: [],
      exportTableShow: false
    }
  },
  created() {
    this.tableHead = getDiffDate(this.search.factory_date + '-01', getCurrentMonthLastDay(setDate()))
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await summaryOfWeighingOutput('get', null, { params: this.search })
        const data1 = await setThePrice('get', null, {})
        this.tableData = data.results || []
        this.tableDataUser = data.users || []
        this.tableDataPrice = data1.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    async savePrice() {
      try {
        this.tableDataPrice.forEach(d => {
          if (!d.xl || !d.xl) {
            throw new Error('单价数据必填')
          }
        })
        this.btnLoading = true
        const obj = { lh: this.tableDataPrice[0].lh, xl: this.tableDataPrice[0].xl }
        await setThePrice('post', null, { data: obj })
        this.$message.success('保存成功')
        this.getList()
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
        if (e.message) {
          this.$message(e.message)
        }
      }
    },
    changeList() {
      this.tableHead = getDiffDate(this.search.factory_date + '-01', getCurrentMonthLastDay(this.search.factory_date))
      this.getList()
    },
    async dialogResult(row, day, classes) {
      try {
        this.dialogVisible = true
        this.loadingDialog = true
        const data = await summaryOfWeighingOutput('get', null, { params: { factory_date: this.search.factory_date, name: row.name, day: day, classes: classes }})
        this.loadingDialog = false
        this.tableDataDialog = data.detail
        this.tableDataDialog.forEach(d => {
          d.total = data.user_total[d.equip_no]
        })
        if (this.tableDataDialog.length > 0) {
          this.tableDataDialog.push({
            equip_no: '合计',
            total: sum(this.tableDataDialog, 'num')
          })
        }
        this.spanArr = []
        this.pos = null
        for (var i = 0; i < this.tableDataDialog.length; i++) {
          if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
            this.spanArr.push(1)
            this.pos = 0
          } else {
            if (this.tableDataDialog[i].equip_no === this.tableDataDialog[i - 1].equip_no) {
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
      } catch (e) {
        this.loadingDialog = false
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([0, 3].includes(columnIndex) && this.spanArr) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    debounceList() {
      this.$debounce(this, 'getList')
    },
    exportTable1() {
      this.btnExportLoad = true
      const obj = Object.assign({ export: 1 }, this.search)
      const _api = summaryOfWeighingOutputDown
      _api(obj)
        .then(res => {
          const link = document.createElement('a')
          const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = `配料间实际考勤数据${setDate('', true)}.xlsx` // 下载的文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.btnExportLoad = false
        }).catch(e => {
          this.btnExportLoad = false
        })
    },
    exportTable(val) {
      if (val === '产量') {
        setTimeout(d => {
          this.isExport = true
          this.$set(this, 'exportTableShow', true)
          setTimeout(d => {
            exportExcel('称量机台产量汇总表(包数)')
            this.isExport = false
          }, 1000)
        }, 100)
      } else {
        setTimeout(d => {
          this.isExport = true
          this.$set(this, 'exportTableShow', false)
          setTimeout(d => {
            exportExcel('称量机台员工绩效计算')
            this.isExport = false
          }, 1000)
        }, 100)
      }
    //   this.btnExportLoad = true
    //   const obj = {
    //     date: this.search.date
    //   }
    //   summaryOfWeighingOutput(obj).then(response => {
    //     const link = document.createElement('a')
    //     const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
    //     link.style.display = 'none'
    //     link.href = URL.createObjectURL(blob)
    //     link.download = '员工出勤记录表' + setDate() + '.xlsx'// 下载的文件名
    //     document.body.appendChild(link)
    //     link.click()
    //     document.body.removeChild(link)
    //     this.btnExportLoad = false
    //   })
    //     .catch(e => {
    //       this.btnExportLoad = false
    //     })
    }
  }
}
function getDiffDate(start, end) {
  var startTime = getDate(start)
  var endTime = getDate(end)
  var dateArr = []
  while ((endTime.getTime() - startTime.getTime()) >= 0) {
    var d = startTime.getDate()
    dateArr.push({ label: d + '日', prop: d })
    startTime.setDate(startTime.getDate() + 1)
  }
  return dateArr
}
function getDate(datestr) {
  var temp = datestr.split('-')
  if (temp[1] === '01') {
    temp[0] = parseInt(temp[0], 10) - 1
    temp[1] = '12'
  } else {
    temp[1] = parseInt(temp[1], 10) - 1
  }
  // new Date()的月份入参实际都是当前值-1
  var date = new Date(temp[0], temp[1], temp[2])
  return date
}
function getCurrentMonthLastDay(d) {
  const date = new Date(d)
  let currentMonth = date.getMonth()
  const nextMonth = ++currentMonth
  const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
  const oneDay = 1000 * 60 * 60 * 24
  const lastTime = new Date(nextMonthFirstDay - oneDay)
  let month = parseInt(lastTime.getMonth() + 1)
  let day = lastTime.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return date.getFullYear() + '-' + month + '-' + day
}
function sum(arr, params) {
  var s = 0
  arr.forEach(function(val, idx, arr) {
    const a = val[params] ? Number(val[params]) : 0
    s += a
  }, 0)
  s = Math.round(s * 100) / 100
  return s
}
</script>

<style lang="scss">
</style>
