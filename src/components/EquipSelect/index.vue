<template>
  <el-select
    v-model="equipId"
    clearable
    placeholder="请选择"
    @change="equipChanged"
    @visible-change="visibleChange"
  >
    <el-option
      v-for="item in equipOptions"
      :key="item.id"
      :label="item.equip_no"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { getEquip } from '@/api/banburying-performance-manage'

export default {
  data() {
    return {
      equipId: null,
      equipOptions: []
    }
  },
  methods: {
    visibleChange(visible) {
      if (visible) {
        getEquip({ all: 1 }).then(response => {
          this.equipOptions = response.results
        })
      }
    },
    equipChanged() {
      this.$emit('equipSelected', this.equipOptions.find(option => option.id === this.equipId))
    }
  }
}
</script>
