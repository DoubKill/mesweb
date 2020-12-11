<template>
  <div>
    <!-- 库存位下拉框 -->
    <el-select
      v-model="value"
      filterable
      placeholder="请选择库存位"
      :loading="loading"
      clearable
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
import { locationNameList } from '@/api/base_w_two'
export default {
  props: {
    //  created里面加载
    createdIs: {
      type: Boolean,
      default: false
    },
    defaultVal: {
      type: Number,
      default: null
    },
    isEnable: { // 是否只显示启用
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
    if (this.createdIs) {
      this.getList()
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await locationNameList('get')
        let listData = data || []
        if (this.isEnable) {
          let arr = []
          arr = listData.filter(D => D.used_flag === 1)
          listData = arr
        }
        this.options = listData || []
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
      let arr = []
      arr = this.options.filter(D => D.id === val)
      this.$emit('changSelect', arr[0])
    }
  }
}
</script>

<style>

</style>
