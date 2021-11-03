<template>
  <div>
    <!-- 炭黑库 入出库履历查询 -->
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
