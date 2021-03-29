<template>
  <div>
    <!--原材料 等级管理下拉框 -->
    <el-select
      v-model="value"
      placeholder="请选择等级"
      :loading="loading"
      @visible-change="visibleChange"
      @change="changSelect"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.level"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import { levelResultRaw } from '@/api/base_w_three'
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
    }
  },
  data() {
    return {
      value: '',
      loading: false,
      options: []
    }
  },
  watch: {
    testTypeId(val) {
      this.options = []
      if (val) {
        this.getList()
      }
    },
    defaultVal(val) {
      this.value = val
    }
  },
  created() {
    if (this.createdIs) {
      this.getList()
      this.value = this.defaultVal
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await levelResultRaw('get', null, { params: { all: 1 }})
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
