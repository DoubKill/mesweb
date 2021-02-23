<template>
  <div v-if="productBatching">
    <el-form :inline="true">
      <el-form-item label="胶料编码">
        <el-input v-model="productBatching.stage_product_batch_no" size="mini" :disabled="true" />
      </el-form-item>
      <el-form-item label="胶料名称">
        <el-input v-model="productBatching.product_name" size="mini" :disabled="true" />
      </el-form-item>
      <el-form-item label="状态">
        <el-input size="mini" value="编辑" :disabled="true" />
      </el-form-item>
      <el-form-item label="炼胶机类型">
        <el-input v-model="productBatching.category_name" size="mini" :disabled="true" />
      </el-form-item>
      <el-form-item label="配料重量/kg">
        <el-input v-model="productBatching.batching_weight" size="mini" :disabled="true" />
      </el-form-item>
      <el-form-item label="炼胶时间">
        <el-input v-model="productBatching.production_time_interval" size="mini" :disabled="true" />
      </el-form-item>
      <el-form-item>
        <el-button v-if="edit" @click="add">新增料包</el-button>
      </el-form-item>
    </el-form>
    <div v-if="weight_types.length>0&&edit" style="width:100%;text-align:right;margin-bottom:10px">
      <el-button @click="save">保存</el-button>
    </div>
    <div v-if="weight_types.length>0">
      <weigh-type-form
        v-for="(value,index) in weight_types"
        :key="value.id"
        :weight-type="value"
        :product-batching-detail="product_batching_detail"
        :edit="edit"
        @updateRow="updateRow"
        @deleteWholeRow="deleteWholeRow(index)"
      />
    </div>

    <el-dialog
      title="新增料包"
      :visible.sync="dialogVisibleAdd"
      width="600px"
      :before-close="handleCloseAdd"
      append-to-body
    >
      <el-form ref="ruleAddObj" label-width="120px" :model="addObj" :rules="rules">
        <el-form-item label="分包数量" prop="package_cnt">
          <el-select v-model="addObj.package_cnt">
            <el-option
              v-for="num in [1, 2, 3]"
              :key="num"
              :label="num"
              :value="num"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="料包类型" prop="weigh_type">
          <el-select v-model="addObj.weigh_type">
            <el-option
              v-for="val in [{id:1,name:'硫磺包'}, {id:2,name:'细料包'}]"
              :key="val.id"
              :label="val.name"
              :value="val.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="打包机类型" prop="package_type">
          <el-select v-model="addObj.package_type">
            <el-option
              v-for="val in [{id:1,name:'自动'}, {id:2,name:'手动'}]"
              :key="val.id"
              :label="val.name"
              :value="val.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseAdd(false)">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { productBatchingDetail, changeWeighBatching, createWeighBatching } from '@/api/small-material-recipe'
import WeighTypeForm from './weigh_type_form'

export default {
  components: { WeighTypeForm },
  props: {
    productBatching: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    },
    currentId: {
      type: [String, Number],
      required: false,
      default: null
    },
    edit: {
      type: Boolean,
      required: false,
      default: true
    },
    isCreateText: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      dialogVisibleAdd: false,
      addObj: {
        package_cnt: null,
        weigh_type: null,
        package_type: null
      },
      rules: {
        package_cnt: [{ required: true, message: '请选择分包数量', trigger: 'change' }],
        weigh_type: [{ required: true, message: '请选择料包类型', trigger: 'change' }],
        package_type: [{ required: true, message: '请选择打包机类型', trigger: 'change' }]
      },
      weight_types: [],
      product_batching_detail: []
    }
  },
  watch: {
    productBatching() {
      this.weight_types = []
      this.updateWeightTypes()
    }
  },
  created() {
    this.weight_types = []
    this.updateWeightTypes()
  },
  methods: {
    add() {
      this.dialogVisibleAdd = true
    },
    handleCloseAdd(done) {
      this.dialogVisibleAdd = false
      this.$refs.ruleAddObj.resetFields()
      if (done) {
        done()
      }
    },
    submitAdd() {
      this.$refs.ruleAddObj.validate((valid) => {
        if (valid) {
          this.dialogVisibleAdd = false

          this.weight_types.push({
            package_cnt: this.addObj.package_cnt,
            package_type: this.addObj.package_type,
            weigh_type: this.addObj.weigh_type,
            weight_details: []
          })

          this.handleCloseAdd(false)
        } else {
          return false
        }
      })
    },
    async save() {
      if (this.weight_types) {
        this.weight_types.forEach(D => {
          D.weight_details.forEach((d, i) => {
            if (JSON.stringify(d) === '{}') {
              delete D.weight_details[i]
              D.weight_details.splice(i, 1)
            }
          })
        })
        const _api = this.isCreateText ? createWeighBatching : changeWeighBatching
        try {
          await _api(this.currentId, {
            weight_types: this.weight_types,
            product_batching: this.productBatching.product_batching
          })
          this.$message.success('操作成功')
          this.$emit('created')
        } catch (e) {
          console.log(e, 77788)
        }
      }
    },
    deleteWholeRow(index) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.weight_types.splice(index, 1)
        this.updateRow()
      })
    },
    updateRow() {
      const _weighbatchingdetail_set = []
      this.weight_types.forEach(cnt_type => {
        _weighbatchingdetail_set.push(...cnt_type.weight_details)
      })

      this.product_batching_detail.forEach(D => {
        const arr = _weighbatchingdetail_set.filter(d =>
          d.material === D.material
        )
        if (arr.length > 0) {
          this.$set(D, 'disabled', true)
        } else {
          this.$set(D, 'disabled', false)
        }
      })
    },
    async updateWeightTypes() {
      this.product_batching_detail = []
      if (this.productBatching) {
        const response = await productBatchingDetail(this.productBatching.product_batching)
        this.product_batching_detail = response || []
      }
      if (this.productBatching && Object.prototype.hasOwnProperty.call(this.productBatching, 'weight_types')) {
        this.weight_types = this.productBatching.weight_types
        // this.productBatching.weight_types.forEach(cnttype => {
        //     const weight_type = this.weight_types.find(type => {
        //       return type.weigh_type === cnttype.weigh_type
        //     })
        //     if (weight_type) {
        //       weight_type.package_cnt = cnttype.package_cnt
        //       for (let i = 0; i < cnttype.weighbatchingdetail_set.length; i++) {
        //         const detail = cnttype.weighbatchingdetail_set[i]
        //         weight_type.weight_details.push({
        //           material: detail.material,
        //           actual_weight: detail.standard_weight,
        //           material_name: detail.material_name,
        //           material_no: detail.material_no
        //         })
        //       }
        //     }
        // })
      }
    }
  }
}
</script>
