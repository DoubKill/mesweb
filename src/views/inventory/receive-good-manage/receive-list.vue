<template>
  <div>
    <!-- 发货计划管理 -->
    <el-form :inline="true">
      <el-form-item label="时间">
        <el-date-picker
          v-model="search.time"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select
          v-model="search.status"
          clearable
          placeholder="请选择"
          @change="changeList"
        >
          <el-option
            v-for="item in options1"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码">
        <material-type-select @change="materialCodeFun" />
      </el-form-item>
      <el-form-item label="发货类型">
        <deliverTypeSelect @changeSelect="deliverTypeSelectFun" />
      </el-form-item>
      <el-form-item label="目的地">
        <destinationSelect @changeSelect="destinationSelectFun" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { setDate } from '@/utils/index'
import commitVal from '@/utils/common'
import MaterialTypeSelect from '@/components/MaterialTypeSelect'
import deliverTypeSelect from '@/components/select_w/deliverTypeSelect'
import destinationSelect from '@/components/select_w/destinationSelect'
export default {
  components: { MaterialTypeSelect, deliverTypeSelect, destinationSelect },
  data() {
    return {
      search: {
        time: setDate()
      },
      options1: commitVal.statusList
    }
  },
  methods: {
    changeList() {},
    materialCodeFun() {},
    deliverTypeSelectFun() {},
    destinationSelectFun() {}
  }
}
</script>

<style>

</style>
