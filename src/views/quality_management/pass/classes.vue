<template>
  <div>
    <!-- 班次别合格率统计 -->
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
      <el-form-item label="胶料段">
        <el-select
          v-model="search.station"
          clearable
          placeholder="请选择"
          @visible-change="visibleStageList"
          @change="changeSearch1"
        >
          <el-option
            v-for="(item,k) in options"
            :key="k"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="胶料规格">
        <el-input v-model="search.product_type" size="" clearable placeholder="请输入胶料规格" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="生产机台">
        <el-input v-model="search.equip_no" clearable placeholder="请输入生产机台" @input="changeSearch" />
      </el-form-item>
      <el-form-item label="班次">
        <class-select @classSelected="classChanged" />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          type="primary"
          @click="exportTable('班次别合格率统计')"
        >导出表格</el-button>
      </el-form-item>
    </el-form>

    <el-table
      id="out-table"
      v-loading="loading"
      :span-method="objectSpanMethod"
      :data="tableData"
      :row-class-name="tableRowClassName"
      border
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="时间"
        width="100"
      />
      <el-table-column
        prop="class"
        label="班次"
        width="60"
      />
      <el-table-column
        prop="JC"
        label="检查数"
        width="70"
      />
      <el-table-column
        prop="HG"
        label="合格量"
        width="70"
      />
      <el-table-column
        label="门尼不合格"
        width="100"
        align="center"
      >
        <el-table-column
          prop="mn_upper"
          label="+"
          width="50"
        />
        <el-table-column
          prop="mn_lower"
          label="-"
          width="50"
        />
      </el-table-column>
      <el-table-column
        label="硬度不合格"
        width="100"
        align="center"
      >
        <el-table-column
          prop="yd_upper"
          label="+"
          width="50"
        />
        <el-table-column
          prop="yd_lower"
          label="-"
          width="50"
        />
      </el-table-column>
      <el-table-column
        label="比重不合格"
        width="100"
        align="center"
      >
        <el-table-column
          prop="bz_upper"
          label="+"
          width="50"
        />
        <el-table-column
          prop="bz_lower"
          label="-"
          width="50"
        />
      </el-table-column>
      <el-table-column label="硫变不合格" align="center">
        <el-table-column
          prop="MH"
          label="MH"
          align="center"
        >
          <el-table-column
            prop="MH_upper"
            label="+"
            min-width="25"
          />
          <el-table-column
            prop="MH_lower"
            label="-"
            min-width="25"
          />
        </el-table-column>
        <el-table-column
          prop="ML"
          label="ML"
          align="center"
        >
          <el-table-column
            prop="ML_upper"
            label="+"
            min-width="25"
          />
          <el-table-column
            prop="ML_lower"
            label="-"
            min-width="25"
          />
        </el-table-column>
        <el-table-column
          prop="TC10"
          label="TC10"
          align="center"
        >
          <el-table-column
            prop="TC10_upper"
            label="+"
            min-width="25"
          />
          <el-table-column
            prop="TC10_lower"
            label="-"
            min-width="25"
          />
        </el-table-column>
        <el-table-column
          prop="TC50"
          label="TC50"
          align="center"
        >
          <el-table-column
            prop="TC50_upper"
            label="+"
            min-width="25"
          />
          <el-table-column
            prop="TC50_lower"
            label="-"
            min-width="25"
          />
        </el-table-column>
        <el-table-column
          prop="TC90"
          label="TC90"
          align="center"
        >
          <el-table-column
            prop="TC90_upper"
            label="+"
            min-width="25"
          />
          <el-table-column
            prop="TC90_lower"
            label="-"
            min-width="25"
          />
        </el-table-column>
        <el-table-column
          prop="sum_s"
          label="硫变合计"
          min-width="20"
        />
      </el-table-column>
      <el-table-column
        prop="RATE_1_PASS"
        label="一次合格率"
        width="100"
      />
      <el-table-column
        prop="RATE_S_PASS"
        label="硫变合格率"
        width="100"
      />
      <el-table-column
        prop="cp_all"
        label="次品合计"
        width="100"
      />
      <el-table-column
        prop="rate"
        label="合格率"
        width="80"
      />
    </el-table>
  </div>
</template>

