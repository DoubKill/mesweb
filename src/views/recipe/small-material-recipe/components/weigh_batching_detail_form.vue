<template>
  <div>
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
        <el-input v-model="productBatching.dev_type_name" size="mini" :disabled="true" />
      </el-form-item>
      <el-form-item label="配料重量">
        <el-input v-model="productBatching.batching_weight" size="mini" :disabled="true" />
      </el-form-item>
      <el-form-item label="炼胶时间">
        <el-input v-model="productBatching.production_time_interval" size="mini" :disabled="true" />
      </el-form-item>
    </el-form>
    <div style="width:100%;text-align:right;margin-bottom:10px">
      <el-button v-if="edit" @click="save">保存</el-button>
    </div>
    <weigh-type-form
      v-for="type in weight_types"
      :key="type.name"
      :product-batching-detail="product_batching_detail"
      :weight-type="type"
      :edit="edit"
      @updateRow="updateRow"
    />
  </div>
</template>

<script>
import { productBatchingDetail, createWeighBatching, updateWeighCntType } from '@/api/small-material-recipe'
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
    weighBatching: {
      type: Object,
      required: false,
      default: null
    },
    edit: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      weight_types: [{
        name: '化工药品A',
        weigh_type: 1,
        package_cnt: 1,
        weigh_batching_detail: []
      }, {
        name: '化工药品B',
        weigh_type: 2,
        package_cnt: 1,
        weigh_batching_detail: []
      }],
      product_batching_detail: []
    }
  },
  watch: {
    productBatching() {
      this.updateWeightTypes()
    }
  },
  created() {
    this.updateWeightTypes()
  },
  methods: {
    async save() {
      if (this.productBatching) {
        let weighBatching = null
        if (!this.weighBatching) {
          weighBatching = await createWeighBatching(this.productBatching.id)
        } else {
          weighBatching = this.weighBatching
        }
        const weighcnttype_set = weighBatching.weighcnttype_set
        weighcnttype_set.forEach(async cnt_type => {
          const weight_type = this.weight_types.find(item => {
            return item.weigh_type === cnt_type.weigh_type
          })
          const weighbatchingdetail_set = []
          if (weight_type) {
            for (let i = 0; i < weight_type.weigh_batching_detail.length; ++i) {
              if (weight_type.weigh_batching_detail[i].material) {
                weighbatchingdetail_set.push({
                  material: weight_type.weigh_batching_detail[i].material,
                  standard_weight: weight_type.weigh_batching_detail[i].actual_weight
                })
              }
            }
            await updateWeighCntType(cnt_type.id, {
              package_cnt: weight_type.package_cnt,
              weighbatchingdetail_set
            })
          }
        })
        this.$emit('created')
      }
    },
    updateRow() {
      const _weighbatchingdetail_set = []
      this.weight_types.forEach(cnt_type => {
        cnt_type.weigh_batching_detail
        _weighbatchingdetail_set.push(...cnt_type.weigh_batching_detail)
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
      this.weight_types = [{
        name: '化工药品A',
        weigh_type: 1,
        package_cnt: 1,
        weigh_batching_detail: []
      }, {
        name: '化工药品B',
        weigh_type: 2,
        package_cnt: 1,
        weigh_batching_detail: []
      }]
      if (this.productBatching && this.productBatching.stage_name && this.productBatching.stage_name.toLowerCase() === 'fm') {
        this.weight_types.push({
          name: '硫磺',
          weigh_type: 3,
          package_cnt: 1,
          weigh_batching_detail: []
        })
      }
      this.product_batching_detail = []
      if (this.productBatching) {
        const response = await productBatchingDetail(this.productBatching.id)
        this.product_batching_detail = response.results
      }

      if (this.weighBatching) {
        this.weighBatching.weighcnttype_set.forEach(cnttype => {
          const weight_type = this.weight_types.find(type => {
            return type.weigh_type === cnttype.weigh_type
          })
          if (weight_type) {
            weight_type.package_cnt = cnttype.package_cnt
            for (let i = 0; i < cnttype.weighbatchingdetail_set.length; i++) {
              const detail = cnttype.weighbatchingdetail_set[i]
              weight_type.weigh_batching_detail.push({
                material: detail.material,
                actual_weight: detail.standard_weight,
                material_name: detail.material_name,
                material_no: detail.material_no
              })
            }
          }
        })
      }
    }
  }
}
</script>
