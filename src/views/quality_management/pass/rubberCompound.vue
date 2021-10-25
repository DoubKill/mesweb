<template>
  <div>
    <!-- 胶料别合格率 -->
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
          @click="exportTable('胶料规格别合格率统计')"
        >导出表格</el-button>
      </el-form-item>
    </el-form>
    <div v-for="(item,key) in [tableData,tableData1]" :key="key">
      <el-table
        v-if="key===1?tableData.length>0?true:false:true"
        id="out-table"
        v-loading="loading"
        :data="item"
        :row-class-name="tableRowClassName"
        border
        tooltip-effect="dark"
        style="width: 100%"
        :show-header="key===1?false:true"
      >
        <el-table-column
          prop="product_type"
          label="胶料"
          min-width="20"
        />
        <el-table-column
          prop="JC"
          label="检查数"
          min-width="15"
          sortable
        />
        <el-table-column
          prop="HG"
          label="合格量"
          min-width="15"
          sortable
        />
        <el-table-column
          prop="MN"
          label="门尼不合格"
          min-width="15"
          sortable
        />
        <el-table-column
          prop="YD"
          label="硬度不合格"
          min-width="15"
          sortable
        />
        <el-table-column
          prop="BZ"
          label="比重不合格"
          min-width="15"
          sortable
        />
        <el-table-column
          prop="RATE_1_PASS"
          label="一次合格率"
          min-width="25"
          sortable
        />
        <el-table-column label="硫变不合格" align="center">
          <el-table-column
            prop="MH"
            label="MH"
            min-width="20"
            sortable
          />
          <el-table-column
            prop="ML"
            label="ML"
            min-width="20"
            sortable
          />
          <el-table-column
            prop="TC10"
            label="TC10"
            min-width="20"
            sortable
          />
          <el-table-column
            prop="TC50"
            label="TC50"
            min-width="20"
            sortable
          />
          <el-table-column
            prop="TC90"
            label="TC90"
            min-width="20"
            sortable
          />
          <el-table-column
            prop="sum_s"
            label="硫变合计"
            min-width="20"
            sortable
          />
        </el-table-column>
        <el-table-column
          prop="RATE_S_PASS"
          label="硫变合格率"
          sortable
          min-width="25"
        />
        <el-table-column
          prop="cp_all"
          label="次品合计"
          min-width="25"
          sortable
        />
        <el-table-column
          prop="rate"
          label="合格率"
          min-width="25"
          sortable
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import ClassSelect from '@/components/ClassSelect'
import { globalCodesUrl } from '@/api/base_w'
import { rubberPass } from '@/api/jqy'
import { debounce, setDate, exportExcel } from '@/utils/index'
export default {
  name: 'RubberCompound',
  components: { ClassSelect },
  data() {
    return {
      tableData: [],
      tableData1: null,
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
        const data = await rubberPass('get', null, { params: this.search })
        this.tableData = data.result || []
        if (this.tableData.length > 0) {
          this.JC = 0
          this.HG = 0
          this.MN = 0
          this.YD = 0
          this.BZ = 0
          this.MH = 0
          this.ML = 0
          this.TC10 = 0
          this.TC50 = 0
          this.TC90 = 0
          this.sum_s = 0
          this.cp_all = 0
          this.tableData.forEach(D => {
            D.RATE_1_PASS = Number(D.RATE_1_PASS)
            D.RATE_S_PASS = Number(D.RATE_S_PASS)
            D.rate = Number(D.rate)
            this.JC += Number(D.JC)
            this.HG += Number(D.HG)
            this.MN += Number(D.MN)
            this.YD += Number(D.YD)
            this.BZ += Number(D.BZ)
            this.MH += Number(D.MH)
            this.ML += Number(D.ML)
            this.TC10 += Number(D.TC10)
            this.TC50 += Number(D.TC50)
            this.TC90 += Number(D.TC90)
            this.sum_s += Number(D.sum_s)
            this.cp_all += Number(D.cp_all)
          })
          if (this.JC !== 0 && this.tableData.length !== 0) {
            this.tableData1 = [{
              product_type: '合计',
              JC: this.JC,
              HG: this.HG,
              MN: this.MN,
              YD: this.YD,
              BZ: this.BZ,
              RATE_1_PASS: data.all.rate_1,
              MH: this.MH,
              ML: this.ML,
              TC10: this.TC10,
              TC50: this.TC50,
              TC90: this.TC90,
              sum_s: this.sum_s,
              RATE_S_PASS: data.all.rate_lb,
              cp_all: this.cp_all,
              rate: data.all.rate }]
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
      if (row.product_type === '合计') {
        return 'summary-cell-style'
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
