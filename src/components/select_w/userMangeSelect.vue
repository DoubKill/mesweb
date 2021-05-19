<template>
  <div>
    <!-- 用户管理下拉框 -->
    <el-select
      v-model="value"
      placeholder="请选择用户"
      clearable
      @visible-change="visibleChange"
      @change="changeSelect"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.username"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import { personnelsUrl } from '@/api/user'
export default {
  props: {
    defaultVal: {
      type: [String, Number],
      default: null
    },
    isCreated: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: this.defaultVal,
      options: []
    }
  },
  watch: {
    defaultVal(val) {
      this.value = val || null
      this.getList()
    }
  },
  created() {
    if (this.isCreated) {
      this.getList()
    }
  },
  methods: {
    async getList() {
      try {
        const { results } = await personnelsUrl('get', null, { params: { all: 1 }})
        this.options = results || []
      } catch (e) {
        //
      }
    },
    visibleChange(val) {
      if (val && this.options.length === 0) {
        this.getList()
      }
    },
    changeSelect(val) {
      let arr = []
      arr = this.options.filter(D => D.id === val)
      this.$emit('changeSelect', arr[0])
    }
  }
}
</script>

<style>

</style>
