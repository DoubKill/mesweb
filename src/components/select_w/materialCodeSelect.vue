<template>
  <div>
    <!-- 物料编码下拉 -->
    <el-select
      v-model="value"
      filterable
      placeholder="请选择"
      :loading="loading"
      :clearable="isClearable"
      :allow-create="isAllowCreate"
      @visible-change="visibleChange"
      @change="changSelect"
    >
      <el-option
        v-for="item in options"
        :key="item.material_no"
        :label="item.label"
        :value="item.material_no"
      />
    </el-select>
  </div>
</template>

<script>
import { materialCount } from '@/api/base_w'
export default {
  props: {
    //  created里面加载
    createdIs: {
      type: Boolean,
      default: false
    },
    isClearable: {
      type: Boolean,
      default: false
    },
    isAllowCreate: { // 创建条目
      type: Boolean,
      default: false
    },
    defaultVal: {
      type: String,
      default: null
    },
    storeName: {
      type: String,
      default: null
    },
    labelShow: { // label取值
      type: String,
      default: 'material_no'
    },
    status: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      value: this.defaultVal,
      loading: false,
      options: []
    }
  },
  watch: {
    defaultVal(val) {
      this.value = val
    },
    status(val) {
      if (val) {
        this.value = ''
        this.getList()
      }
    },
    storeName(val) {
      this.value = ''
      this.options = []
    }
  },
  created() {
    if (this.createdIs) {
      this.getList()
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await materialCount('get', null, { params: { store_name: this.storeName, status: this.status }})
        if (this.labelShow === 'material_name') {
          data.forEach(d => {
            d.label = d.material_name + ' / ' + d.material_no
          })
        } else {
          data.forEach(d => {
            d.label = d.material_no
          })
        }

        this.options = data || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    visibleChange(val) {
      if (val && this.options.length === 0 && !this.createdIs) {
        this.getList()
      }
    },
    changSelect(val) {
      if (this.isAllowCreate) {
        this.$emit('changSelect', { material_no: val })
        return
      }
      let arr = []
      arr = this.options.filter(D => D.material_no === val)
      this.$emit('changSelect', arr[0])
    }
  }
}
</script>

<style>

</style>
