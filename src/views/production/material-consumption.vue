<template>
  <div class="materialConsumption">
    <!-- 原材料消耗量 汇总表 -->
    <el-form :inline="true">
      <el-form-item label="起止日期">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          :clearable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeDate"
        />
      </el-form-item>
      <el-form-item label="原材料类别">
        <el-select v-model="search.material_type" clearable allow-create filterable @change="getList()">
          <el-option
            v-for="item in optionsProduct"
            :key="item.id"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="原材料名称">
        <el-input v-model="search.material_name" clearable @input="changeList" />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          style="width:150px"
          equip-type="密炼设备"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="配方号">
        <el-input
          v-model="search.product_no"
          clearable
          placeholder="配方号"
          @input="changeList"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList()">刷新</el-button>
        <el-button type="primary" @click="exportTable">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :id="loading?'out-table':''"
      v-loading="loading"
      max-height="650"
      :span-method="objectSpanMethod"
      :data="tableData"
      border
    >
      <el-table-column
        align="center"
        prop="material_type"
        label="原材料类别"
        width="90"
        fixed
      />
      <el-table-column
        align="center"
        prop="material_name"
        label="原材料名称"
        width="140"
        fixed
      >
        <template slot-scope="scope">
          <i v-if="scope.row.material_name!=='合计'&&scope.row.material_name!=='小计'&&(type===2||scope.row.material_name!==material_name)" class="el-icon-arrow-down" style="vertical-align: middle" @click="clear(scope, 1)" />
          <i v-if="scope.row.material_name!=='合计'&&scope.row.material_name!=='小计'&&type===1&&scope.row.material_name===material_name" class="el-icon-arrow-up" style="vertical-align: middle" @click="clear(scope, 2)" />
          <span> {{ scope.row.material_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="total"
        label="合计"
        width="120"
        fixed
      />
      <el-table-column
        align="center"
        prop="equip_no"
        label="机台"
        width="80"
        fixed
      />
      <el-table-column
        align="center"
        prop="product_no"
        label="配方号"
        width="140"
        fixed
      />
      <el-table-column
        align="center"
        prop="total_weight"
        label="机台合计(kg)"
        width="100"
        fixed
      >
        <template slot-scope="{row}">
          <span v-if="row.material_name==='小计'||row.material_name==='合计'"> {{ null }}</span>
          <!-- <span v-if="row.material_name==='合计'"> {{ row.total_weight?row.total_weight.toFixed(2):row.total_weight }}</span> -->
          <span v-else> {{ row.total_weight }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item,i) in days"
        :key="i"
        :prop="item"
        align="center"
        :label="item"
        min-width="100"
      >
        <template slot-scope="{row}">
          <span v-if="row.material_name==='小计'||row.material_name==='合计'"> {{ null }}</span>
          <span v-else> {{ row[item] }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import EquipSelect from '@/components/EquipSelect'
import { classesListUrl } from '@/api/base_w'
import { materialExpendSummary } from '@/api/jqy'
import { exportExcel, setDate } from '@/utils'
export default {
  name: 'MaterialConsumption',
  components: { EquipSelect },
  data() {
    return {
      loadingView: false,
      loading: false,
      type: 2,
      days: [],
      index: null,
      material_name: null,
      btnLoading: false,
      tableData: [],
      optionsProduct: [],
      dateValue: [setDate(), setDate()],
      search: {}
    }
  },
  created() {
    this.search.s_time = this.dateValue[0]
    this.search.e_time = this.dateValue[1]
    this.getList()
    this.getProduct()
  },
  methods: {
    changeDate(arr) {
      this.search.s_time = arr ? arr[0] : ''
      this.search.e_time = arr ? arr[1] : ''
      if (getDaysBetween(this.search.s_time, this.search.e_time) > 14) {
        this.$message('查询日期总数不得超过15天')
        return
      }
      this.getList()
    },
    async getProduct() {
      try {
        const data = await classesListUrl('get', null, { params: { class_name: '原材料类别', all: 1 }})
        this.optionsProduct = data.results || []
      } catch (e) {
        //
      }
    },
    async getList() {
      try {
        this.type = 2
        this.loading = true
        const data = await materialExpendSummary('get', null, { params: this.search })
        this.tableData = data.data || []
        this.days = data.days || []
        this.tableData = this.tableData.concat(getNewGoodsList(this.tableData, this.days))
        this.tableData.forEach(d => {
          if (d.material_name !== '小计') {
            d.total = data.material_weight_dict[d.material_name]
          } else {
            d.total = d.total_weight.toFixed(2)
          }
        })
        this.tableData.sort(compare('material_type'))
        if (this.tableData.length > 0) {
          this.tableData.push({
            material_name: '合计',
            total: sum(this.tableData, 'total_weight'),
            total_weight: sum(this.tableData, 'total_weight')
          })
          this.arr = []
          this.days.forEach(d => {
            this.arr.push({
              [d]: sum(this.tableData, [d]) === 0 ? null : sum(this.tableData, [d])
            })
          })
          this.arr.forEach(d => {
            this.tableData[this.tableData.length - 1][Object.keys(d)[0]] = Object.values(d)[0]
          })
        }
        this.spanArr = []
        this.pos = null
        this.spanArr1 = []
        this.pos1 = null
        this.spanArr2 = []
        this.pos2 = null
        for (var i = 0; i < this.tableData.length; i++) {
          if (i === 0) {
            // 如果是第一条记录（即索引是0的时候），向数组中加入１
            this.spanArr.push(1)
            this.pos = 0
            this.spanArr1.push(1)
            this.pos1 = 0
            this.spanArr2.push(1)
            this.pos2 = 0
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
            if (this.tableData[i].material_type === this.tableData[i - 1].material_type && this.tableData[i].material_name === this.tableData[i - 1].material_name) {
              // 如果a相等就累加，并且push 0  这里是根据一样的a匹配
              this.spanArr1[this.pos1] += 1
              this.spanArr1.push(0)
            } else {
              // 不相等push 1
              this.spanArr1.push(1)
              this.pos1 = i
            }
            if (this.tableData[i].material_type === this.tableData[i - 1].material_type &&
             this.tableData[i].material_name === this.tableData[i - 1].material_name &&
              this.tableData[i].equip_no === this.tableData[i - 1].equip_no) {
              // 如果a相等就累加，并且push 0  这里是根据一样的a匹配
              this.spanArr2[this.pos2] += 1
              this.spanArr2.push(0)
            } else {
              // 不相等push 1
              this.spanArr2.push(1)
              this.pos2 = i
            }
          }
        }
        this.days.forEach(i => {
          this.tableData.forEach(d => {
            if (d.material_name === '小计' || d.material_name === '合计') {
              d[i] = d[i] ? d[i].toFixed(2) : null
            }
          })
        })
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
      if ([1].includes(columnIndex) && this.spanArr1) {
        const _row = this.spanArr1[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if ([2].includes(columnIndex) && this.spanArr1) {
        const _row = this.spanArr1[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (((this.type === 2) ||
      (this.type === 1 && rowIndex !== this.index && row.material_name !== this.material_name))) {
        const _row = this.spanArr1[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (this.type === 1 && rowIndex === this.index && row.material_name === this.material_name) {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
      if (this.type === 3) {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    },
    changeList() {
      this.$debounce(this, 'getList')
    },
    clear(scope, val) {
      this.$set(this, 'index', scope.$index)
      this.$set(this, 'type', val)
      this.$set(this, 'material_name', scope.row.material_name)
    },
    equipSelected(obj) {
      this.$set(this.search, 'equip_no', obj ? obj.equip_no : '')
      this.getList()
    },
    async exportTable() {
      await this.$set(this, 'loading', true)
      await this.$set(this, 'type', 3)
      await exportExcel('原材料消耗量 汇总表')
      setTimeout(() => {
        this.loading = false
        this.type = 2
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
function getNewGoodsList(params, days) {
  var temp = {}
  for (var i in params) {
    var key = params[i].material_type // 判断依据.
    if (temp[key]) {
      temp[key].material_type = params[i].material_type
      temp[key].material_name = '小计'
      temp[key].total_weight += params[i].total_weight
      // temp[key].total_weight = temp[key].total_weight.toFixed(2)
      days.forEach(d => {
        // addMath(temp[key].[d], params[i].[d])
        temp[key][d] += params[i][d] ?? 0
        // temp[key].[d] = temp[key].[d].toFixed(2)
      })
    } else {
      temp[key] = {}
      temp[key].material_type = params[i].material_type
      temp[key].material_name = '小计'
      temp[key].total_weight = params[i].total_weight
      // temp[key].total_weight = temp[key].total_weight.toFixed(2)
      days.forEach(d => {
        temp[key][d] = params[i][d] ?? 0
      })
    }
  }
  var newArry = []
  for (var k in temp) {
    newArry.push(temp[k])
  }
  newArry.forEach(d => {
    d.total_weight = d.total_weight === 0 ? null : d.total_weight
    days.forEach(i => {
      d[i] = d[i] === 0 ? null : d[i]
    })
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
// function getNextDate(date, day) {
//   var dd = new Date(date)
//   dd.setDate(dd.getDate() + day)
//   var y = dd.getFullYear()
//   var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1
//   var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
//   return y + '-' + m + '-' + d
// }
function getDaysBetween(dateString1, dateString2) {
  var startDate = Date.parse(dateString1)
  var endDate = Date.parse(dateString2)
  if (startDate > endDate) {
    return 0
  }
  if (startDate === endDate) {
    return 1
  }
  var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
  return days
}
</script>

<style lang="scss">
.materialConsumption{
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
