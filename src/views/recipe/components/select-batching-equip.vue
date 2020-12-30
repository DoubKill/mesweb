<template>
  <!-- 配料设备编码 -->
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
    },
    //  created里面加载
    createdIs: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // equipId: null,
      equipOptions: []
    }
  },
  created() {
    if (this.createdIs) {
      this.getEquip()
    }
  },
  methods: {
    getEquip() {
      getEquip({ all: 1, category_name: '称量设备' }).then(response => {
        this.equipOptions = response.results

        if (this.createdIs) {
          this.$emit('change', this.equipOptions[0].id)
        }
      })
    },
    visibleChange(visible) {
      if (visible && this.equipOptions.length === 0) {
        this.getEquip()
      }
    }
  }
}
</script>
