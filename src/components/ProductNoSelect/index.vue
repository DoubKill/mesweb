<template>
  <el-select
    v-model="productBatchingId"
    clearable
    :loading="loading"
    @change="productBatchingChanged"
    @visible-change="visibleChange"
  >
    <el-option
      v-for="item in productBatchings"
      :key="item.id"
      :label="item.stage_product_batch_no"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { rubberMaterialUrl } from '@/api/base_w'
export default {
  props: {
    isStageProductbatchNoRemove: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productBatchings: [],
      productBatchingId: '',
      productBatchingById: {},
      loading: true
    }
  },
  created() {
  },
  methods: {
    productBatchingChanged() {
      this.$emit('productBatchingChanged', this.productBatchingById[this.productBatchingId])
    },
    visibleChange(bool) {
      if (bool && this.productBatchings.length === 0) {
        this.getProductBatchings()
      }
    },
    getProductBatchings() {
      this.loading = true
      // eslint-disable-next-line object-curly-spacing
      rubberMaterialUrl('get', null, { params: { all: 1 } }).then(response => {
        let productBatchings = response.results
        productBatchings.forEach(productBatching => {
          this.productBatchingById[productBatching.id] = productBatching
        })
        if (this.isStageProductbatchNoRemove) {
          // 根据stage_product_batch_no去重
          var obj = {}
          var newArr = productBatchings.reduce((item, next) => {
            obj[next.stage_product_batch_no]
              ? ' '
              : (obj[next.stage_product_batch_no] = true && item.push(next))
            return item
          }, [])
          productBatchings = newArr || []
        }
        this.productBatchings = productBatchings
        this.loading = false
      })
    }
  }
}
</script>
