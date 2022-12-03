<template>
  <div class="materialPlan">
    <!-- 细料分解每日计划用量 -->
    <el-form :inline="true">
      <el-form-item label="原材料类别">
        <el-select v-model="search.material_type" clearable filterable @change="getList()">
          <el-option
            v-for="item in optionsProduct"
            :key="item.id"
            :label="item.global_name"
            :value="item.global_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="原材料名称">
        <el-select v-model="search.material_name" clearable filterable @change="getList()">
          <el-option
            v-for="item in MaterialOptions"
            :key="item.id"
            :label="item.material_name"
            :value="item.material_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="机台">
        <equip-select
          style="width:150px"
          equip-type="密炼设备"
          @equipSelected="equipSelected"
        />
      </el-form-item>
      <el-form-item label="配方号">
        <el-select v-model="search.product_no" clearable filterable @change="getList()">
          <el-option
            v-for="item in options"
            :key="item.product_no"
            :label="item.product_no"
            :value="item.product_no"
          >
            <span :style="{color: item.used?'blue':''}">{{ item.product_no }}</span>
          </el-option>
        </el-select>
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
      />
      <el-table-column
        align="center"
        prop="material_name"
        label="原材料名称"
      >
        <template slot-scope="scope">
          <i v-if="scope.row.material_name!=='合计'&&scope.row.material_name!=='小计'&&(type===2||scope.row.material_name!==material_name)" class="el-icon-arrow-right" style="vertical-align: middle" @click="clear(scope, 1)" />
          <i v-if="scope.row.material_name!=='合计'&&scope.row.material_name!=='小计'&&type===1&&scope.row.material_name===material_name" class="el-icon-arrow-down" style="vertical-align: middle" @click="clear(scope, 2)" />
          <span> {{ scope.row.material_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="total"
        label="合计"
      />
      <el-table-column
        align="center"
        prop="equip_no"
        label="机台"
      />
      <el-table-column
        align="center"
        prop="product_no"
        label="配方号"
      />
      <el-table-column
        align="center"
        prop="total_weight"
        label="重量（kg）"
      >
        <template slot-scope="{row}">
          <span v-if="row.material_name==='小计'||row.material_name==='合计'"> {{ null }}</span>
          <span v-else> {{ row.total_weight }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import EquipSelect from '@/components/EquipSelect'
import { classesListUrl, materialsUrl, productMaterials } from '@/api/base_w'
import { xlPlanConsume } from '@/api/jqy'
import { exportExcel } from '@/utils'
export default {
  name: 'MaterialConsumption',
  components: { EquipSelect },
  data() {
    return {
      loadingView: false,
      loading: false,
      type: 2,
      MaterialOptions: [],
      options: [],
      index: null,
      material_name: null,
      btnLoading: false,
      tableData: [],
      optionsProduct: [],
      search: {}
    }
  },
  created() {
    this.getList()
    this.getProduct()
    this.getMaterial()
    this.getProductList()
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
    async getProductList() {
      try {
        const data = await productMaterials('get', null, { params: { all: 1 }})
        this.options = data || []
      } catch (e) {
        //
      }
    },
    async getMaterial() {
      try {
        const data = await materialsUrl('get', null, { params: { all: 1 }})
        this.MaterialOptions = data.results
      } catch (e) {
        //
      }
    },
    async getList() {
      try {
        this.type = 2
        this.loading = true
        const data = await xlPlanConsume('get', null, { params: this.search })
        this.tableData = data.result || []
        this.tableData = this.tableData.concat(getNewGoodsList(this.tableData))
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
            total: sum(this.tableData, 'total_weight').toFixed(2),
            total_weight: sum(this.tableData, 'total_weight').toFixed(2)
          })
          this.arr = []
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
      await exportExcel('细料分解每日计划用量')
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
function getNewGoodsList(params) {
  var temp = {}
  for (var i in params) {
    var key = params[i].material_type // 判断依据.
    if (temp[key]) {
      temp[key].material_type = params[i].material_type
      temp[key].material_name = '小计'
      temp[key].total_weight += params[i].total_weight
    } else {
      temp[key] = {}
      temp[key].material_type = params[i].material_type
      temp[key].material_name = '小计'
      temp[key].total_weight = params[i].total_weight
    }
  }
  var newArry = []
  for (var k in temp) {
    newArry.push(temp[k])
  }
  newArry.forEach(d => {
    d.total_weight = d.total_weight === 0 ? null : d.total_weight
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
.materialPlan{
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
