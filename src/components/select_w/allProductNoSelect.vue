<template>
  <!-- 上辅机和mes全部胶料下拉框 -->
  <el-select
    v-model="productBatchingId"
    clearable
    filterable
    :loading="loading"
    :allow-create="isCreated"
    @change="productBatchingChanged"
    @visible-change="visibleChange"
  >
    <el-option
      v-for="item in productBatchings"
      :key="item.id"
      :label="item[labelName]"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { batchingMaterials } from '@/api/base_w'
export default {
  props: {
    isStageProductbatchNoRemove: {
      type: Boolean,
      default: false
    },
    // 过滤出启用和弃用的胶料
    makeUseBatch: {
      type: Boolean,
      default: false
    },
    typeParms: {
      type: [String, Number],
      default: null
    },
    isCreated: { // 是可创建条目
      type: Boolean,
      default: false
    },
    labelName: {
      type: String,
      default: 'material_no'
    },
    paramsObj: {
      type: Object,
      default() {
        return {}
      }
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
  watch: {
  },
  created() {
  },
  methods: {
    productBatchingChanged() {
      this.$emit('productBatchingChanged', this.productBatchingById[this.productBatchingId])
    },
    visibleChange(bool) {
      if (bool) {
        this.getProductBatchings()
      }
    },
    getProductBatchings() {
      this.loading = true
      // eslint-disable-next-line object-curly-spacing
      const obj = Object.assign({ all: 1, type: this.typeParms }, this.paramsObj)
      if (JSON.stringify(this.paramsObj) === '{}') {
        obj.all = 1
      } else {
        delete obj.all
      }
      batchingMaterials('get', null, { params: obj }).then(response => {
        let productBatchings = response
        productBatchings.forEach(productBatching => {
          this.productBatchingById[productBatching.id] = productBatching
        })
        if (this.makeUseBatch) {
          let arr = []
          arr = productBatchings.filter(D => D.used_type === 4 || D.used_type === 6)
          productBatchings = arr
        }
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
        this.loading = false
        this.productBatchings = productBatchings
      })
    }
  }
  // USE_TYPE_CHOICE = (
  //       (1, '编辑'),
  //       (2, '提交'),
  //       (3, '校对'),
  //       (4, '启用'),
  //       (5, '驳回'),
  //       (6, '废弃')
  //   )
}
</script>
