<template>
  <div>
    <!-- 仓库位置 出库口下拉 -->
    <el-select
      v-model="value"
      placeholder="请选择"
      :loading="loading"
      :clearable="isClear"
      no-data-text="暂无启用的"
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
import { stationInfo } from '@/api/warehouse'
export default {
  props: {
    //  created里面加载
    createdIs: {
      type: Boolean,
      default: false
    },
    defaultVal: {
      type: [Number, String],
      default: null
    },
    // 是否可清空
    isClear: {
      type: Boolean,
      default: false
    },
    warehouseName: {
      type: String,
      default: null
    },
    startUsing: { // 只显示启用的
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: null,
      loading: false,
      options: []
    }
  },
  watch: {
    defaultVal(val) {
      this.value = val || null
    },
    warehouseName(val) {
      this.value = ''
    }
  },
  created() {
    if (this.createdIs) {
      this.getList()
    }
  },
  methods: {
    async getList() {
      try {
        if (!this.warehouseName) {
          this.options = []
          return
        }
        this.loading = true

        const data = await stationInfo({ all: 1, warehouse_name: this.warehouseName })
        this.loading = false
        if (this.startUsing) {
          this.options = data.filter(D => { return D.use_flag })
          return
        }
        this.options = data || []
        if (this.warehouseName === '混炼胶库' && this.createdIs) {
          const a = localStorage.getItem('hl-station')
          this.value = a ? JSON.parse(a).id : ''
          this.$emit('changSelect', this.options.filter(D => D.id === this.value)[0])
          return
        }
        if (this.createdIs) {
          this.$emit('changSelect', {})
        }
      } catch (e) {
        this.loading = false
      }
    },
    visibleChange(val) {
      if (val && !this.createdIs) {
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
