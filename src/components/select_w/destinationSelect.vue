<template>
  <div>
    <!-- 目的地 -->
    <el-select
      v-model="value"
      placeholder="请选择目的地"
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
// import { globalCodesUrl } from '@/api/base_w'
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
        // const data = await globalCodesUrl('get', null, { all: 1, class_name: '发货类型' })
        // this.options = data || []
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
