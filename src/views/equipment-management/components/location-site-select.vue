<template>
  <!-- 位置点 基础模块 -->
  <el-select
    v-model="className"
    clearable
    placeholder="请选择"
    @visible-change="visibleChange"
    @change="classChanged"
  >
    <el-option
      v-for="item in EquipCateOptions"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { basicsLocationNameList } from '@/api/location-site'
export default {
  props: {
    defaultVal: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      className: this.defaultVal || '',
      EquipCateOptions: []
    }
  },
  methods: {
    async equip_type_list() {
      try {
        const equip_type_list = await basicsLocationNameList({ all: 1 })
        let arr = [] // 过滤启用的
        arr = equip_type_list.filter(D => D.used_flag === 1)
        this.EquipCateOptions = arr || []
      } catch (e) { throw new Error(e) }
    },
    visibleChange(visible) {
      if (visible && this.EquipCateOptions.length === 0) {
        this.equip_type_list()
      }
    },
    classChanged(val) {
      const obj = this.EquipCateOptions.find(D => D.id === val)
      this.$emit('locationSelect', obj)
    }
  }
}
</script>
