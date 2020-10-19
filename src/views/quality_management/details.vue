<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="日期">
        <el-date-picker
          v-model="dayTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="倒班规则">
        <plan-schedules-select :day-time="dayTime" @planScheduleSelected="planScheduleSelected" />
      </el-form-item>
      <el-form-item label="机台">
        <equip-select @equipSelected="equipSelected" />
      </el-form-item>
      <el-form-item label="班次">
        <class-select @classSelected="classSelected" />
      </el-form-item>
      <el-form-item label="胶料">
        <product-no-select
          :is-stage-productbatch-no-remove="true"
          :make-use-batch="true"
          @productBatchingChanged="productBatchingChanged"
        />
      </el-form-item>
      <el-form-item label="综合处理意见">
        <el-select />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import PlanSchedulesSelect from '@/components/PlanSchedulesSelect'
import EquipSelect from '@/components/EquipSelect'
import ClassSelect from '@/components/ClassSelect'
import ProductNoSelect from '@/components/ProductNoSelect'

export default {
  components: { PlanSchedulesSelect, EquipSelect, ClassSelect, ProductNoSelect },
  data() {
    return {
      dayTime: dayjs().format('YYYY-MM-DD')
    }
  },
  methods: {
    planScheduleSelected(planScheduleId) {
      console.log(planScheduleId)
    },
    equipSelected(equip) {
      console.log(equip)
    },
    classSelected(className) {
      console.log(className)
    },
    productBatchingChanged(val) {
      console.log(val)
    }
  }
}
</script>

<style>

</style>
