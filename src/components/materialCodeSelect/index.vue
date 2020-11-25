<template>
  <div>
    <!-- 原材料编码下拉 -->
    <el-select
      v-model="value"
      filterable
      placeholder="请选择物料编码"
      :loading="loading"
      clearable
      @visible-change="visibleChange"
      @change="changeSelect"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.material_no"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import { materialsUrl } from '@/api/base_w'
export default {
  props: {
    //  created里面加载
    createdIs: {
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
        const data = await materialsUrl('get', null, { params: { all: 1 }})
        this.options = data.results || []
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
    changeSelect(val) {
    //   let arr = []
    //   arr = this.options.filter(D => D.material_no === val)
      this.$emit('changeSelect', val)
    }
  }
}
</script>

<style>

</style>
