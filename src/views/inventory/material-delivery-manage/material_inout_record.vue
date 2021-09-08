<template>
  <div>
    <!-- 原材料 入出库履历查询 -->
    <materialInoutRecord :warehouse-name-props="'原材料库'" />
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
