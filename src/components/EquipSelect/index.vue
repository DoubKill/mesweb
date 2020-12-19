<template>
  <el-select
    v-model="equipId"
    clearable
    placeholder="请选择"
    :multiple="isMultiple"
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
  props: {
    isMultiple: {
      type: Boolean,
      default: false
    },
    defaultVal: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      equipId: this.defaultVal || null,
      equipOptions: []
    }
  },
  watch: {
    defaultVal(val) {
      this.equipId = val
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
    equipChanged(arr) {
      if (this.isMultiple) {
        this.$emit('equipSelected', arr)
        return
      }
      this.$emit('equipSelected', this.equipOptions.find(option => option.id === this.equipId))
    }
  }
}
</script>
