<template>
  <el-select
    v-model="name"
    clearable
    placeholder="请选择配料设备"
    @visible-change="visibleChange"
    @change="selectChanged"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { warehouseNames } from '@/api/warehouse'

export default {
  data() {
    return {
      name: '',
      options: []
    }
  },
  methods: {
    getList() {
      warehouseNames().then(response => {
        this.options = response
      })
    },
    visibleChange(visible) {
      if (visible && this.options.length === 0) {
        this.getList()
      }
    },
    selectChanged(val) {
      const obj = this.options.find(D => D.id === val)
      this.$emit('selectChanged', obj)
    }
  }
}
</script>
