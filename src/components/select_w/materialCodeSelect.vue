<template>
  <div>
    <!-- 物料编码下拉 -->
    <el-select
      v-model="value"
      filterable
      placeholder="请选择"
      :loading="loading"
      :clearable="isClearable"
      :allow-create="isAllowCreate"
      @visible-change="visibleChange"
      @change="changSelect"
    >
      <el-option
        v-for="(item,i) in options"
        :key="i"
        :label="item.label"
        :value="item.material_no"
      />
    </el-select>
  </div>
</template>

<script>
import { materialCount } from '@/api/base_w'
import { bzMixinInventorySummary } from '@/api/base_w_four'
export default {
  props: {
    //  created里面加载
    createdIs: {
      type: Boolean,
      default: false
    },
    isClearable: {
      type: Boolean,
      default: false
    },
    isAllowCreate: { // 创建条目
      type: Boolean,
      default: false
    },
    defaultVal: {
      type: String,
      default: null
    },
    storeName: {
      type: String,
      default: null
    },
    station: {
      type: String,
      default: null
    },
    labelShow: { // label取值
      type: String,
      default: 'material_no'
    },
    status: {
      type: String,
      default: null
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
    status(val) {
      if (val) {
        this.value = ''
        this.options = []
        this.getList()
      }
    },
    storeName(val) {
      this.value = ''
      this.options = []
    },
    station(val) {
      if (this.storeName === '混炼胶库') {
        this.value = ''
        this.options = []
      }
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
        if (this.storeName === '混炼胶库' && (!this.station || !this.status)) {
          this.$message.info('请选择出库口 和 品质状态')
          return
        }
        this.loading = true
        const _api = this.storeName === '混炼胶库' ? bzMixinInventorySummary : materialCount
        const data = await _api('get', null, { params: { store_name: this.storeName, status: this.status, station: this.station }})
        if (this.labelShow === 'material_name') {
          data.forEach(d => {
            d.label = d.material_name + ' / ' + d.material_no
          })
        } else {
          data.forEach(d => {
            d.label = d.material_no
          })
        }

        this.options = data || []
        this.loading = false
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
      if (this.isAllowCreate) {
        this.$emit('changSelect', { material_no: val })
        return
      }
      let arr = []
      arr = this.options.filter(D => D.material_no === val)
      this.$emit('changSelect', arr[0])
    }
  }
}
</script>

<style>

</style>
