<template>
  <!-- 配料设备编码 -->
  <el-select
    :value="id"
    :clearable="!createdIs"
    placeholder="请选择配料设备"
    :disabled="readIs"
    :multiple="multipleIs"
    @change="changeFun"
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
      type: [Number, String, Array],
      required: false,
      default: undefined
    },
    //  created里面加载
    createdIs: {
      type: Boolean,
      default: false
    },
    //  是否只读
    readIs: {
      type: Boolean,
      default: false
    },
    multipleIs: { // 是否多选
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

        if (this.createdIs && this.equipOptions.length > 0) {
          this.changeFun(this.equipOptions[0].id)
        }
      })
    },
    changeFun(id) {
      this.$emit('change', id)
      if (this.multipleIs) {
        const arr = []
        id.forEach(D => {
          const obj = this.equipOptions.find(d => d.id === D)
          arr.push(obj)
        })
        this.$emit('changeFun', arr)
        return
      }
      this.$emit('changeFun', this.equipOptions.find(D => D.id === id))
    },
    visibleChange(visible) {
      if (visible && this.equipOptions.length === 0) {
        this.getEquip()
      }
    }
  }
}
</script>
