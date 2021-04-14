<template>
  <el-select
    :value="id"
    clearable
    placeholder="请选择"
    :multiple="isMultiple"
    :style="{'width':widthSelect}"
    @change="$emit('change', $event)"
    @visible-change="visibleChange"
  >
    <el-option
      v-for="item in stageOptions"
      :key="item.id"
      :label="item.global_name"
      :value="item.global_name"
    />
  </el-select>
</template>

<script>
import { stage_global_url } from '@/api/display_static_fun'
export default {
  model: {
    prop: 'id',
    event: 'change'
  },
  props: {
    id: {
      type: [Number, String, Array],
      required: false,
      default: undefined
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    widthSelect: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      stageOptions: []
    }
  },
  created() {
    this.getStageOptions()
  },
  methods: {
    async getStageOptions() {
      const response = await stage_global_url('get')
      this.stageOptions = response.results
    },
    visibleChange(visible) {
      if (visible) {
        this.getStageOptions()
      }
    }
  }
}
</script>
