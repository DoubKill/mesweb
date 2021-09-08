<template>
  <div>
    <!-- 炭黑库 入出库履历查询 -->
    >>>>>>> bbeb9b9d7ec5220a2064e8967a73aadb312a9290
    <materialInoutRecord :warehouse-name-props="'炭黑库'" />
  </div>
</template>

<script>
import materialInoutRecord from '@/views/inventory/rubber-warehouse/material_inout_record.vue'

export default {
  name: 'DeliveryInOutRecord',
  components: { materialInoutRecord }
}
</script>

<style>

</style>
