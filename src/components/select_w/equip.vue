<template>
  <div>
    <!-- 机台下拉框 -->
    <el-select
      v-model="_equip_no"
      clearable
      placeholder="请选择机台"
      :loading="loading"
      @change="changeSearch"
      @visible-change="visibleChange"
    >
      <el-option
        v-for="item in machineList"
        :key="item.equip_no"
        :label="item.equip_no"
        :value="item.equip_no"
      />
    </el-select>
  </div>
</template>

<script>
import { equipUrl } from '@/api/base_w'
export default {
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    equip_no_props: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      machineList: [],
      loading: false
    }
  },
  computed: {
    _equip_no: {
      get() {
        return this.equip_no_props
      },
      set(equip_no) {
        this.$emit('update:equip_no_props', equip_no)
      }
    }
  },
  created() {
  },
  methods: {
    getMachineList() {
      var _this = this
      _this.loading = true
      // eslint-disable-next-line object-curly-spacing
      equipUrl('get', { params: { all: 1 } })
        .then(function(response) {
          _this.machineList = response.results || []
          _this.loading = false
        })
        .catch(function() { _this.loading = false })
    },
    changeSearch(id) {
      this.$emit('changeSearch', id)
    },
    visibleChange(bool) {
      if (bool && this.machineList.length === 0) {
        this.getMachineList()
      }
    }
  }
}
</script>

<style>
</style>
