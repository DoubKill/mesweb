<template>
  <div>
    <!-- 数据点 -->
    <el-select
      v-model="value"
      placeholder="请选择数据点"
      :multiple="multipleIs"
      :loading="loading"
      @visible-change="visibleChange"
      @change="changSelect"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import { dataPoints } from '@/api/base_w'
export default {
  props: {
    multipleIs: {
      type: Boolean,
      default: false
    }, // 试验类型
    testTypeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      value: this.multipleIs ? [] : '',
      loading: true,
      options: []
    }
  },
  watch: {
    testTypeId(val) {
      this.options = []
      if (val) {
        this.getList()
      }
    }
  },
  methods: {
    async getList() {
      try {
        const data = await dataPoints('get', null, { params: { test_type_id: this.testTypeId, all: 1 }})
        this.options = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    visibleChange(val) {
    //   if (val && this.options.length === 0) {
    //     this.getList()
    //   }
    },
    changSelect(val) {
      this.$emit('changSelect', val)
    }
  }
}
</script>

<style>

</style>
