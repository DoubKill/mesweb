<template>
  <div>
    <!-- 仓库下拉 -->
    <el-select
      v-model="value"
      placeholder="请选择仓库"
      :loading="loading"
      @visible-change="visibleChange"
      @change="changSelect"
    >
      <el-option
        v-for="item in options"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </div>
</template>

<script>
import { levelResult } from '@/api/base_w'
export default {
  props: {
    //  created里面加载
    createdIs: {
      type: Boolean,
      default: false
    },
    defaultVal: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      value: this.defaultVal,
      loading: false,
      options: ['线边库', '终炼胶库', '原材料库']
    }
  },
  watch: {
    defaultVal(val) {
      this.value = val
    }
  },
  created() {
    if (this.createdIs) {
      // this.getList()
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await levelResult('get', null, { params: { all: 1 }})
        this.options = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    visibleChange(val) {
      if (val && this.options.length === 0 && !this.createdIs) {
        // this.getList()
      }
    },
    changSelect(val) {
      // let arr = []
      // arr = this.options.filter(D => D.id === val)
      this.$emit('changSelect', val)
    }
  }
}
</script>

<style>

</style>
