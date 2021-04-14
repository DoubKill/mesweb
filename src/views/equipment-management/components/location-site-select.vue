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
      :disabled="item.disabled"
    />
  </el-select>
</template>

<script>
import { basicsLocationNameList } from '@/api/location-site'
export default {
  props: {
    defaultVal: {
      type: [Number, String],
      required: false,
      default: undefined
    },
    isCreated: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      className: this.defaultVal || '',
      EquipCateOptions: []
    }
  },
  watch: {
    defaultVal(val) {
      this.className = val
    }
  },
  created() {
    if (this.isCreated) {
      this.equip_type_list()
    }
  },
  methods: {
    async equip_type_list() {
      try {
        const equip_type_list = await basicsLocationNameList({ all: 1 })
        // const arr = [] // 过滤启用的
        equip_type_list.forEach(D => {
          if (D.used_flag === 0) {
            D.disabled = true
          } else {
            D.disabled = false
          }
        })
        // arr = equip_type_list.filter(D => D.used_flag === 1)
        this.EquipCateOptions = equip_type_list || []
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
