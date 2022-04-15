<template>
  <div class="scheduledInventory">
    <!-- 原材料需求量 汇总表 -->
    <el-form :inline="true">
      <el-form-item label="当前显示">
        <span>{{ st }}-{{ et }} </span>
      </el-form-item>
      <el-form-item label="原材料类别">
        <el-select v-model="search.material_type" clearable allow-create filterable @change="getList(search.interval_type)">
          <el-option
            v-for="item in optionsProduct"
            :key="item.id"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="原材料名称">
        <el-input v-model="search.material_name" @input="changeList" />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          style="width:150px"
          equip-type="密炼设备"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item>
        <el-button :type="search.interval_type===1?'warning':'primary'" @click="getList(1)">0-4小时需求量</el-button>
        <el-button :type="search.interval_type===2?'warning':'primary'" @click="getList(2)">4-8小时需求量</el-button>
        <el-button :type="search.interval_type===3?'warning':'primary'" @click="getList(3)">8-12小时需求量</el-button>
        <el-button type="primary" @click="getList(search.interval_type)">刷新</el-button>
        <el-button type="primary" @click="exportTable">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :id="loading?'out-table':''"
      v-loading="loading"
      max-height="700"
      :span-method="objectSpanMethod"
      :data="tableData"
      border
    >
      <el-table-column
        align="center"
        prop="material_type"
        label="原材料类别"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="material_name"
        label="原材料名称"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="total_weight"
        label="机台合计(kg)"
        min-width="50"
      >
        <template slot-scope="scope">
          <el-link
            v-if="scope.row.material_name!=='合计'"
            type="primary"
            @click="DetailList(scope.row)"
          >{{ scope.row.total_weight }}</el-link>
          <span v-else>{{ scope.row.total_weight }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="Z01"
        label="Z01(kg)"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="Z02"
        label="Z02(kg)"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="Z03"
        label="Z03(kg)"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="Z04"
        label="Z04(kg)"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="Z05"
        label="Z05(kg)"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="Z06"
        label="Z06(kg)"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="Z07"
        label="Z07(kg)"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="Z08"
        label="Z08(kg)"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="Z09"
        label="Z09(kg)"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="Z10"
        label="Z10(kg)"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="Z11"
        label="Z11(kg)"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="Z12"
        label="Z12(kg)"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="Z13"
        label="Z13(kg)"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="Z14"
        label="Z14(kg)"
        min-width="40"
      />
      <el-table-column
        align="center"
        prop="Z15"
        label="Z15(kg)"
        min-width="40"
      />
    </el-table>

    <el-dialog
      title="原材料需求量 明细表"
      :visible.sync="dialogVisible"
      width="90%"
    >
      <el-form :inline="true">
        <el-form-item label="原材料类别">
          <el-input v-model="currentInfo.material_type" disabled />
        </el-form-item>
        <!-- <el-form-item label="原材料名称">
          <el-input v-model="currentInfo.material_name" @change="DetailList(currentInfo)" />
        </el-form-item>
        <el-form-item label="机台">
          <equip-select
            style="width:150px"
            :default-val="currentInfo.equip"
            equip-type="密炼设备"
            @equipSelected="equipSelected1"
          />
        </el-form-item> -->
        <el-button type="primary" @click="exportTable1">导出Excel</el-button>
      </el-form>
      <el-table
        :id="loadingView?'out-table':''"
        v-loading="loadingView"
        :data="tableDataView"
        border
      >
        <el-table-column
          prop="equip_no"
          label="机台"
          min-width="20"
        />
        <el-table-column
          prop="recipe_name"
          label="计划(配方)"
          min-width="20"
        />
        <el-table-column
          prop="material_type"
          label="原材料类别"
          min-width="20"
        />
        <el-table-column
          prop="material_name"
          label="原材料名称"
          min-width="20"
        />
        <el-table-column
          prop="weight"
          label="消耗量(kg)"
          min-width="20"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogVisible=false"
        >返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EquipSelect from '@/components/EquipSelect'
import { classesListUrl } from '@/api/base_w'
import { schedulingMaterialDemanded } from '@/api/jqy'
import { exportExcel } from '@/utils'
export default {
  name: 'MaterialDemand',
  components: { EquipSelect },
  data() {
    return {
      st: null,
      et: null,
      loadingView: false,
      tableDataView: [],
      dialogVisible: false,
      loading: false,
      btnLoading: false,
      currentInfo: {},
      tableData: [],
      optionsProduct: [],
      search: {}
    }
  },
  created() {
    this.getList(1)
    this.getProduct()
  },
  methods: {
    async getProduct() {
      try {
        const data = await classesListUrl('get', null, { params: { class_name: '原材料类别', all: 1 }})
        this.optionsProduct = data.results || []
      } catch (e) {
        //
      }
    },
    async DetailList(row) {
      try {
        if (row.material_name === '小计') {
          this.currentInfo.material_type = row.material_type
          this.currentInfo.material_name = ''
        } else {
          this.currentInfo.material_type = row.material_type
          this.currentInfo.material_name = row.material_name
        }
        this.dialogVisible = true
        this.loadingView = true
        // const data = await thStorage('get', null, { params: this.searchView })
        this.tableDataView = row.detail
        this.loadingView = false
      } catch (e) {
        this.loadingView = false
      }
    },
    async getList(val) {
      try {
        if (val) {
          this.search.interval_type = val
        }
        this.loading = true
        const data = await schedulingMaterialDemanded('get', null, { params: this.search })
        this.st = data.st
        this.et = data.et
        this.tableData = data.data || []
        this.tableData = this.tableData.concat(getNewGoodsList(this.tableData))
        this.tableData.sort(compare('material_type'))
        if (this.tableData.length > 0) {
          this.tableData.push({
            material_name: '合计',
            total_weight: sum(this.tableData, 'total_weight'),
            Z01: sum(this.tableData, 'Z01') === 0 ? null : sum(this.tableData, 'Z01'),
            Z02: sum(this.tableData, 'Z02') === 0 ? null : sum(this.tableData, 'Z02'),
            Z03: sum(this.tableData, 'Z03') === 0 ? null : sum(this.tableData, 'Z03'),
            Z04: sum(this.tableData, 'Z04') === 0 ? null : sum(this.tableData, 'Z04'),
            Z05: sum(this.tableData, 'Z05') === 0 ? null : sum(this.tableData, 'Z05'),
            Z06: sum(this.tableData, 'Z06') === 0 ? null : sum(this.tableData, 'Z06'),
            Z07: sum(this.tableData, 'Z07') === 0 ? null : sum(this.tableData, 'Z07'),
            Z08: sum(this.tableData, 'Z08') === 0 ? null : sum(this.tableData, 'Z08'),
            Z09: sum(this.tableData, 'Z09') === 0 ? null : sum(this.tableData, 'Z09'),
            Z10: sum(this.tableData, 'Z10') === 0 ? null : sum(this.tableData, 'Z10'),
            Z11: sum(this.tableData, 'Z11') === 0 ? null : sum(this.tableData, 'Z11'),
            Z12: sum(this.tableData, 'Z12') === 0 ? null : sum(this.tableData, 'Z12'),
            Z13: sum(this.tableData, 'Z13') === 0 ? null : sum(this.tableData, 'Z13'),
            Z14: sum(this.tableData, 'Z14') === 0 ? null : sum(this.tableData, 'Z14'),
            Z15: sum(this.tableData, 'Z15') === 0 ? null : sum(this.tableData, 'Z15')
          })
        }
        this.spanArr = []
        this.pos = null
        for (var i = 0; i < this.tableData.length; i++) {
          if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
            this.spanArr.push(1)
            this.pos = 0
          } else {
            if (this.tableData[i].material_type === this.tableData[i - 1].material_type) {
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
        console.log(this.tableData)
        this.loading = false
      } catch (e) {
        this.loading = false
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
    changeList() {
      this.$debounce(this, 'getList')
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.getList(this.search.interval_type)
    },
    equipSelected1(obj) {
      this.$set(this.currentInfo, 'equip_no', obj ? obj.equip_no : '')
      this.DetailList(this.currentInfo)
    },
    async exportTable() {
      await this.$set(this, 'loading', true)
      await exportExcel('原材料需求量 汇总表')
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    async exportTable1() {
      await this.$set(this, 'loadingView', true)
      await exportExcel('原材料需求量 明细表')
      setTimeout(() => {
        this.loadingView = false
      }, 1000)
    }
  }
}
var compare = function(prop) {
  return function(obj1, obj2) {
    var val1 = obj1[prop]
    var val2 = obj2[prop]
    if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  }
}
function getNewGoodsList(params) {
  var temp = {}
  for (var i in params) {
    var key = params[i].material_type // 判断依据.
    if (temp[key]) {
      temp[key].material_type = params[i].material_type
      temp[key].material_name = '小计'
      temp[key].total_weight += params[i].total_weight
      temp[key].detail = temp[key].detail.concat(params[i].detail)
      temp[key].Z01 += params[i].Z01 ?? 0// 相加值
      temp[key].Z02 += params[i].Z02 ?? 0
      temp[key].Z03 += params[i].Z03 ?? 0
      temp[key].Z04 += params[i].Z04 ?? 0
      temp[key].Z05 += params[i].Z05 ?? 0
      temp[key].Z06 += params[i].Z06 ?? 0
      temp[key].Z07 += params[i].Z07 ?? 0
      temp[key].Z08 += params[i].Z08 ?? 0
      temp[key].Z09 += params[i].Z09 ?? 0
      temp[key].Z10 += params[i].Z10 ?? 0
      temp[key].Z11 += params[i].Z11 ?? 0
      temp[key].Z12 += params[i].Z12 ?? 0
      temp[key].Z13 += params[i].Z13 ?? 0
      temp[key].Z14 += params[i].Z14 ?? 0
      temp[key].Z15 += params[i].Z15 ?? 0
    } else {
      temp[key] = {}
      temp[key].material_type = params[i].material_type
      temp[key].material_name = '小计'
      temp[key].detail = params[i].detail
      temp[key].total_weight = params[i].total_weight
      temp[key].Z01 = params[i].Z01 ?? 0
      temp[key].Z02 = params[i].Z02 ?? 0
      temp[key].Z03 = params[i].Z03 ?? 0
      temp[key].Z04 = params[i].Z04 ?? 0
      temp[key].Z05 = params[i].Z05 ?? 0
      temp[key].Z06 = params[i].Z06 ?? 0
      temp[key].Z07 = params[i].Z07 ?? 0
      temp[key].Z08 = params[i].Z08 ?? 0
      temp[key].Z09 = params[i].Z09 ?? 0
      temp[key].Z10 = params[i].Z10 ?? 0
      temp[key].Z11 = params[i].Z11 ?? 0
      temp[key].Z12 = params[i].Z12 ?? 0
      temp[key].Z13 = params[i].Z13 ?? 0
      temp[key].Z14 = params[i].Z14 ?? 0
      temp[key].Z15 = params[i].Z15 ?? 0
    }
  }
  var newArry = []
  for (var k in temp) {
    newArry.push(temp[k])
  }
  newArry.forEach(d => {
    d.total_weight = d.total_weight === 0 ? null : d.total_weight
    d.Z01 = d.Z01 === 0 ? null : d.Z01
    d.Z02 = d.Z02 === 0 ? null : d.Z02
    d.Z03 = d.Z03 === 0 ? null : d.Z03
    d.Z04 = d.Z04 === 0 ? null : d.Z04
    d.Z05 = d.Z05 === 0 ? null : d.Z05
    d.Z06 = d.Z06 === 0 ? null : d.Z06
    d.Z07 = d.Z07 === 0 ? null : d.Z07
    d.Z08 = d.Z08 === 0 ? null : d.Z08
    d.Z09 = d.Z09 === 0 ? null : d.Z09
    d.Z10 = d.Z10 === 0 ? null : d.Z10
    d.Z11 = d.Z11 === 0 ? null : d.Z11
    d.Z12 = d.Z12 === 0 ? null : d.Z12
    d.Z13 = d.Z13 === 0 ? null : d.Z13
    d.Z14 = d.Z14 === 0 ? null : d.Z14
    d.Z15 = d.Z15 === 0 ? null : d.Z15
  })
  return newArry
}
function sum(arr, params) {
  var s = 0
  arr.forEach(function(val, idx, arr) {
    if (val['material_name'] !== '小计') {
      const a = val[params] ? Number(val[params]) : 0
      s += a
    }
  }, 0)
  s = Math.round(s * 1000) / 1000
  return s
}
</script>

<style lang="scss">
.scheduledInventory{
  .el-input-number{
    width:130px;
   }
 .dialog{
  .el-input-number{
    width:200px;
    }
  }
}
</style>