<script>
import ClassSelect from '@/components/ClassSelect'
import { globalCodesUrl } from '@/api/base_w'
import { classesPass } from '@/api/jqy'
import { debounce, setDate, exportExcel } from '@/utils/index'
export default {
  name: 'Classes',
  components: { ClassSelect },
  data() {
    return {
      tableData: [],
      formHeadData: [],
      search: {
      },
      loading: false,
      options: [],
      handleCardDialogVisible: false,
      dateValue: [setDate(), setDate()]
    }
  },
  created() {
    this.search.s_time = setDate()
    this.search.e_time = setDate()
    this.getList()
  },
  methods: {
    submitFun() {
      this.handleCardDialogVisible = false
      this.getList()
    },
    async getList() {
      try {
        this.loading = true
        this.tableData = []
        const data = await classesPass('get', null, { params: this.search })
        this.tableData = data.result || []
        if (this.tableData.length > 0) {
          this.JC = 0
          this.HG = 0
          this.mn_upper = 0
          this.yd_upper = 0
          this.bz_upper = 0
          this.MH_upper = 0
          this.ML_upper = 0
          this.TC10_upper = 0
          this.TC50_upper = 0
          this.TC90_upper = 0
          this.mn_lower = 0
          this.yd_lower = 0
          this.bz_lower = 0
          this.MH_lower = 0
          this.ML_lower = 0
          this.TC10_lower = 0
          this.TC50_lower = 0
          this.TC90_lower = 0
          this.sum_s = 0
          this.cp_all = 0
          this.tableData.forEach(D => {
            this.JC += Number(D.JC)
            this.HG += Number(D.HG)
            this.mn_upper += Number(D.mn_upper)
            this.yd_upper += Number(D.yd_upper)
            this.bz_upper += Number(D.bz_upper)
            this.MH_upper += Number(D.MH_upper)
            this.ML_upper += Number(D.ML_upper)
            this.TC10_upper += Number(D.TC10_upper)
            this.TC50_upper += Number(D.TC50_upper)
            this.TC90_upper += Number(D.TC90_upper)
            this.mn_lower += Number(D.mn_lower)
            this.yd_lower += Number(D.yd_lower)
            this.bz_lower += Number(D.bz_lower)
            this.MH_lower += Number(D.MH_lower)
            this.ML_lower += Number(D.ML_lower)
            this.TC10_lower += Number(D.TC10_lower)
            this.TC50_lower += Number(D.TC50_lower)
            this.TC90_lower += Number(D.TC90_lower)
            this.sum_s += Number(D.sum_s)
            this.cp_all += Number(D.cp_all)
          })
          if (this.JC !== 0) {
            this.tableData.push({
              class: '合计',
              JC: this.JC,
              HG: this.HG,
              mn_upper: this.mn_upper,
              yd_upper: this.yd_upper,
              bz_upper: this.bz_upper,
              RATE_1_PASS: data.all.rate_1,
              MH_upper: this.MH_upper,
              ML_upper: this.ML_upper,
              TC10_upper: this.TC10_upper,
              TC50_upper: this.TC50_upper,
              TC90_upper: this.TC90_upper,
              mn_lower: this.mn_lower,
              yd_lower: this.yd_lower,
              bz_lower: this.bz_lower,
              MH_lower: this.MH_lower,
              ML_lower: this.ML_lower,
              TC10_lower: this.TC10_lower,
              TC50_lower: this.TC50_lower,
              TC90_lower: this.TC90_lower,
              sum_s: this.sum_s,
              RATE_S_PASS: data.all.rate_lb,
              cp_all: this.cp_all,
              rate: (this.HG / this.JC * 100).toFixed(2) })
          }
          this.spanArr = []
          this.pos = null
          for (var i = 0; i < this.tableData.length; i++) {
            if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
              this.spanArr.push(1)
              this.pos = 0
            } else {
              if (this.tableData[i].date === this.tableData[i - 1].date) {
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
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    visibleStageList(bool) {
      if (bool) {
        globalCodesUrl('get', {
          params: {
            class_name: '胶料段次'
          }
        }).then((response) => {
          this.options = response.results
        }).catch(function() {
        })
      }
    },
    searchDate(arr) {
      if (arr === null) {
        this.$message.info('请选择时间')
        return
      } else {
        this.search.s_time = arr ? arr[0] : ''
        this.search.e_time = arr ? arr[1] : ''
        this.getList()
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.class === '合计') {
        return 'summary-cell-style'
      }
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
    classChanged(val) {
      this.search.classes = val
      this.getList()
    },
    productBatchingChanged(val) {
      this.search.product_type = val.material_name
      this.getList()
    },
    changeSearch() {
      debounce(this, 'getList')
    },
    changeSearch1() {
      this.getList()
    },
    exportTable(val) {
      exportExcel(val)
    }
  }
}
</script>
