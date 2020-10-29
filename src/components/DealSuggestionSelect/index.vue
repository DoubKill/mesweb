<template>
  <el-select
    v-model="suggestion_desc"
    clearable
    placeholder="请选择"
    @visible-change="visibleChange"
    @change="change"
  >
    <el-option
      v-for="(item, index) in suggestionOptions"
      :key="index"
      :label="item.suggestion_desc"
      :value="item.suggestion_desc"
    />
  </el-select>
</template>

<script>
import { dealSuggestion } from '@/api/material-deal-result'

export default {
  data() {
    return {
      suggestion_desc: '',
      suggestionOptions: []
    }
  },
  methods: {
    change(desc) {
      this.$emit('dealSuggestionChange', this.suggestion_desc)
    },
    async getDealSuggestion() {
      const response = await dealSuggestion(null)
      this.suggestionOptions = response.results
    //   console.log(response)
    },
    visibleChange(visible) {
      if (visible) {
        this.getDealSuggestion()
      }
    }
  }
}
</script>
