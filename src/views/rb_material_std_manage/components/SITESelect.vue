<template>
  <!-- SITE下拉框 -->
  <el-select
    :value="give"
    clearable
    placeholder="请选择"
    :disabled="isDisabled"
    @change="changeFun"
    @visible-change="visibleChange"
  >
    <el-option
      v-for="item in list"
      :key="item.id"
      :label="item.global_name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { SITE_global_url } from '@/api/rubber_recipe_fun'
export default {
  model: {
    prop: 'give',
    event: 'returnBack'
  },
  props: {
    give: {
      type: [Number, String],
      required: false,
      default: undefined
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getOptions()
  },
  methods: {
    async getOptions() {
      const response = await SITE_global_url('get')
      this.list = response.results
    },
    visibleChange(visible) {
    //   if (visible && this.list.length === 0) {
    //     this.getOptions()
    //   }
    },
    changeFun(event) {
      this.$emit('returnBack', event)
      const arr = this.list.filter(D => event === D.id)
      this.$emit('changeFun', arr[0])
      // 可以加其他得事件
    }
  }
}
</script>
