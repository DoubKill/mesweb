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
        <el-col :span="24" style=""><span>{{ weightType.name }}</span></el-col>
      </el-row>
    </el-col>
    <el-col :span="20">
      <el-table
        :key="tableKey"
        border
        :data="weightType.weigh_batching_detail"
      >
        <el-table-column label="原材料编码" prop="material_no" align="center" />
        <el-table-column label="原材料名称" align="center">
          <template slot-scope="{ row }">
            <el-select
              v-model="row.material"
              :disabled="!edit"
              @change="updateRow(row)"
            >
              <el-option
                v-for="item in productBatchingDetail"
                :key="item.id"
                :label="item.material_name"
                :value="item.material"
                :disabled="item.disabled"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="实际重量(kg)" prop="actual_weight" align="center" />
        <el-table-column v-if="edit" align="center" label="操作">
          <template slot-scope="{row}">
            <el-button size="mini" @click="deleteRow(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form>
        <el-form-item style="text-align: center">
          <el-button v-if="edit" @click="insertOneRow">插入一行</el-button>
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
      required: true
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
        this.updateTable()
      }
    }
  },
  created() {
    //   console.log()
    this.updateTable()
  },
  methods: {
    updateTable() {
      for (let i = 0; i < this.weightType.weigh_batching_detail.length; ++i) {
        const batching_detail = this.weightType.weigh_batching_detail[i]
        let detail = this.productBatchingDetail.find(item => {
          return item.material === batching_detail.material
        })
        if (!detail) {
          detail = batching_detail
          this.productBatchingDetail.push(batching_detail)
        }
        for (let j = 0; j < this.productBatchingDetail.length; j++) {
          const deltail_ = this.productBatchingDetail[j]
          if (deltail_.material === this.weightType.weigh_batching_detail[i].material) {
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
      this.weightType.weigh_batching_detail.splice(this.weightType.weigh_batching_detail.indexOf(row), 1)
    },
    insertOneRow() {
      this.weightType.weigh_batching_detail.push({})
    },
    updateRow(row) {
      const detail = this.productBatchingDetail.find(item => {
        return item.material === row.material
      })
      for (let j = 0; j < this.weightType.weigh_batching_detail.length; ++j) {
        if (this.weightType.weigh_batching_detail[j].material === detail.material) {
          this.weightType.weigh_batching_detail[j] = JSON.parse(JSON.stringify(detail))

          for (let i = 0; i < this.productBatchingDetail.length; i++) {
            const deltail_ = this.productBatchingDetail[i]
            if (deltail_.material === this.weightType.weigh_batching_detail[j].material) {
              this.$set(deltail_, 'disabled', true)
            }
          }
          break
        }
      }
      this.tableKey += 1
    }
  }
}
</script>
