<template>
  <!-- 设备类型 -->
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
      :label="item.global_name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { equip_type_url } from '@/api/equip_fun'
export default {
  props: {
    defaultVal: {
      type: [String, Number],
      default: null
    },
    isCreated: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      className: this.defaultVal || [],
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
        const equip_type_list = await equip_type_url('get', {
          params: {}
        })
        this.EquipCateOptions = equip_type_list.results || []
      } catch (e) { throw new Error(e) }
    },
    visibleChange(visible) {
      if (visible && this.EquipCateOptions.length === 0) {
        this.equip_type_list()
      }
    },
    classChanged(val) {
      const obj = this.EquipCateOptions.find(D => D.id === val)
      this.$emit('equipTypeSelect', obj)
    }
  }
}
</script>
