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
        <el-select
          v-model="search.product_type"
          style="width:250px"
          filterable
          placeholder="请选择"
          clearable
          @visible-change="visibleChange"
          @change="getList"
        >
          <el-option
            v-for="item in optionsProduct"
            :key="item.id"
            :label="item.product_no"
            :value="item.product_no"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产机台">
        <selectEquip
          :equip_no_props.sync="search.equip_no"
          @changeSearch="getList"
        />
      </el-form-item>
      <el-form-item label="班次">
        <class-select @classSelected="classChanged" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked" @change="getList">含试验料</el-checkbox>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          type="primary"
          @click="exportTable('胶料规格别合格率统计')"
        >导出表格</el-button>
      </el-form-item>
    </el-form>
    <div id="out-table">
      <div
        v-for="(item,key) in [tableData,tableData1]"
        :key="key"
      >
        <el-table
          v-if="key===1?tableData.length>0?true:false:true"
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
            width="70"
          />
          <el-table-column
            prop="JC"
            label="检查数"
            width="80"
            sortable
          />
          <el-table-column
            prop="HG"
            label="合格量"
            width="80"
            sortable
          />
          <el-table-column
            label="门尼不合格"
            width="110"
            align="center"
          >
            <el-table-column
              prop="mn_upper"
              label="+"
              width="55"
              sortable
            />
            <el-table-column
              prop="mn_lower"
              label="-"
              width="55"
              sortable
            />
          </el-table-column>
          <el-table-column
            label="硬度不合格"
            width="110"
            align="center"
          >
            <el-table-column
              prop="yd_upper"
              label="+"
              width="55"
              sortable
            />
            <el-table-column
              prop="yd_lower"
              label="-"
              width="55"
              sortable
            />
          </el-table-column>
          <el-table-column
            label="比重不合格"
            width="110"
            align="center"
          >
            <el-table-column
              prop="bz_upper"
              label="+"
              width="55"
              sortable
            />
            <el-table-column
              prop="bz_lower"
              label="-"
              width="55"
              sortable
            />
          </el-table-column>
          <el-table-column
            label="硫变不合格"
            align="center"
          >
            <el-table-column
              prop="MH"
              label="MH"
              min-width="20"
              align="center"
            >
              <el-table-column
                prop="MH_upper"
                label="+"
                min-width="20"
                sortable
              />
              <el-table-column
                prop="MH_lower"
                label="-"
                min-width="20"
                sortable
              />
            </el-table-column>
            <el-table-column
              prop="ML"
              label="ML"
              min-width="20"
              align="center"
            >
              <el-table-column
                prop="ML_upper"
                label="+"
                min-width="20"
                sortable
              />
              <el-table-column
                prop="ML_lower"
                label="-"
                min-width="20"
                sortable
              />
            </el-table-column>
            <el-table-column
              prop="TC10"
              label="TC10"
              min-width="20"
              align="center"
            >
              <el-table-column
                prop="TC10_upper"
                label="+"
                min-width="20"
                sortable
              />
              <el-table-column
                prop="TC10_lower"
                label="-"
                min-width="20"
                sortable
              />
            </el-table-column>
            <el-table-column
              prop="TC50"
              label="TC50"
              min-width="20"
              align="center"
            >
              <el-table-column
                prop="TC50_upper"
                label="+"
                min-width="20"
                sortable
              />
              <el-table-column
                prop="TC50_lower"
                label="-"
                min-width="20"
                sortable
              />
            </el-table-column>
            <el-table-column
              prop="TC90"
              label="TC90"
              min-width="20"
              align="center"
            >
              <el-table-column
                prop="TC90_upper"
                label="+"
                min-width="20"
                sortable
              />
              <el-table-column
                prop="TC90_lower"
                label="-"
                min-width="20"
                sortable
              />
            </el-table-column>
            <el-table-column
              prop="sum_s"
              label="硫变合计"
              min-width="15"
              sortable
            />
          </el-table-column>
          <el-table-column
            prop="RATE_1_PASS"
            label="一次合格率"
            min-width="35"
            sortable
          />
          <el-table-column
            prop="RATE_S_PASS"
            label="硫变合格率"
            sortable
            min-width="35"
          />
          <el-table-column
            prop="cp_all"
            label="次品合计"
            min-width="35"
            sortable
          />
          <el-table-column
            prop="rate"
            label="合格率"
            min-width="30"
            sortable
          />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import ClassSelect from '@/components/ClassSelect'
import { globalCodesUrl, productInfosUrl } from '@/api/base_w'
import { rubberPass } from '@/api/jqy'
import { debounce, setDate, exportExcel } from '@/utils/index'
import selectEquip from '@/components/select_w/equip'
export default {
  name: 'RubberCompound',
  components: { ClassSelect, selectEquip },
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
      dateValue: [setDate(), setDate()],
      checked: false,
      optionsProduct: []
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
        this.search.sy_flag = 'Y'
        if (!this.checked) {
          delete this.search.sy_flag
        }
        this.loading = true
        this.tableData = []
        const data = await rubberPass('get', null, { params: this.search })
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
            // D.RATE_1_PASS = Number(D.RATE_1_PASS)
            // D.RATE_S_PASS = Number(D.RATE_S_PASS)
            // D.rate = Number(D.rate)
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
          if (this.JC !== 0 && this.tableData.length !== 0) {
            this.tableData1 = [{
              product_type: '合计',
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
              rate: (this.HG / this.JC * 100).toFixed(2)
            }]
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
    },
    async visibleChange(val) {
      if (val) {
        try {
          const data = await productInfosUrl('get', null, { params: { all: 1 }})
          this.optionsProduct = data.results || []
        } catch (e) {
        //
        }
      }
    }
  }
}
</script>
