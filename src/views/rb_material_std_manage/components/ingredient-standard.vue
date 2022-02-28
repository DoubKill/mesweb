<template>
  <div>
    <!-- 胶料配料标准 -->
    <h3 v-if="isView&&!tableData.length?false:true">{{ formObj.stage_name==='FM'?'硫磺':'细料' }}</h3>
    <div
      v-for="(tableItem,_i) in tableData"
      :key="_i"
    >
      <el-table
        :data="tableItem"
        border
        show-summary
      >
        <el-table-column
          label="No"
          type="index"
          width="60"
        />
        <el-table-column
          prop="material_type"
          label="类别"
          width="80"
          column-key="material_type"
        />
        <el-table-column label="原材料">
          <template slot-scope="{row,$index}">
            <el-input
              v-model="row.material_name"
              size="mini"
              :disabled="true"
            >
              <el-button
                v-if="!isView"
                slot="append"
                icon="el-icon-search"
                @click="pop_up_raw_material(_i,$index)"
              />
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="实际重量/kg"
          prop="standard_weight"
        >
          <template slot-scope="{row,$index}">
            <el-input-number
              v-model.number="row.standard_weight"
              size="mini"
              :min="0"
              controls-position="right"
              :disabled="isView"
              @change="checkTolerance(row,$index,_i)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="误差"
          prop="standard_error"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-model.number="row.standard_error"
              size="mini"
              controls-position="right"
              :disabled="isView"
            />
          </template>
        </el-table-column>
        <el-table-column v-for="(item) in formObj.enable_equip" :key="item" :label="item">
          <template slot-scope="{row}">
            <el-select
              v-model="row.master[item]"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item1 in formObj.stage_name==='FM'?['S','F']:['S','F','C']"
                :key="item1"
                :label="item1"
                :value="item1"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!isView"
          label="操作"
        >
          <template slot-scope="{$index}">
            <el-button
              size="mini"
              @click="deleteRow($index,_i)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-table
          :data="tableItem"
          border
          show-summary
          :span-method="arraySpanMethod"
        >
          <el-table-column
            label="配料方式"
            width="90"
          >
            <template slot-scope="{row}">
              {{ setPackageType(row.package_type) }}
            </template>
          </el-table-column>
          <el-table-column
            label="料包编码"
          >
            <template slot-scope="{row}">
              {{ row.name }}/<el-input-number
                v-model="row.package_cnt"
                controls-position="right"
                :min="1"
                style="width:120px"
                @blur="changeNum(row,_i)"
              />包
            </template>
          </el-table-column>
          <el-table-column
            label="原材料"
          >
            <template slot-scope="{row,$index}">
              <el-input
                v-model="row.material_name"
                size="mini"
                :disabled="true"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="pop_up_raw_material(_i,$index)"
                />
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="实际重量(kg)"
            prop="standard_weight"
          >
            <template slot-scope="{row}">
              <el-input-number
                v-model.number="row.standard_weight"
                size="mini"
                :min="0"
                controls-position="right"
                :disabled="isView"
                @input="changeNum(row,_i)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="误差"
            prop="standard_error"
          >
            <template slot-scope="{row}">
              <el-input-number
                v-model.number="row.standard_error"
                size="mini"
                :min="0"
                :disabled="isView"
                controls-position="right"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="单包重量(kg)"
            prop="single_weight"
          >
            <template slot-scope="{row}">
              <span v-if="row.standard_weight">
                {{ row.single_weight }}
              </span>
              <span v-else />
            </template>
          </el-table-column>
          <el-table-column v-if="!isView" align="center" label="操作">
            <template slot-scope="{$index}">
              <el-button size="mini" @click="deleteRow($index,_i)">删除</el-button>
            </template>
          </el-table-column>
        </el-table> -->
    </div>
    <div v-if="!isView" style="text-align: center;">
      <el-button size="mini" @click="insertOneRow(0)">插入一行</el-button>
    </div>
  </div>
</template>

