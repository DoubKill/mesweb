<template>
  <div>
    <!-- 物料类型下拉 -->
    <el-select
      v-model="value"
      placeholder="请选择物料类型"
      :loading="loading"
      filterable
      remote
      reserve-keyword
      :remote-method="remoteMethod"
      @change="changSelect"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.global_name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import { classesListUrl } from '@/api/base_w'
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
    },
    warehouseName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value: this.defaultVal,
      loading: false,
      options: []
    }
  },
  watch: {
    defaultVal(val) {
      this.value = val
    },
    warehouseName(val) {
      // 仓库名称
      this.getList()
    }
  },
  created() {
    if (this.createdIs) {
      this.getList()
    }
  },
  methods: {
    async getList(query) {
      try {
        this.loading = true
        const obj = { all: 1, class_name: '原材料类别', global_name: query }
        // if (!this.warehouseName) {
        //   delete obj.warehouseName
        // }
        const data = await classesListUrl('get', null, { params: obj })
        this.options = data.results || []
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.getList(query)
      } else {
        this.options = []
      }
    },
    visibleChange(val) {
      if (val && this.options.length === 0 && !this.createdIs) {
        this.getList()
      }
    },
    changSelect(val) {
      let arr = []
      arr = this.options.filter(D => D.id === val)
      this.$emit('changSelect', arr[0])
    }
  }
}
</script>

<style>

</style>
