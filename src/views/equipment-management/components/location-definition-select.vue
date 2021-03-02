<template>
  <!-- 设备部位定义 下拉框 -->
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
import { equipPart } from '@/api/base_w_two'
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
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    equipNo: {
      type: [Number, String],
      default: null
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
      if (!val) {
        this.className = ''
      } else {
        this.className = val
      }
    },
    equipNo() {
      this.equip_type_list()
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
        this.loading = true
        const data = await equipPart('get', null, { params: { all: 1, equip_no: this.equipNo }})
        this.EquipCateOptions = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
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
