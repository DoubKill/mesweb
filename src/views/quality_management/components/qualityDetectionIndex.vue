<template>
  <div>
    <!-- 原材料-检测指标;试验指标 -->
    <el-select
      v-model="value"
      placeholder="请选择试验指标"
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
import { testIndicatorsRaw } from '@/api/base_w_three'
export default {
  props: {
  },
  data() {
    return {
      value: '',
      options: []
    }
  },
  watch: {
  },
  methods: {
    async getList() {
      try {
        const data = await testIndicatorsRaw('get', null, { all: 1 })
        this.options = data || []
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
