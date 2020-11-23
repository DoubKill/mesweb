<template>
  <!-- 原材料类别 -->
  <el-select
    :value="id"
    clearable
    placeholder="请选择"
    @change="$emit('change', $event)"
    @visible-change="visibleChange"
  >
    <el-option
      v-for="item in materialTypeOptions"
      :key="item.id"
      :label="item.global_name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { materialTypes } from '@/api/warehouse'
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
      materialType: null,
      materialTypeOptions: []
    }
  },
  created() {
    this.getMaterialTypes()
  },
  methods: {
    async getMaterialTypes() {
      try {
        const response = await materialTypes()
        this.materialTypeOptions = response.results
      } catch (e) {
        //
      }
    //   stationTypes().then(response => {
    //     this.stationTypeOptions = response.results
    //   })
    },
    visibleChange(visible) {
      if (visible) {
        this.getMaterialTypes()
      }
    }
  }
}
</script>
