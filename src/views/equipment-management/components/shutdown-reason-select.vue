<template>
  <!-- 停机原因下拉框 -->
  <el-select
    v-model="className"
    clearable
    placeholder="请选择"
    filterable
    allow-create
    default-first-option
    :loading="loading"
    :disabled="isDisabled"
    @visible-change="visibleChange"
    @change="classChanged"
  >
    <el-option
      v-for="item in EquipCateOptions"
      :key="item.id"
      :label="item.desc"
      :value="item.desc"
    />
  </el-select>
</template>

<script>
import { equipDownReason } from '@/api/base_w_two'
export default {
  props: {
    defaultVal: {
      type: [String, Number],
      default: null
    },
    equipDownTypeName: {
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
    },
    equipDownTypeName() {
      this.EquipCateOptions = []
      this.loading = true
      this.equip_type_list()
    }
  },
  created() {
  },
  methods: {
    async equip_type_list() {
      try {
        const equip_type_list = await equipDownReason('get', null, {
          params: { all: 1, equip_down_type_name: this.equipDownTypeName || '' }
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
      let obj = this.EquipCateOptions.find(D => D.desc === val)
      if (!obj) {
        obj = { desc: val }
      }
      this.$emit('shutdownReasonChange', obj)
    }
  }
}
</script>
