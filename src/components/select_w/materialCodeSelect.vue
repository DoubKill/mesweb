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
import { bzMixinInventorySummary, bzFinalInventorySummary } from '@/api/base_w_four'
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
    },
    isNormal: { // 是正常出库
      type: Boolean,
      default: false
    },
    exWarehouse: { // 是出库
      type: Boolean,
      default: false
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
        // this.getList()
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
        if (this.$route.fullPath === '/compound-rubber-manage' && this.storeName === '混炼胶库' && !this.station) {
          this.$message.info('请选择出库口')
          return
        }
        this.loading = true
        let _api = this.storeName === '混炼胶库' ? bzMixinInventorySummary : bzFinalInventorySummary
        if (!['混炼胶库', '终炼胶库'].includes(this.storeName)) {
          _api = materialCount
        }
        const obj = {
          store_name: this.storeName,
          status: this.status,
          station: this.station,
          location_status: '有货货位',
          lot_existed: 1
        }
        if (!this.exWarehouse) {
          delete obj.location_status
        }
        if (!this.isNormal) {
          delete obj.lot_existed
        }
        const data = await _api('get', null, { params: obj })
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
