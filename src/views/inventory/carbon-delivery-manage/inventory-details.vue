<template>
  <div>
    <!-- 炭黑库-库存明细 -->
    <materialInventoryManage :warehouse-name-props="'炭黑库'" />
  </div>
</template>

<script>
import materialInventoryManage from '@/views/inventory/rubber-warehouse/material-inventory-manage.vue'
export default {
  name: 'CarbonInventoryDetails',
  components: { materialInventoryManage }
}
</script>

<style>

</style>
