<template>
  <!-- 原材料快检  检测类型 -->
  <el-select
    v-model="className"
    clearable
    placeholder="请选择"
    filterable
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
import { materialExamineType } from '@/api/base_w_three'

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
        const equip_type_list = await materialExamineType('get', null, {
          params: { all: 1 }
        })
        this.EquipCateOptions = equip_type_list.results || []
      } catch (e) { throw new Error(e) }
    },
    visibleChange(visible) {
      if (visible) {
        this.equip_type_list()
      }
    },
    classChanged(val) {
      const obj = this.EquipCateOptions.find(D => D.id === val)
      this.$emit('typeSelect', obj)
    }
  }
}
</script>
