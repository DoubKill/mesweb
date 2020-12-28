<template>
  <el-select
    :value="id"
    clearable
    placeholder="请选择"
    @change="$emit('change', $event)"
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
  model: {
    prop: 'id',
    event: 'change'
  },
  props: {
    id: {
      type: [Number, String],
      required: false,
      default: undefined
    }
  },
  data() {
    return {
      // equipId: null,
      equipOptions: []
    }
  },
  created() {
    this.getEquip()
  },
  methods: {
    getEquip() {
      getEquip({ all: 1, category_name: '称量设备' }).then(response => {
        this.equipOptions = response.results
      })
    },
    visibleChange(visible) {
      if (visible) {
        this.getEquip()
      }
    }
  }
}
</script>
