<template>
  <div v-loading="loading">
    <!-- 综合合格率月度汇总 -->
    <el-form :inline="true">
      <el-form-item label="月份">
        <el-date-picker
          v-model="search.s_time"
          type="month"
          value-format="yyyy-MM"
          format="yyyy-MM"
          placeholder="选择月"
          :clearable="false"
          @change="changeList"
        />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked" @change="getList">含试验料</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="btnExportLoad"
          @click="exportTable"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <div id="out-table">
      <el-table
        :data="tableData[0]?tableData[0].data:[]"
        border
      >
        <el-table-column
          type="index"
          label="No"
          width="40px"
        />
        <el-table-column
          prop="name"
          align="center"
          label="合格率类型"
          width="100"
        />
        <el-table-column
          v-for="(d) in tableHead"
          :key="d"
          align="center"
          :label="_month+'/'+d"
          width="60"
        >
          <template slot-scope="{row}">
            {{ row[d] }}{{ row[d]!==''?'%':'' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="rate"
          align="center"
          label="月度合格率"
          width="100"
        >
          <template slot-scope="{row}">
            {{ row.rate }}{{ row.rate!==''?'%':'' }}
          </template>
        </el-table-column>
      </el-table>

      <el-table
        :data="tableData[1]?tableData[1].data:[]"
        border
        style="margin-top:20px"
      >
        <el-table-column
          type="index"
          label="No"
          width="40px"
        />
        <el-table-column
          prop="name"
          align="center"
          label="机台综合合格率%"
          width="100"
        />
        <el-table-column
          v-for="(d) in tableHead"
          :key="d"
          align="center"
          :label="_month+'/'+d"
          width="60"
        >
          <template slot-scope="{row}">
            {{ row[d] }}{{ row[d]!==''?'%':'' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="rate"
          align="center"
          label="月度合格率"
          width="100"
        >
          <template slot-scope="{row}">
            {{ row.rate }}{{ row.rate!==''?'%':'' }}
          </template>
        </el-table-column>
      </el-table>

      <el-table
        :data="tableData[2]?tableData[2].data:[]"
        border
        style="margin-top:20px"
      >
        <el-table-column
          type="index"
          label="No"
          width="40px"
        />
        <el-table-column
          prop="name"
          align="center"
          label="班组综合合格率%"
          width="100"
        />
        <el-table-column
          v-for="(d) in tableHead"
          :key="d"
          align="center"
          :label="_month+'/'+d"
          width="60"
        >
          <template slot-scope="{row}">
            {{ row[d] }}{{ row[d]!==''?'%':'' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="rate"
          align="center"
          label="月度合格率"
          width="100"
        >
          <template slot-scope="{row}">
            {{ row.rate }}{{ row.rate!==''?'%':'' }}
          </template>
        </el-table-column>
      </el-table>

      <el-table
        :data="tableData[3]?tableData[3].data:[]"
        border
        style="margin-top:20px"
        :span-method="objectSpanMethod"
      >
        <el-table-column
          prop="name"
          label="物料类别"
          align="center"
          width="100px"
        />
        <el-table-column
          prop="type"
          align="center"
          label="类型"
          width="100"
        />
        <el-table-column
          v-for="(d) in tableHead"
          :key="d"
          align="center"
          :label="_month+'/'+d"
          width="60"
        >
          <template slot-scope="{row}">
            {{ row[d] }}{{ row[d]!==''?'%':'' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="rate"
          align="center"
          label="月度合格率"
          width="100"
        >
          <template slot-scope="{row}">
            {{ row.rate }}{{ row.rate!==''?'%':'' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { setDate, exportExcel } from '@/utils'
import { productSynthesisRate, productSynthesisEquipRate, productSynthesisGroupRate, productSynthesisProductRate } from '@/api/base_w_five'
export default {
  name: 'MonthlyUmmary',
  data() {
    return {
      search: { s_time: setDate(false, false, 'month') },
      loading: false,
      btnExportLoad: false,
      tableHead: [],
      tableData: [],
      spanArr: [],
      pos: null,
      checked: false
    }
  },
  created() {
    const _year = setDate(this.search.s_time, null, 'year')
    const _month = setDate(this.search.s_time, null, 'onlyMonth')
    this._month = _month
    this.tableHead = new Date(_year, _month, 0).getDate()
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        this.spanArr = []
        this.pos = null
        const obj = {
          date: this.search.s_time,
          sy_flag: 'Y'
        }
        if (!this.checked) {
          delete obj.sy_flag
        }
        const arr = await Promise.all([
          productSynthesisRate('get', null, { params: obj }),
          productSynthesisEquipRate('get', null, { params: obj }),
          productSynthesisGroupRate('get', null, { params: obj }),
          productSynthesisProductRate('get', null, { params: obj })
        ])
        const _3 = arr[3].data || []
        for (var i = 0; i < _3.length; i++) {
          if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
            this.spanArr.push(1)
            this.pos = 0
          } else {
            if (_3[i].name === _3[i - 1].name) {
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
        this.tableData = arr
      } catch (e) {
        this.loading = false
      }
    },
    changeList() {
      const _year = setDate(this.search.s_time, null, 'year')
      const _month = setDate(this.search.s_time, null, 'onlyMonth')
      this._month = _month
      this.tableHead = new Date(_year, _month, 0).getDate()
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
      exportExcel('综合合格率月度汇总', '综合合格率汇总')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
