<template>
  <div>
    <!-- 仓库位置下拉 -->
    <el-select
      v-model="value"
      placeholder="请选择仓库位置"
      :loading="loading"
      :clearable="isClear"
      @visible-change="visibleChange"
      @change="changSelect"
    >
      <el-option
        v-for="item in options"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </div>
</template>

<script>
import { stationInfo } from '@/api/warehouse'
export default {
  props: {
    //  created里面加载,是否默认显示第一个
    createdIs: {
      type: Boolean,
      default: false
    },
    defaultVal: {
      type: Number,
      default: null
    },
    // 是否可清空
    isClear: {
      type: Boolean,
      default: false
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
    this.$emit('changSelect', this.value)
    if (this.createdIs) {
      this.value = this.options[0]
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await stationInfo('get', null, { params: { all: 1 }})
        this.options = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    visibleChange(val) {
      if (val && this.options.length === 0 && !this.createdIs) {
        // this.getList()
      }
    },
    changSelect(val) {
      // let arr = []
      // arr = this.options.filter(D => D.id === val)
      this.$emit('changSelect', val)
    }
  }
}
</script>

<style>

</style>
