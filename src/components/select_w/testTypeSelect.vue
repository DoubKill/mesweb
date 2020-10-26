<template>
  <div>
    <el-select
      v-model="value"
      placeholder="请选择试验类型"
      clearable
      @visible-change="visibleChange"
      @change="changeSelect"
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
import { testTypes } from '@/api/base_w'
export default {
  data() {
    return {
      value: '',
      options: []
    }
  },
  methods: {
    async getList() {
      try {
        const { results } = await testTypes('get', null, { params: { all: 1 }})
        this.options = results || []
      } catch (e) {
        //
      }
    },
    visibleChange(val) {
      if (val && this.options.length === 0) {
        this.getList()
      }
    },
    changeSelect(val) {
      this.$emit('changeSelect', val)
    }
  }
}
</script>

<style>

</style>
