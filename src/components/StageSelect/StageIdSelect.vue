<template>
  <el-select
    :value="id"
    clearable
    placeholder="请选择"
    @change="$emit('change', $event)"
    @visible-change="visibleChange"
  >
    <el-option
      v-for="item in stageOptions"
      :key="item.id"
      :label="item.global_name"
      :value="item.id"
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
      type: [Number, String],
      required: false,
      default: undefined
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
