<template>
  <!-- 物料 -->
  <el-select
    :value="id"
    :clearable="!createdIs"
    placeholder="请选择物料"
    :disabled="readIs"
    :multiple="multipleIs"
    @change="changeFun"
    @visible-change="visibleChange"
  >
    <el-option
      v-for="item in equipOptions"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { xlMaterial } from '@/api/base_w_three'

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
    //  created里面加载
    isDefault: {
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
    },
    show: { // 输入框显示
      type: Boolean,
      default: false
    },
    equipNoVal: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // equipId: null,
      equipOptions: []
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.getEquip()
      }
    }
  },
  created() {
    if (this.createdIs) {
      this.getEquip()
    }
  },
  methods: {
    getEquip() {
      xlMaterial('get', null, { params: { equip_no: this.equipNoVal }}).then(response => {
        this.equipOptions = response

        if (this.createdIs && this.equipOptions.length > 0 && this.isDefault) {
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
