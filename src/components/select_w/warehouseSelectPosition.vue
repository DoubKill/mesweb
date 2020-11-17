<template>
  <div>
    <!-- 仓库位置下拉 -->
    <el-select
      v-model="value"
      placeholder="请选择仓库位置"
      :loading="loading"
      :clearable="isClear"
      no-data-text="暂无启用的仓库"
      @visible-change="visibleChange"
      @change="changSelect"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id"
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
      type: String,
      default: null
    },
    // 是否可清空
    isClear: {
      type: Boolean,
      default: false
    },
    warehouseName: {
      type: String,
      default: null
    },
    startUsing: { // 只显示启用的
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: null,
      loading: false,
      options: []
    }
  },
  watch: {
    defaultVal(val) {
      this.value = val || null
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
        const data = await stationInfo({ all: 1, warehouse_name: this.warehouseName })
        this.loading = false
        if (this.startUsing) {
          this.options = data.filter(D => { return D.use_flag })
          return
        }
        this.options = data || []
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
      let arr = []
      arr = this.options.filter(D => D.id === val)
      this.$emit('changSelect', arr[0])
    }
  }
}
</script>

<style>

</style>
