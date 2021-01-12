<template>
  <div>
    <!-- 投入设备 罐号 选择器 -->
    <el-select
      v-model="value"
      placeholder="请选择投入设备"
      :loading="loading"
      clearable
      @visible-change="visibleChange"
      @change="changSelect"
    >
      <el-option
        v-for="item in options"
        :key="item[isEquip]"
        :label="item[isEquip]"
        :value="item[isEquip]"
      />
    </el-select>
  </div>
</template>

<script>
import { equipTank } from '@/api/base_w_two'
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
    isEquip: {
      type: String,
      default: 'equip_no'
    }
  },
  data() {
    return {
      value: '',
      loading: false,
      options: []
    }
  },
  watch: {
    defaultVal(val) {
      this.value = val
    }
  },
  created() {
    if (this.createdIs) {
      this.getList()
      this.value = this.defaultVal
    }
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const data = await equipTank('get')
        let options = data.results || []
        var obj = {}
        var newArr
        if (this.isEquip === 'equip_no') {
          // 根据equip_no去重
          newArr = options.reduce((item, next) => {
            obj[next.equip_no]
              ? ' '
              : (obj[next.equip_no] = true && item.push(next))
            return item
          }, [])
          options = newArr || []
        } else {
          newArr = options.reduce((item, next) => {
            obj[next.tank_no]
              ? ' '
              : (obj[next.tank_no] = true && item.push(next))
            return item
          }, [])
          options = newArr || []
        }
        this.options = options
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    visibleChange(val) {
      if (val && this.options.length === 0 && !this.createdIs) {
        this.getList()
      }
    },
    changSelect(val) {
      let arr = []
      arr = this.options.filter(D => {
        return D[this.isEquip] === val
      })
      this.$emit('changSelect', arr[0])
    }
  }
}
</script>

<style>

</style>
