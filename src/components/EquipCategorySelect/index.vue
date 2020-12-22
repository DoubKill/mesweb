<template>
  <el-select
    :value="id"
    clearable
    placeholder="请选择"
    @change="$emit('change', $event)"
    @visible-change="visibleChange"
  >
    <el-option
      v-for="item in equipsCategories"
      :key="item.id"
      :label="item.category_name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { equip_category_url } from '@/api/rubber_recipe_fun'
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
    equipTypeName: {
      type: String,
      required: false,
      default: '密炼设备'
    }
  },
  data() {
    return {
      equipsCategories: []
    }
  },
  created() {
    this.getEquipsCategories()
  },
  methods: {
    async getEquipsCategories() {
      const response = await equip_category_url('get', {
        params: {
          all: 1,
          equip_type_name: this.equipTypeName
        }
      })
      this.equipsCategories = response.results
    },
    visibleChange(visible) {
      if (visible) {
        this.getEquipsCategories()
      }
    }
  }
}
</script>
