<template>
  <el-row>
    <el-col :span="4">
      <el-row>
        <el-col :span="24">
          <el-form label-width="80px">
            <el-form-item label="分包">
              <el-select v-model="weightType.package_cnt" :disabled="!edit">
                <el-option
                  v-for="num in [1, 2, 3]"
                  :key="num"
                  :label="num"
                  :value="num"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align:right;padding-right:5px"><span>{{ weightType.package_type===1?'自动':'手动' }}</span></el-col>
        <el-col :span="24" style="text-align:right;padding-right:5px"><span>{{ weightType.weigh_type===1?'硫磺包':'细料包' }}</span></el-col>
      </el-row>
    </el-col>
    <el-col :span="20">
      <el-table
        :key="tableKey"
        borderming
        :data="weightType.weight_details"
      >
        <el-table-column label="原材料编码" prop="material_no" align="center" />
        <el-table-column label="原材料名称" align="center">
          <template slot-scope="{ row, $index }">
            <el-select
              v-model="row.material"
              :disabled="!edit"
              @change="updateRow(row,$index)"
            >
              <el-option
                v-for="item in productBatchingDetail"
                :key="item.material"
                :label="item.material_name"
                :value="item.material"
                :disabled="item.disabled"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="实际重量(kg)" prop="standard_weight" align="center" />
        <el-table-column v-if="edit" align="center" label="操作">
          <template slot-scope="{row}">
            <el-button size="mini" @click="deleteRow(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form>
        <el-form-item style="text-align: center">
          <el-button v-if="edit" @click="insertOneRow">插入一行</el-button>
          <el-button v-if="edit" @click="deleteWholeRow">删除料包</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    weightType: {
      type: Object,
      required: false,
      default: undefined
    },
    productBatchingDetail: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    edit: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      tableKey: 1
    }
  },
  watch: {
    productBatchingDetail() {
      if (this.productBatchingDetail) {
        this.$emit('updateRow')
      }
    }
  },
  created() {
    console.log(this.weightType)
    this.$emit('updateRow')
  },
  methods: {
    updateTable() {
      for (let i = 0; i < this.weightType.weight_details.length; ++i) {
        const batching_detail = this.weightType.weight_details[i]
        let detail = this.productBatchingDetail.find(item => {
          return item.material === batching_detail.material
        })
        if (!detail) {
          detail = batching_detail
          this.productBatchingDetail.push(batching_detail)
        }
        for (let j = 0; j < this.productBatchingDetail.length; j++) {
          const deltail_ = this.productBatchingDetail[j]
          if (deltail_.material === this.weightType.weight_details[i].material) {
            this.$set(deltail_, 'disabled', true)
          }
        }
      }
    },
    deleteRow(row) {
      for (let i = 0; i < this.productBatchingDetail.length; i++) {
        const deltail = this.productBatchingDetail[i]
        if (deltail.material === row.material) {
          deltail.disabled = false
        }
      }
      this.weightType.weight_details.splice(this.weightType.weight_details.indexOf(row), 1)
    },
    insertOneRow() {
      this.weightType.weight_details.push({})
    },
    deleteWholeRow() {
      this.$emit('deleteWholeRow')
    },
    updateRow(row, index) {
      const detail = this.productBatchingDetail.find(item => {
        return item.material === row.material
      })
      const _obj = JSON.parse(JSON.stringify(detail))
      _obj.standard_weight = _obj.actual_weight
      this.weightType.weight_details[index] = _obj

      this.tableKey += 1
      this.$emit('updateRow')
    }
  }
}
</script>