<script>
import { equip_category_url } from '@/api/rubber_recipe_fun'
import { productBatchingDetail } from '@/api/small-material-recipe'
import { getMaterialTolerance } from '@/api/base_w_five'
export default {
  props: {
    isIngredientObj: {
      type: Object,
      default() {
        return {}
      }
    },
    formObj: {
      type: Object,
      default() {
        return {}
      }
    },
    addTableData: {
      type: Array,
      default() {
        return []
      }
    },
    isView: {
      type: Boolean,
      default() {
        return false
      }
    },
    dialogVisible: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      devTypeOptions: [],
      select_dev_type: '',
      tableData: [],
      productBatchingDetailList: [],
      currentFaIndex: '',
      currentIndex: '',
      weight_cnt_types_delete: [],
      weight_material_delete: []
    }
  },
  watch: {
    dialogVisible(val) {
    },
    addTableData(val) {
      val.forEach(d => {
        d.forEach(D => {
          if (!D.master) {
            this.$set(D, 'master', {})
          }
          // 去掉-H
          for (const key in D.master) {
            if (Object.hasOwnProperty.call(D.master, key)) {
              const element = D.master[key]
              if (element.indexOf('-H') > -1) {
                D.master[key] = ''
              }
            }
          }
        })
      })

      this.tableData = val
    },
    isIngredientObj(row) {
      if (JSON.stringify(row) === '{}') {
        return
      }
      this.$set(this.tableData[this.currentFaIndex][this.currentIndex], 'material_name', row.material_name)
      this.$set(this.tableData[this.currentFaIndex][this.currentIndex], 'material', row.id)
      this.$set(this.tableData[this.currentFaIndex][this.currentIndex], 'sn', 0)
      this.$set(this.tableData[this.currentFaIndex][this.currentIndex], 'material_type', row.material_type_name)
    },
    'formObj.enable_equip'(arr) {
      this.tableData.forEach(d => {
        d.forEach((D, i) => {
          const arr1 = {}
          arr.forEach(dd => {
            if (i === 0 && !D.master[dd]) {
              if (this.formObj.stage_name === 'FM') {
                D.master[dd] = 'S'
              } else {
                D.master[dd] = 'F'
              }
            }
            arr1[dd] = D.master ? D.master[dd] : ''
          })
          D.master = arr1
        })
      })
    }
  },
  mounted() {
    this.weight_cnt_types_delete = []
    this.equip_category_list()
    this.getProductBatching()
  },
  updated() {
  },
  methods: {
    NewsaveMaterialClicked() {},
    async equip_category_list() {
      try {
        const equip_category_list = await equip_category_url('get', {
          params: { all: 1, equip_type_name: '密炼设备' }
        })
        this.devTypeOptions = equip_category_list.results
      } catch (e) { throw new Error(e) }
    },
    async getProductBatching() {
      const response = await productBatchingDetail()
      this.productBatchingDetailList = response || []
      this.productBatchingDetailList.forEach(D => {
        D.disabled = false
      })
    },
    setPackageType(val) {
      return val === 1 ? '自动' : '手动'
    },
    updateRow() {},
    async checkTolerance(row, index, faI) {
      try {
        const data = await getMaterialTolerance('get', null, { params: {
          material_name: row.material_name,
          standard_weight: row.actual_weight || row.standard_weight,
          only_num: true }})
        if (data) {
          this.tableData[faI][index].standard_error = data
        }
      } catch (e) {
        //
      }
    },
    changeNum(row) {
      const a = (Number(row.standard_weight) / Number(row.package_cnt)).toFixed(2)
      this.$set(row, 'single_weight', a)
    },
    pop_up_raw_material(faIndex, index) {
      this.currentFaIndex = faIndex
      this.currentIndex = index
      this.$emit('pop_up_raw_material', false)
      this.$emit('setCurrentMaterial', this.tableData)
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        if (rowIndex % 999 === 0) {
          return {
            rowspan: 999,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    deleteRow(index, faIndex) {
      // if (this.tableData[faIndex].length === 1) {
      //   this.$message.info('保留最少一行数据')
      //   return
      // }
      const a = this.tableData[faIndex].splice(index, 1)
      if (a[0].id) {
        this.weight_material_delete.push(a[0].id)
      }
      if (this.tableData[faIndex].length === 0) {
        this.tableData.splice(faIndex, 1)
      }
      this.$emit('deleteRow', this.weight_material_delete)
    },
    deleteOneRow(index) {
      const a = this.tableData.splice(index, 1)
      if (a[0][0].weigh_cnt_type) {
        this.weight_cnt_types_delete.push(a[0][0].weigh_cnt_type)
      }
      this.$emit('deleteOneRow', this.weight_cnt_types_delete)
    },
    insertOneRow(index) {
      if (!this.tableData.length) {
        this.$set(this.tableData, index, [])
      }
      const obj = {}
      if (this.tableData[index].length === 0) {
        this.formObj.enable_equip.forEach(d => {
          if (this.formObj.stage_name === 'FM') {
            obj[d] = 'S'
          } else {
            obj[d] = 'F'
          }
        })
      }
      this.tableData[index].push({
        name: '',
        package_cnt: '',
        package_type: '',
        master: obj
      })
    }
  }
}
</script>

<style>

</style>
