<template>
  <div>
    <!-- 胶料配料标准 -->
    <!-- <div style="float: right"> -->
    <!-- <el-button style="margin-bottom:10px" @click="addMaterial">新建料包</el-button> -->
    <!-- <el-button @click="NewsaveMaterialClicked">保存</el-button> -->
    <!-- </div> -->
    <div v-if="tableData.length>0">
      <div
        v-for="(tableItem,_i) in tableData"
        :key="_i"
      >
        <el-table
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
              {{ row.name }}/{{ row.package_cnt }}包
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
                @input="changeNum(row)"
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
        </el-table>
        <div v-if="!isView" style="text-align: center;">
          <el-button size="mini" @click="insertOneRow(_i)">插入一行</el-button>
          <el-button size="mini" @click="deleteOneRow(_i)">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { equip_category_url } from '@/api/rubber_recipe_fun'
import { productBatchingDetail } from '@/api/small-material-recipe'
export default {
  props: {
    isIngredientObj: {
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
    isCopy: {
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
    addTableData(val) {
      if (this.isCopy) {
        return
      }
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
    }
  },
  mounted() {
    this.weight_cnt_types_delete = []
    this.equip_category_list()
    this.getProductBatching()
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
    changeNum(row) {
      row.single_weight = (Number(row.standard_weight) / Number(row.package_cnt)).toFixed(2)
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
      if (this.tableData[faIndex].length === 1) {
        this.$message.info('保留最少一行数据')
        return
      }
      const a = this.tableData[faIndex].splice(index, 1)
      if (a[0].id) {
        this.weight_material_delete.push(a[0].id)
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
      const _value = this.tableData[index][0]
      this.tableData[index].push({
        name: _value.name,
        package_cnt: _value.package_cnt,
        package_type: _value.package_type
      })
    }
  }
}
</script>

<style>

</style>
