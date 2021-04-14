<template>
  <!-- 停机类型 -->
  <el-select
    v-model="className"
    clearable
    placeholder="请选择"
    :loading="loading"
    :disabled="isDisabled"
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
import { equipEownType } from '@/api/base_w_two'
export default {
  props: {
    defaultVal: {
      type: [String, Number],
      default: null
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      className: this.defaultVal || '',
      EquipCateOptions: [],
      loading: true
    }
  },
  watch: {
    defaultVal(val) {
      this.className = val
    }
  },
  methods: {
    async equip_type_list() {
      try {
        const equip_type_list = await equipEownType('get', null, {
          params: { all: 1 }
        })
        this.EquipCateOptions = equip_type_list.results || []
      } catch (e) { throw new Error(e) }
      this.loading = false
    },
    visibleChange(visible) {
      if (visible && this.EquipCateOptions.length === 0) {
        this.equip_type_list()
      }
    },
    classChanged(val) {
      const obj = this.EquipCateOptions.find(D => D.id === val)
      this.$emit('shutdownMoldChange', obj)
    }
  }
}
</script>
