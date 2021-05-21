<template>
  <!-- 原材料快检  设备类型 -->
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
      :label="item.type_name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { materialEquipmentType } from '@/api/base_w_three'

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
      className: this.defaultVal || null,
      EquipCateOptions: []
    }
  },
  watch: {
    defaultVal(val) {
      this.className = val || null
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
        const equip_type_list = await materialEquipmentType('get', null, {
          params: {}
        })
        this.EquipCateOptions = equip_type_list || []
      } catch (e) { throw new Error(e) }
    },
    visibleChange(visible) {
      if (visible) {
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
