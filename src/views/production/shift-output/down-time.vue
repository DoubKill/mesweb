<template>
  <div>
    <!-- 各班机台停机时间汇总 -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="searchDate"
        />
      </el-form-item>
      <el-form-item label="机台">
        <el-select
          v-model="search.equip_no"
          placeholder="请选择"
          clearable
          @change="getList"
        >
          <el-option
            v-for="item in optionsEquip"
            :key="item.id"
            :label="item.equip_no"
            :value="item.equip_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班组">
        <el-select
          v-model="search.group"
          placeholder="请选择"
          clearable
          @change="getList"
        >
          <el-option
            v-for="(item,key) in optionsGroup"
            :key="key"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="exportTable('停机')">导出停机时间汇总Excel</el-button>
        <el-button type="primary" @click="exportTable('生产')">导出生产分析汇总Excel</el-button>
      </el-form-item>
    </el-form>
    <h3 style="font-size:17px;font-weight:bold">各班机台停机时间汇总</h3>
    <el-table
      :id="exportTableShow?'out-table':'false'"
      v-loading="loading"
      :data="tableData"
      border
    >
      <el-table-column
        align="center"
        label="日期"
        prop="factory_date"
      />
      <el-table-column
        align="center"
        label="机台"
        prop="equip_no"
      />
      <el-table-column
        align="center"
        label="班次"
        prop="classes"
      />
      <el-table-column
        align="center"
        label="班组"
        prop="group"
      />
      <el-table-column
        align="center"
        label="班次"
        prop="times"
      />
      <el-table-column
        align="center"
        label="时间范围"
      >
        <template slot-scope="{row}">
          <span>{{ row.begin_time+'-'+row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="停机时间/min"
        prop="times"
      />
      <el-table-column
        align="center"
        label="停机原因分析"
        prop="down_reason"
      />
      <el-table-column
        align="center"
        label="停机类型"
        prop="down_type"
      />
      <el-table-column
        align="center"
        label="时间排名"
        prop="index"
      />
    </el-table>
    <h3 style="font-size:17px;font-weight:bold">生产分析汇总</h3>
    <el-table
      :id="exportTableShow?'false':'out-table'"
      v-loading="loading"
      :max-height="450"
      :span-method="arraySpanMethod"
      :data="tableDataBottom"
      border
    >
      <el-table-column
        align="center"
        label="序号"
        prop="index"
      >
        <template slot-scope="{row}">
          <el-link v-if="row.super" type="primary" @click="lookLink(row.index)">{{ row.index }}</el-link>
          <span v-else>{{ row.index }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="规格"
        prop="product_no"
      />
      <el-table-column
        align="center"
        label="实际产量"
        prop="actual_trains"
      />
      <el-table-column
        align="center"
        label="单车总耗时(S)"
        prop="classes"
      >
        <el-table-column
          align="center"
          label="密炼时间"
          prop="s_mixer_time"
        />
        <el-table-column
          align="center"
          label="间隔时间"
          prop="s_interval_time"
        />
      </el-table-column>
      <el-table-column
        align="center"
        label="总耗时"
        prop="all_times"
      />
      <el-table-column
        align="center"
        label="占比(%)"
        prop="ratio"
      />
    </el-table>
    <el-dialog
      :title="a_type+'-停机时间汇总'"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-table
        v-loading="loadingDialog"
        max-height="600"
        :data="tableDataDialog"
        border
      >
        <el-table-column
          prop="down_reason"
          align="center"
          :label="a_type+'-停机明细'"
        />
        <el-table-column
          prop="down_time"
          align="center"
          label="停机时间/min"
        />
        <el-table-column
          prop="ratio"
          align="center"
          label="占比(%)"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setDate, exportExcel } from '@/utils'
import { getEquip } from '@/api/banburying-performance-manage'
import { equipDownSummary } from '@/api/jqy'
import { globalCodesUrl } from '@/api/base_w'

export default {
  name: 'DownTime',
  components: { },
  data() {
    return {
      search: {},
      searchTop: {},
      searchBottom: {},
      dialogVisible: false,
      loadingDialog: false,
      tableDataDialog: [],
      exportTableShow: false,
      dateValue: [setDate(), setDate()],
      list1: [],
      list2: [],
      a_type: '',
      optionsEquip: [],
      optionsGroup: [],
      tableData: [],
      tableDataBottom: [],
      loading: false
    }
  },
  created() {
    this.search.st = setDate()
    this.search.et = setDate()
    this.getList()
    this.visibleChange()
    this.getClassGroup()
  },
  methods: {
    getClassGroup() {
      globalCodesUrl('get', {
        params: {
          class_name: '班组'
        }
      }).then((response) => {
        this.optionsGroup = response.results
      }).catch(function() {
      })
    },
    visibleChange() {
      const obj = { all: 1, category_name: '密炼设备' }
      getEquip(obj).then(response => {
        this.optionsEquip = response.results
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex >= this.list1.length) {
        if (columnIndex === 0) {
          return [1, 5]
        } else if (columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
          return [0, 0]
        }
      }
    },
    exportTable(val) {
      if (val === '停机') {
        setTimeout(d => {
          this.$set(this, 'exportTableShow', true)
          setTimeout(d => {
            exportExcel('各班机台停机时间汇总', '综合合格率汇总')
          }, 1000)
        }, 100)
      } else {
        setTimeout(d => {
          this.$set(this, 'exportTableShow', false)
          setTimeout(d => {
            exportExcel('生产分析汇总', '综合合格率汇总')
          }, 1000)
        }, 100)
      }
    },
    searchDate(arr) {
      this.search.st = arr ? arr[0] : ''
      this.search.et = arr ? arr[1] : ''
      this.getList()
    },
    async lookLink(val) {
      try {
        this.dialogVisible = true
        this.loadingDialog = true
        var obj = JSON.parse(JSON.stringify(this.searchBottom))
        obj.detail = 1
        obj.down_type = val.split('-')[0]
        this.a_type = val.split('-')[0]
        const data = await equipDownSummary('get', null, { params: obj })
        this.loadingDialog = false
        this.tableDataDialog = data.results
      } catch (e) {
        this.loadingDialog = false
      }
    },
    async getList() {
      try {
        this.loading = true
        this.searchTop = JSON.parse(JSON.stringify(this.search))
        this.searchBottom = JSON.parse(JSON.stringify(this.search))
        this.searchTop.select_type = 1
        this.searchBottom.select_type = 2
        delete this.searchBottom.group
        const data = await equipDownSummary('get', null, { params: this.searchTop })
        const data1 = await equipDownSummary('get', null, { params: this.searchBottom })
        this.tableData = data.results || []
        this.list1 = data1.results.details || []
        if (this.list1.length > 0) {
          this.list1.forEach((d, index) => {
            d.index = index + 1
          })
          this.list1.push({
            index: '合计/s',
            actual_trains: sum(this.list1, 'actual_trains'),
            s_mixer_time: sum(this.list1, 's_mixer_time'),
            s_interval_time: sum(this.list1, 's_interval_time'),
            all_times: sum(this.list1, 'all_times'),
            ratio: 100
          })
        }
        this.list2 = data1.results.summary || []
        this.tableDataBottom = this.list1.concat(this.list2)
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    }
  }
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

<style lang="scss" scoped>

</style>
